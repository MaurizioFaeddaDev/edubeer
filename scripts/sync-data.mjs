#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// Sincronizza il corpus delle birre dal repository di gioco (BIRRAMON) a
// BirraDex. La fonte di verità resta una sola: birramon/src/data/.
//
//   node scripts/sync-data.mjs [percorso-al-repo-di-gioco]
//
// I quattro file copiati sono autosufficienti (importano solo da ./types),
// quindi si possono travasare senza altre modifiche.
// ─────────────────────────────────────────────────────────────────────────────

import { copyFileSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const target = resolve(here, '../src/data');

const source = resolve(
  process.argv[2] ?? process.env.BIRRAMON_PATH ?? resolve(here, '../../birramon'),
  'src/data',
);

const FILES = ['types.ts', 'styles.ts', 'descriptors.ts', 'beers.ts'];

if (!existsSync(source)) {
  console.error(`✗ Sorgente non trovata: ${source}`);
  console.error('  Passa il percorso del repo di gioco:  node scripts/sync-data.mjs ~/Progetti/birramon');
  process.exit(1);
}

const BANNER = `// ⚠ FILE GENERATO — non modificare qui.\n`
  + `// Sincronizzato da birramon/src/data/ con: npm run sync-data\n\n`;

let copied = 0;
for (const f of FILES) {
  const from = resolve(source, f);
  if (!existsSync(from)) {
    console.error(`✗ Manca ${from}`);
    process.exit(1);
  }
  const body = readFileSync(from, 'utf8');
  writeFileSync(resolve(target, f), BANNER + body);
  copied++;
}

// Un piccolo manifesto per mostrare da dove vengono i dati.
writeFileSync(
  resolve(target, 'source.json'),
  JSON.stringify({ syncedFrom: source, at: new Date().toISOString(), files: FILES }, null, 2) + '\n',
);

console.log(`✓ ${copied} file sincronizzati da ${source}`);
