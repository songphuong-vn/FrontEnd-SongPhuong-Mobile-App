/*
  Build details chunks from CSV to JS files consumable on file://
  - Input: database-product/product-datat.csv
  - Output: js/product-details/details-<prefix>.js where prefix = first 3 chars of SKU (zero-padded to 6)
  - Each output assigns to window.PRODUCT_DETAILS_CHUNKS[prefix]
*/

const fs = require('fs');
const path = require('path');
let Papa;

async function ensurePapa() {
  try {
    Papa = require('papaparse');
  } catch (e) {
    console.error('\nMissing dependency papaparse. Install with:');
    console.error('  npm i -D papaparse');
    process.exit(1);
  }
}

function rmDiacritics(str) {
  return (str || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

function detectKeys(fields) {
  const norm = fields.map(f => ({ raw: f, n: rmDiacritics(f) }));
  const get = (...cands) => {
    for (const cand of cands) {
      const c = rmDiacritics(cand);
      // Exact match first
      const exactHit = norm.find(x => x.n === c);
      if (exactHit) return exactHit.raw;
      // Then includes
      const hit = norm.find(x => x.n.includes(c));
      if (hit) return hit.raw;
    }
    return null;
  };
  const skuKey = get('sku', 'ma san pham');
  // Mô tả ngắn - tìm chính xác trước
  const shortKey = get('mo ta ngan', 'mo ta rut gon', 'tom tat');
  // Mô tả (full) - phải là cột "Mô tả" không có chữ "ngắn"
  // Tìm cột có tên chính xác là "mo ta" (không có "ngan")
  const fullKeyExact = norm.find(x => x.n === 'mo ta');
  const fullKey = fullKeyExact ? fullKeyExact.raw : null;
  
  const saleKey = get('gia khuyen mai', 'gia sale', 'gia ban');
  const regularKey = get('gia thong thuong', 'gia goc', 'gia niem yet');
  return { skuKey, shortKey, fullKey, saleKey, regularKey };
}

function padPrefix(sku) {
  const s = String(sku || '').trim();
  return s.padStart(6, '0').substring(0, 3);
}

async function main() {
  await ensurePapa();
  const root = process.cwd();
  const csvPath = path.join(root, 'database-product', 'product-datat.csv');
  const outDir = path.join(root, 'js', 'product-details');

  if (!fs.existsSync(csvPath)) {
    console.error('CSV not found:', csvPath);
    process.exit(1);
  }
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Đọc file với UTF-8 và xử lý BOM
  let csv = fs.readFileSync(csvPath, 'utf8');
  // Loại bỏ BOM nếu có
  if (csv.charCodeAt(0) === 0xFEFF) {
    csv = csv.slice(1);
  }
  
  const parsed = Papa.parse(csv, { 
    header: true, 
    skipEmptyLines: 'greedy',
    // Quan trọng: không transform để giữ nguyên dữ liệu
    transformHeader: (h) => h.trim()
  });
  const { data, meta } = parsed;
  const { skuKey, shortKey, fullKey, saleKey, regularKey } = detectKeys(meta.fields || []);

  console.log('Detected columns:', { skuKey, shortKey, fullKey });
  console.log('Total rows:', data.length);

  if (!skuKey || !fullKey) {
    console.error('Could not detect required columns. Found fields:', meta.fields);
    console.error('Need at least SKU and Mô tả (full).');
    process.exit(1);
  }

  const chunks = new Map(); // prefix => { sku: {sd, fd} }
  let total = 0;

  for (const row of data) {
    const sku = String(row[skuKey] || '').trim();
    if (!sku) continue;

    const fdRaw = (row[fullKey] ?? '').toString();
    const sdRaw = (shortKey ? (row[shortKey] ?? '') : '').toString();

    if (!fdRaw && !sdRaw) continue;

    const prefix = padPrefix(sku);
    if (!chunks.has(prefix)) chunks.set(prefix, {});

    // Keep raw strings; renderer will sanitize (""->", remove \n literals)
    chunks.get(prefix)[sku] = { sd: sdRaw, fd: fdRaw };
    total++;
  }

  // Write chunks
  for (const [prefix, map] of chunks) {
    const outPath = path.join(outDir, `details-${prefix}.js`);
    const json = JSON.stringify(map);
    const js = `// Auto-generated details chunk for prefix '${prefix}'\n` +
      '(function(){\n' +
      '  window.PRODUCT_DETAILS_CHUNKS = window.PRODUCT_DETAILS_CHUNKS || {};\n' +
      `  var k = '${prefix}';\n` +
      `  var data = ${json};\n` +
      '  window.PRODUCT_DETAILS_CHUNKS[k] = Object.assign(window.PRODUCT_DETAILS_CHUNKS[k] || {}, data);\n' +
      '})();\n';
    fs.writeFileSync(outPath, js, 'utf8');
  }

  console.log(`Generated ${chunks.size} chunk file(s) with ${total} product descriptions.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
