import items from './items';
import fs from 'fs';
import path from 'path';

const index = items.filter(i => !i.sold).map(i => ({
  id: i.id,
  title: i.title,
  category: i.category,
  tags: i.tags || [],
  description: i.description,
  price: i.price,
  currency: i.currency,
  image: i.image,
  location: i.location,
  condition: i.condition,
  reserved: i.reserved || false,
}));

const outPath = path.resolve(process.cwd(), 'public/search-index.json');
fs.writeFileSync(outPath, JSON.stringify(index, null, 2));
console.log('Search index written to', outPath);
