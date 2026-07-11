import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const sourceDir = path.resolve('assets/photos')
const outputDir = path.resolve('static/images/gallery')
const dataDir = path.resolve('data')
const manifestPath = path.join(dataDir, 'gallery.json')
const supportedPattern = /\.(?:jpe?g|png|webp|gif|avif|heic|heif|tiff?)$/i

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
      const metadata = await sharp(sourcePath, {
        failOn: 'none',
        limitInputPixels: false,
      }).metadata()

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

      manifest[index] = {
        url: `/images/gallery/${outputName}`,
        alt: humanize(parsed.name),
        source: sourceName,
        width: result.width,
        height: result.height,
      }

      console.log(
        `[gallery] ${sourceName} (${metadata.format || 'unknown'}) -> ${outputName} (${result.width}x${result.height})`,
      )
    } catch (error) {
      failures.push({ sourceName, error: error instanceof Error ? error.message : String(error) })
    }
  }
}

const workerCount = Math.min(4, files.length)
await Promise.all(Array.from({ length: workerCount }, () => convertNext()))

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`[gallery] Failed to convert ${failure.sourceName}: ${failure.error}`)
  }
  throw new Error(`${failures.length} gallery image(s) could not be converted`)
}

await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
console.log(`[gallery] Generated ${manifest.length} browser-safe WebP images`)
