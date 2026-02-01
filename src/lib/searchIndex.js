import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

// Parse CSV directly (duplicated from items.ts for Node.js compatibility)
function parseCSV() {
  const csvPath = path.resolve(process.cwd(), 'data/items.csv');
  if (!fs.existsSync(csvPath)) throw new Error('CSV file not found: ' + csvPath);
  const csv = fs.readFileSync(csvPath, 'utf8');
  const { data, errors } = Papa.parse(csv, { header: true, skipEmptyLines: true });
  if (errors.length) throw new Error('CSV parse error: ' + JSON.stringify(errors));
  
  return data.map((row, idx) => {
    const id = row['ID'];
    const name = row['Name'];
    const originalPrice = row['Original price'];
    const salePrice = row['Sale price'];
    
    if (!id || !name) {
      throw new Error(`Missing required field (ID or Name) in row ${idx + 2}`);
    }
    
    // Discover images from public/images/${id}/
    const imagesDir = path.resolve(process.cwd(), 'public/images', id);
    let images = [];
    if (fs.existsSync(imagesDir)) {
      images = fs.readdirSync(imagesDir)
        .filter(f => /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(f))
        .sort()
        .map(f => `/images/${id}/${f}`);
    }
    
    return {
      id,
      name,
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      salePrice: salePrice ? Number(salePrice) : undefined,
      images,
    };
  });
}

const items = parseCSV();

const index = items.map(i => ({
  id: i.id,
  name: i.name,
  originalPrice: i.originalPrice,
  salePrice: i.salePrice,
  images: i.images,
}));

const outPath = path.resolve(process.cwd(), 'public/search-index.json');
fs.writeFileSync(outPath, JSON.stringify(index, null, 2));
console.log('Search index written to', outPath);
