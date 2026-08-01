import { readdir, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '..', 'src', 'data', 'COS102');

interface Question {
  id: string;
  correctAnswer?: number;
  correctOption?: string;
}

interface Totals {
  A: number;
  B: number;
  C: number;
  D: number;
}

const LETTERS = ['A', 'B', 'C', 'D'] as const;
const grand: Totals = { A: 0, B: 0, C: 0, D: 0 };
let grandTotal = 0;

const files = (await readdir(dataDir))
  .filter((f) => f.endsWith('.json'))
  .sort((a, b) => parseInt(a.match(/\d+/)![0], 10) - parseInt(b.match(/\d+/)![0], 10));

interface Row {
  week: string;
  counts: Totals;
  total: number;
}

const rows: Row[] = [];

for (const file of files) {
  const raw = await readFile(join(dataDir, file), 'utf-8');
  const questions = JSON.parse(raw) as Question[];
  const counts: Totals = { A: 0, B: 0, C: 0, D: 0 };
  let total = 0;

  for (const q of questions) {
    const idx = q.correctAnswer;
    const letter =
      typeof idx === 'number' && LETTERS[idx] ? LETTERS[idx] : (q.correctOption as keyof Totals) ?? null;
    if (letter) {
      counts[letter]++;
      grand[letter]++;
    }
    total++;
    grandTotal++;
  }

  rows.push({
    week: file.replace('.json', ''),
    counts: { ...counts },
    total,
  });
}

const pct = (n: number, total: number) => (total ? ((n / total) * 100).toFixed(1) + '%' : '-');

const pad = (s: string, w: number) => s.padEnd(w);

const hdr = ['Week', 'A', 'B', 'C', 'D', 'Total', 'A%', 'B%', 'C%', 'D%'].map((h) => pad(h, 8)).join('');
console.log(hdr);
console.log('-'.repeat(hdr.length));
for (const row of rows) {
  const c = row.counts;
  console.log(
    [
      row.week,
      c.A,
      c.B,
      c.C,
      c.D,
      row.total,
      pct(c.A, row.total),
      pct(c.B, row.total),
      pct(c.C, row.total),
      pct(c.D, row.total),
    ]
      .map((v) => pad(String(v), 8))
      .join(''),
  );
}
console.log('-'.repeat(hdr.length));
console.log(
  [
    'TOTAL',
    grand.A,
    grand.B,
    grand.C,
    grand.D,
    grandTotal,
    pct(grand.A, grandTotal),
    pct(grand.B, grandTotal),
    pct(grand.C, grandTotal),
    pct(grand.D, grandTotal),
  ]
    .map((v) => pad(String(v), 8))
    .join(''),
);

const max = (['A', 'B', 'C', 'D'] as const).reduce((a, b) => (grand[a] > grand[b] ? a : b));
console.log(`\nMost frequent correct letter overall: ${max} (${grand[max]}/${grandTotal} = ${pct(grand[max], grandTotal)})`);
