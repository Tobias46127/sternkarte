const fs = require('fs');

const src = 'assets/stars/hygdata_v3.csv';
const out = 'assets/stars/hyg_mag6.json';

// Wir lesen: hip (optional), ra (Stunden), dec (Grad), mag
const text = fs.readFileSync(src, 'utf8').replace(/\r/g,'').trim();
const [headerLine, ...lines] = text.split('\n');
const headers = headerLine.split(',');

// Felder finden
const idx = {
  hip: headers.indexOf('hip'),
  ra:  headers.indexOf('ra'),
  dec: headers.indexOf('dec'),
  mag: headers.indexOf('mag'),
};

if (idx.ra < 0 || idx.dec < 0 || idx.mag < 0) {
  throw new Error('CSV-Header nicht gefunden (ra/dec/mag). Prüfe hygdata_v3.csv');
}

const rows = [];
for (const line of lines) {
  if (!line) continue;
  const parts = line.split(',');
  const ra  = +parts[idx.ra];     // Stunden
  const dec = +parts[idx.dec];    // Grad
  const mag = +parts[idx.mag];
  const hip = idx.hip >= 0 ? (+parts[idx.hip] || null) : null;

  if (!isFinite(ra) || !isFinite(dec) || !isFinite(mag)) continue;
  if (mag <= 6.0) rows.push({ hip, ra, dec, mag });
}

fs.writeFileSync(out, JSON.stringify(rows), 'utf8');
console.log(`OK: ${rows.length} Sterne → ${out}`);
