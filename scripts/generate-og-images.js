const { createCanvas } = require('canvas');
const fs = require('fs');
const matter = require('gray-matter');
const path = require('path');
const sharp = require('sharp');

// OG image dimensions
const WIDTH = 1200;
const HEIGHT = 630;

// Theme colors
const BG_GRADIENT_START = '#1a1a2e';
const BG_GRADIENT_END = '#16213e';
const ACCENT_COLOR = '#6C63FF';
const TEXT_COLOR = '#ffffff';
const SUBTEXT_COLOR = '#a0a0b0';

function wrapText(ctx, text, maxWidth) {
  const words = text.split('');
  const lines = [];
  let currentLine = '';

  for (const char of words) {
    const testLine = currentLine + char;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = char;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

function generateOgImage(title, date, section, outputPath) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  gradient.addColorStop(0, BG_GRADIENT_START);
  gradient.addColorStop(1, BG_GRADIENT_END);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Decorative accent bar on left
  ctx.fillStyle = ACCENT_COLOR;
  ctx.fillRect(0, 0, 8, HEIGHT);

  // Decorative circles (top-right)
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = ACCENT_COLOR;
  ctx.beginPath();
  ctx.arc(WIDTH - 80, 80, 200, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(WIDTH - 200, 500, 120, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Section tag (top-left)
  if (section) {
    const tagText = section.toUpperCase();
    ctx.font = 'bold 18px "Helvetica Neue", Arial, sans-serif';
    const tagWidth = ctx.measureText(tagText).width + 24;
    const tagX = 60;
    const tagY = 60;

    // Tag background
    ctx.fillStyle = ACCENT_COLOR;
    roundRect(ctx, tagX, tagY, tagWidth, 34, 6);
    ctx.fill();

    // Tag text
    ctx.fillStyle = TEXT_COLOR;
    ctx.textBaseline = 'middle';
    ctx.fillText(tagText, tagX + 12, tagY + 17);
  }

  // Title
  ctx.fillStyle = TEXT_COLOR;
  ctx.textBaseline = 'top';

  // Try to fit title - start with large font and reduce if needed
  let fontSize = 52;
  let lines;
  const maxWidth = WIDTH - 160;
  const maxLines = 3;

  do {
    ctx.font = `bold ${fontSize}px "Helvetica Neue", Arial, sans-serif`;
    lines = wrapText(ctx, title, maxWidth);
    if (lines.length <= maxLines) break;
    fontSize -= 4;
  } while (fontSize > 28);

  // Only show up to maxLines
  lines = lines.slice(0, maxLines);
  if (lines.length === maxLines) {
    const lastLine = lines[maxLines - 1];
    if (wrapText(ctx, title, maxWidth).length > maxLines) {
      lines[maxLines - 1] = lastLine.slice(0, -1) + '...';
    }
  }

  const lineHeight = fontSize * 1.3;
  const titleStartY = section ? 120 : 80;
  lines.forEach((line, i) => {
    ctx.fillText(line, 60, titleStartY + i * lineHeight);
  });

  // Horizontal divider
  const dividerY = HEIGHT - 140;
  ctx.strokeStyle = ACCENT_COLOR;
  ctx.globalAlpha = 0.4;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, dividerY);
  ctx.lineTo(WIDTH - 60, dividerY);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Date (bottom-left)
  if (date) {
    ctx.font = '22px "Helvetica Neue", Arial, sans-serif';
    ctx.fillStyle = SUBTEXT_COLOR;
    ctx.textBaseline = 'top';
    ctx.fillText(date, 60, dividerY + 20);
  }

  // Site name (bottom-right)
  ctx.font = 'bold 24px "Helvetica Neue", Arial, sans-serif';
  ctx.fillStyle = ACCENT_COLOR;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillText('maoxunxing.com', WIDTH - 60, dividerY + 18);
  ctx.textAlign = 'left'; // reset

  // Convert to PNG buffer
  return canvas.toBuffer('image/png');
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function hasExistingImage(dir) {
  const imagePatterns = ['cover.png', 'cover.jpg', 'cover.jpeg', 'cover.webp', 'cover.avif',
                         'feature.png', 'feature.jpg', 'thumbnail.png', 'thumbnail.jpg'];
  for (const pattern of imagePatterns) {
    if (fs.existsSync(path.join(dir, pattern))) {
      return true;
    }
  }
  return false;
}

function processContentDir(contentDir) {
  let generated = 0;
  let skipped = 0;

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }

      // Only process markdown files
      if (!entry.name.endsWith('.md')) continue;

      // Skip _index files for sections (they're list pages)
      // But process index.en.md, index.zh-cn.md (leaf bundles)
      if (entry.name === '_index.md' || entry.name === '_index.zh-cn.md') continue;

      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const { data: frontmatter } = matter(content);

        // Skip if already has hero_image or images defined
        if (frontmatter.hero_image || (frontmatter.images && frontmatter.images.length > 0)) {
          skipped++;
          continue;
        }

        // For page bundles (index.md in a directory), check for existing cover images
        const parentDir = path.dirname(fullPath);
        if (entry.name.startsWith('index') && hasExistingImage(parentDir)) {
          skipped++;
          continue;
        }

        // Skip non-page-bundle posts (standalone .md files outside directories)
        if (!entry.name.startsWith('index')) {
          skipped++;
          continue;
        }

        const ogPath = path.join(parentDir, 'og-image.png');

        // Skip if og-image already exists
        if (fs.existsSync(ogPath)) {
          skipped++;
          continue;
        }

        const title = frontmatter.title || 'Untitled';
        const date = frontmatter.date
          ? new Date(frontmatter.date).toISOString().split('T')[0]
          : '';

        // Determine section from path
        const relPath = path.relative(contentDir, fullPath);
        const section = relPath.split(path.sep)[0] || '';

        console.log(`Generating OG image: ${relPath}`);
        const buffer = generateOgImage(title, date, section, ogPath);

        // Optimize with sharp
        sharp(buffer)
          .png({ quality: 85, compressionLevel: 9 })
          .toFile(ogPath)
          .then(() => {
            console.log(`  -> ${ogPath}`);
          })
          .catch(err => {
            // Fallback: write raw canvas output
            fs.writeFileSync(ogPath, buffer);
            console.log(`  -> ${ogPath} (unoptimized)`);
          });

        generated++;
      } catch (err) {
        console.error(`Error processing ${fullPath}:`, err.message);
      }
    }
  }

  walk(contentDir);
  return { generated, skipped };
}

// Main
const contentDir = path.join(__dirname, '..', 'content');
console.log('Scanning content directory for posts without OG images...\n');

const { generated, skipped } = processContentDir(contentDir);

console.log(`\nDone! Generated: ${generated}, Skipped: ${skipped}`);
