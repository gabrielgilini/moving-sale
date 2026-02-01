import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const IMAGES_DIR = path.resolve(process.cwd(), 'public/images');
const THUMB_WIDTH = 600;
const THUMB_HEIGHT = 450;
const THUMB_QUALITY = 80;

async function generateThumbnails() {
  const items = fs.readdirSync(IMAGES_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  let totalProcessed = 0;
  let totalSkipped = 0;

  for (const itemId of items) {
    const itemDir = path.join(IMAGES_DIR, itemId);
    const thumbsDir = path.join(itemDir, 'thumbs');
    
    // Create thumbs directory if it doesn't exist
    if (!fs.existsSync(thumbsDir)) {
      fs.mkdirSync(thumbsDir, { recursive: true });
    }

    const images = fs.readdirSync(itemDir)
      .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f) && !f.startsWith('.'));

    for (const img of images) {
      const srcPath = path.join(itemDir, img);
      const thumbName = img.replace(/\.(jpg|jpeg|png|webp)$/i, '.webp');
      const thumbPath = path.join(thumbsDir, thumbName);

      // Skip if thumbnail already exists and is newer than source
      if (fs.existsSync(thumbPath)) {
        const srcStat = fs.statSync(srcPath);
        const thumbStat = fs.statSync(thumbPath);
        if (thumbStat.mtime >= srcStat.mtime) {
          totalSkipped++;
          continue;
        }
      }

      try {
        await sharp(srcPath)
          .resize(THUMB_WIDTH, THUMB_HEIGHT, {
            fit: 'cover',
            position: 'center'
          })
          .webp({ quality: THUMB_QUALITY })
          .toFile(thumbPath);
        
        totalProcessed++;
        console.log(`✓ ${itemId}/${img} → thumbs/${thumbName}`);
      } catch (err) {
        console.error(`✗ Failed to process ${itemId}/${img}:`, err.message);
      }
    }
  }

  console.log(`\nDone! Processed: ${totalProcessed}, Skipped: ${totalSkipped}`);
}

generateThumbnails().catch(console.error);
