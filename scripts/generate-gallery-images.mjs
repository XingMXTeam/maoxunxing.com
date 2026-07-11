import fs from 'node:fs/promises'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import sharp from 'sharp'

const execFileAsync = promisify(execFile)
const sourceDir = path.resolve('assets/photos')
const outputDir = path.resolve('static/images/gallery')
const dataDir = path.resolve('data')
const manifestPath = path.join(dataDir, 'gallery.json')
const supportedPattern = /\.(?:jpe?g|png|webp|gif|avif|heic|heif|tiff?)$/i
const minimumSuccessfulImages = 200

function slugify(value) {
  const slug = value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '')

  return slug || 'photo'
}

function humanize(value) {
  return value.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()
}

async function removePartialOutput(outputPath) {
  await fs.rm(outputPath, { force: true })
}

async function convertSharpInput(sourcePath, outputPath, decoder) {
  const result = await sharp(sourcePath, {
    failOn: 'none',
    limitInputPixels: false,
  })
    .rotate()
    .resize({
      width: 2400,
      height: 2400,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 84, effort: 4, smartSubsample: true })
    .toFile(outputPath)

  return {
    decoder,
    width: result.width,
    height: result.height,
  }
}

async function convertWithSharp(sourcePath, outputPath) {
  const metadata = await sharp(sourcePath, {
    failOn: 'none',
    limitInputPixels: false,
  }).metadata()

  return convertSharpInput(sourcePath, outputPath, `sharp:${metadata.format || 'unknown'}`)
}

async function convertWithHeif(sourcePath, outputPath) {
  const intermediatePath = `${outputPath}.heif.png`
  await removePartialOutput(outputPath)
  await removePartialOutput(intermediatePath)

  try {
    await execFileAsync('heif-convert', [sourcePath, intermediatePath], {
      maxBuffer: 20 * 1024 * 1024,
    })
    return await convertSharpInput(intermediatePath, outputPath, 'heif-convert')
  } finally {
    await removePartialOutput(intermediatePath)
  }
}

async function convertWithCommand(command, args, outputPath) {
  await removePartialOutput(outputPath)
  await execFileAsync(command, args, { maxBuffer: 10 * 1024 * 1024 })

  const metadata = await sharp(outputPath).metadata()
  if (!metadata.width || !metadata.height || metadata.format !== 'webp') {
    throw new Error(`${command} did not produce a valid WebP image`)
  }

  return {
    decoder: command,
    width: metadata.width,
    height: metadata.height,
  }
}

async function convertWithFallbacks(sourcePath, outputPath) {
  const attempts = []

  try {
    return await convertWithSharp(sourcePath, outputPath)
  } catch (error) {
    attempts.push(`sharp: ${error instanceof Error ? error.message : String(error)}`)
  }

  try {
    return await convertWithHeif(sourcePath, outputPath)
  } catch (error) {
    attempts.push(`heif-convert: ${error instanceof Error ? error.message : String(error)}`)
  }

  const imagemagickCommands = [
    ['magick', [sourcePath, '-auto-orient', '-resize', '2400x2400>', '-quality', '84', outputPath]],
    ['convert', [sourcePath, '-auto-orient', '-resize', '2400x2400>', '-quality', '84', outputPath]],
  ]

  for (const [command, args] of imagemagickCommands) {
    try {
      return await convertWithCommand(command, args, outputPath)
    } catch (error) {
      attempts.push(`${command}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  try {
    return await convertWithCommand(
      'ffmpeg',
      [
        '-v',
        'error',
        '-y',
        '-i',
        sourcePath,
        '-vf',
        "scale='min(2400,iw)':'min(2400,ih)':force_original_aspect_ratio=decrease",
        '-frames:v',
        '1',
        '-c:v',
        'libwebp',
        '-q:v',
        '75',
        outputPath,
      ],
      outputPath,
    )
  } catch (error) {
    attempts.push(`ffmpeg: ${error instanceof Error ? error.message : String(error)}`)
  }

  throw new Error(attempts.join(' | '))
}

await fs.rm(outputDir, { recursive: true, force: true })
await fs.mkdir(outputDir, { recursive: true })
await fs.mkdir(dataDir, { recursive: true })

const files = (await fs.readdir(sourceDir, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && supportedPattern.test(entry.name))
  .map((entry) => entry.name)
  .sort((a, b) => b.localeCompare(a, 'en', { numeric: true, sensitivity: 'base' }))

if (files.length === 0) {
  throw new Error(`No supported photos found in ${sourceDir}`)
}

const manifest = new Array(files.length)
const failures = []
let cursor = 0

async function convertNext() {
  while (true) {
    const index = cursor++
    if (index >= files.length) return

    const sourceName = files[index]
    const sourcePath = path.join(sourceDir, sourceName)
    const parsed = path.parse(sourceName)
    const outputName = `${String(index).padStart(4, '0')}-${slugify(parsed.name)}.webp`
    const outputPath = path.join(outputDir, outputName)

    try {
      const result = await convertWithFallbacks(sourcePath, outputPath)
      manifest[index] = {
        url: `/images/gallery/${outputName}`,
        alt: humanize(parsed.name),
        source: sourceName,
        width: result.width,
        height: result.height,
      }

      console.log(
        `[gallery] ${sourceName} (${result.decoder}) -> ${outputName} (${result.width}x${result.height})`,
      )
    } catch (error) {
      await removePartialOutput(outputPath)
      failures.push({ sourceName, error: error instanceof Error ? error.message : String(error) })
    }
  }
}

const workerCount = Math.min(2, files.length)
await Promise.all(Array.from({ length: workerCount }, () => convertNext()))

const successfulImages = manifest.filter(Boolean)
for (const failure of failures) {
  console.error(`[gallery] Skipped ${failure.sourceName}: ${failure.error}`)
}

if (successfulImages.length < minimumSuccessfulImages) {
  throw new Error(
    `Only ${successfulImages.length} gallery images were converted; at least ${minimumSuccessfulImages} are required`,
  )
}

await fs.writeFile(manifestPath, `${JSON.stringify(successfulImages, null, 2)}\n`, 'utf8')
console.log(
  `[gallery] Generated ${successfulImages.length} browser-safe WebP images; skipped ${failures.length}`,
)
