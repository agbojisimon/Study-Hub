import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const sourcePath = 'C:/Users/OYALE/Desktop/gst122.json';
const targetDir = 'C:/Users/OYALE/Desktop/studyHub/project/src/data/GST122';

const raw = readFileSync(sourcePath, 'utf8');

function splitTopLevelArrays(text) {
  const sections = [];
  let current = '';
  let depth = 0;
  let inString = false;
  let escape = false;

  for (const char of text) {
    if (current === '' && /\s/.test(char)) {
      continue;
    }

    current += char;

    if (inString) {
      if (escape) {
        escape = false;
      } else if (char === '\\') {
        escape = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === '[') {
      depth++;
    } else if (char === ']') {
      depth--;
      if (depth === 0) {
        sections.push(current.trim());
        current = '';
      }
    }
  }

  return sections.filter(Boolean);
}

const sections = splitTopLevelArrays(raw);

if (sections.length !== 10) {
  throw new Error(`Expected 10 week sections, found ${sections.length}`);
}

mkdirSync(targetDir, { recursive: true });

sections.forEach((section, index) => {
  const data = JSON.parse(section);
  const outputPath = join(targetDir, `week${index + 1}.json`);
  writeFileSync(outputPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${outputPath} (${data.length} questions)`);
});
