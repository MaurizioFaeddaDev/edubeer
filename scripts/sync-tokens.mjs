#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// Sincronizza i design token dall'azienda (maistru-craft) a EduBeer.
// La fonte di verità resta una sola: maistru-craft/design-system/tokens.css.
// Il build su Vercel vede solo questo repo, quindi la copia è versionata.
//
//   node scripts/sync-tokens.mjs [percorso-tokens.css]
//   npm run sync-tokens
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const source = resolve(
  process.argv[2] ?? process.env.MAISTRU_TOKENS ?? resolve(here, '../../maistru-craft/design-system/tokens.css'),
);
const target = resolve(here, '../src/tokens.css');

if (!existsSync(source)) {
  console.error(`✗ Sorgente non trovata: ${source}`);
  console.error('  Passa il percorso:  node scripts/sync-tokens.mjs ~/Progetti/maistru-craft/design-system/tokens.css');
  process.exit(1);
}

const BANNER = `/* ⚠ FILE GENERATO — non modificare qui.\n`
  + `   Sincronizzato da maistru-craft/design-system/tokens.css con: npm run sync-tokens */\n\n`;

writeFileSync(target, BANNER + readFileSync(source, 'utf8'));
console.log(`✓ token sincronizzati da ${source}`);
