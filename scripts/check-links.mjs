import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
// NOTE: when migrating to Vercel (no base path), change BASE to ''.
const BASE = '/personal-website';

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return htmlFiles(p);
    return p.endsWith('.html') ? [p] : [];
  });
}

let failures = 0;
for (const file of htmlFiles(DIST)) {
  const html = readFileSync(file, 'utf8');
  const links = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  for (const link of links) {
    if (!link.startsWith(BASE + '/') && link !== BASE) continue;
    const clean = link.slice(BASE.length).split(/[?#]/)[0];
    let target = join(DIST, clean);
    if (clean === '' || clean.endsWith('/')) target = join(target, 'index.html');
    if (!existsSync(target)) {
      console.error(`BROKEN: ${link} (in ${file})`);
      failures++;
    }
  }
}
if (failures > 0) {
  console.error(`${failures} broken internal link(s).`);
  process.exit(1);
}
console.log('All internal links resolve.');
