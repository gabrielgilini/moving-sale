import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

function coerceBool(val) {
  if (val === undefined) return undefined;
  if (val.toLowerCase() === 'true') return true;
  if (val.toLowerCase() === 'false') return false;
  return undefined;
}

function parseCSV() {
  const csvPath = path.resolve(process.cwd(), 'data/items.csv');
  if (!fs.existsSync(csvPath)) throw new Error('CSV file not found: ' + csvPath);
  const csv = fs.readFileSync(csvPath, 'utf8');
  const { data, errors } = Papa.parse(csv, { header: true, skipEmptyLines: true });
  if (errors.length) throw new Error('CSV parse error: ' + JSON.stringify(errors));
  return data.map((row, idx) => {
    if (!row.id || !row.title || !row.category || !row.condition || !row.description || !row.image || !row.currency) {
      throw new Error(`Missing required field in row ${idx + 2}`);
    }
    return {
      id: row.id,
      title: row.title,
      price: row.price ? Number(row.price) : undefined,
      currency: row.currency,
      category: row.category,
      condition: row.condition,
      description: row.description,
      image: row.image,
      images: row.images ? row.images.split(';').map(s => s.trim()).filter(Boolean) : undefined,
      location: row.location,
      reserved: coerceBool(row.reserved),
      sold: coerceBool(row.sold),
      featured: coerceBool(row.featured),
      updatedAt: row.updatedAt,
      tags: row.tags ? row.tags.split(';').map(s => s.trim()).filter(Boolean) : undefined,
    };
  });
}

const items = parseCSV();
export default items;
