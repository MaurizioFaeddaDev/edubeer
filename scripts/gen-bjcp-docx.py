#!/usr/bin/env python3
"""Genera src/data/bjcp.ts e src/data/bjcp-beers.ts dal documento ufficiale
BJCP 2021 (2021_Guidelines_Beer_1.25.docx).

Perché il .docx e non un JSON di terze parti: il JSON usato in precedenza
(hopalyzer/bjcp-2021.json) è incompleto — non ha la categoria 27 (9 stili
storici) né la 33 (Wood Beer, 2 stili). Il documento ufficiale è la fonte di
verità: 116 stili (107 numerati + 9 storici) e i loro esempi commerciali.

Uso:
    python3 scripts/gen-bjcp-docx.py [percorso.docx]

I blurb italiani sono in scripts/bjcp-blurbs.py (scritti a mano).
I testi ufficiali (aroma, aspetto, sapore, ...) sono riportati verbatim.
"""
import sys, re, os, zipfile, unicodedata
from collections import OrderedDict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bjcp_blurbs import BLURBS  # noqa: E402

DOCX = sys.argv[1] if len(sys.argv) > 1 else '/home/mau/Downloads/2021_Guidelines_Beer_1.25.docx'
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'data')

# ── Estrazione dei paragrafi ────────────────────────────────────────────────

def paragraphs(path):
    xml = zipfile.ZipFile(path).read('word/document.xml').decode('utf-8', 'ignore')
    out = []
    for p in re.findall(r'<w:p[ >].*?</w:p>', xml, re.S):
        text = ''.join(re.findall(r'<w:t(?: [^>]*)?>(.*?)</w:t>', p, re.S))
        text = re.sub(r'\s+', ' ', text).strip()
        if text:
            out.append(text)
    return out

PARAS = paragraphs(DOCX)

LABELS = [
    'Overall Impression', 'Aroma', 'Appearance', 'Flavor', 'Mouthfeel',
    'Comments', 'History', 'Characteristic Ingredients', 'Style Comparison',
    'Entry Instructions', 'Commercial Examples', 'Tags',
]
FIELD_KEY = {
    'Overall Impression': 'overall', 'Aroma': 'aroma', 'Appearance': 'appearance',
    'Flavor': 'flavor', 'Mouthfeel': 'mouthfeel', 'Comments': 'comments',
    'History': 'history', 'Characteristic Ingredients': 'ingredients',
    'Style Comparison': 'comparison', 'Entry Instructions': 'entry',
    'Commercial Examples': 'examples', 'Tags': 'tags',
}

CAT_RE = re.compile(r'^(\d+)\.\s+([A-Z].{2,70})$')
STY_RE = re.compile(r'^(\d+[A-Z])\.\s+([A-Z].{2,80})$')
HIST_RE = re.compile(r'^Historical Beer:\s+(.+)$')


def is_label(p):
    return any(p.startswith(l + ':') for l in LABELS)


def category_at(i):
    """Riconosce un titolo di categoria SOLO se seguito dalla sua descrizione:
    così si scartano l'indice (seguito da altri titoli) e i rimandi."""
    m = CAT_RE.match(PARAS[i])
    if not m or i + 1 >= len(PARAS):
        return None
    nxt = PARAS[i + 1]
    if is_label(nxt) or CAT_RE.match(nxt) or STY_RE.match(nxt) or len(nxt) < 40:
        return None
    return m


def clean(text):
    if text is None:
        return None
    t = re.sub(r'\s+', ' ', text).strip()
    return t or None


def styles_and_beers():
    styles = []
    cur_cat = None
    i = 0
    while i < len(PARAS):
        p = PARAS[i]
        if styles and p.startswith('Appendix A'):
            break
        mc = category_at(i)
        if mc:
            cur_cat = (mc.group(1), mc.group(2))
        hist = HIST_RE.match(p)
        sty = STY_RE.match(p)
        if hist or sty:
            window = PARAS[i + 1:i + 14]
            if any(is_label(w) for w in window):
                if hist:
                    code, name = '27', hist.group(1).strip()
                else:
                    code, name = sty.group(1), sty.group(2).strip()
                fields = OrderedDict()
                vitals = []
                current = None
                j = i + 1
                while j < len(PARAS):
                    q = PARAS[j]
                    if q.startswith('Appendix A'):
                        break
                    if HIST_RE.match(q) or STY_RE.match(q):
                        break
                    if category_at(j):
                        break
                    if q.startswith('Vital Statistics'):
                        current = None
                        vitals.append(q)
                        j += 1
                        while j < len(PARAS) and not is_label(PARAS[j]) \
                                and not HIST_RE.match(PARAS[j]) and not STY_RE.match(PARAS[j]):
                            vitals.append(PARAS[j])
                            j += 1
                        continue
                    matched = None
                    for l in LABELS:
                        if q.startswith(l + ':'):
                            matched = l
                            break
                    if matched:
                        current = FIELD_KEY[matched]
                        fields[current] = q[len(matched) + 1:].strip()
                    elif current:
                        fields[current] = (fields.get(current, '') + ' ' + q).strip()
                    j += 1
                styles.append({
                    'code': code, 'name': name,
                    'cat_id': cur_cat[0] if cur_cat else '?',
                    'cat': cur_cat[1] if cur_cat else 'Senza categoria',
                    'fields': fields, 'vitals': ' '.join(vitals),
                })
                i = j
                continue
        i += 1
    return styles


# ── Numeri ──────────────────────────────────────────────────────────────────

def rng(text, key):
    m = re.search(rf'{key}:\s*([\d.]+)\s*[–\-]\s*([\d.]+)', text or '')
    if not m:
        return None
    return (float(m.group(1)), float(m.group(2)))


def srm_mid(color):
    return round((color[0] + color[1]) / 2, 1) if color else None


# ── Famiglia, ricavata dai tag (con override per gli storici) ───────────────

FAMILY_OVERRIDE = {
    '27': {
        'Kellerbier': 'Lager', 'Pre-Prohibition Lager': 'Lager',
        'Kentucky Common': 'Ale', 'Lichtenhainer': 'Ale', 'London Brown Ale': 'Ale',
        'Piwo Grodziskie': 'Ale', 'Pre-Prohibition Porter': 'Ale',
        'Roggenbier': 'Ale', 'Sahti': 'Ale',
    },
    '33A': 'Speciale', '33B': 'Speciale',
}


def family_for(code, name, tags):
    if code == '27' and name in FAMILY_OVERRIDE['27']:
        return FAMILY_OVERRIDE['27'][name]
    if code in FAMILY_OVERRIDE:
        return FAMILY_OVERRIDE[code]
    t = tags or ''
    if 'bottom-fermented' in t:
        return 'Lager'
    if 'top-fermented' in t:
        return 'Ale'
    if 'wild-ferment' in t:
        return 'Fermentazione spontanea'
    if 'monastic' in t:
        return 'Trappista'
    return 'Speciale'


# ── Esempi commerciali → birre ──────────────────────────────────────────────

PROSE = re.compile(
    r'\b(many|some|various|typically|often|available|commercial|cafés|cafes|breweries|'
    r'base for|example of|style is|styles are|versions? of|brewed by|produced by|'
    r'in the brussels|any beer|other specialty|specialty-type|none)\b', re.I)
PREFIX = re.compile(
    r'^(dark|pale|english|scottish|american|other|strong|versions?|examples?|'
    r'dunkel|dunkles|hell|helles|märzen|marzen|rauch|weizen|bock|schwarz|doppel|leicht|pils|pilsner|'
    r'pale versions?|dark versions?)\s*(versions?)?\s*[–—\-:]\s*', re.I)


def slug(text):
    t = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode()
    t = re.sub(r'[^a-zA-Z0-9]+', '-', t).strip('-').lower()
    return t or 'birra'


def ts(s):
    return '"' + s.replace('\\', '\\\\').replace('"', '\\"') + '"'


def ts_or_null(s):
    s = clean(s)
    return ts(s) if s else 'null'


# ── Costruzione ─────────────────────────────────────────────────────────────

raw = styles_and_beers()
print(f'stili estratti dal docx: {len(raw)}')

seen_ids = {}
styles = []
for st in raw:
    code, name = st['code'], st['name']
    historical = code == '27'
    sid = code if not historical else f'27-{slug(name)}'
    n = seen_ids.get(sid, 0)
    seen_ids[sid] = n + 1
    if n:
        sid = f'{sid}-{n + 1}'
    color = rng(st['vitals'], 'SRM')
    abv = rng(st['vitals'], 'ABV')
    ibu = rng(st['vitals'], 'IBUs') or rng(st['vitals'], 'IBU')
    og = rng(st['vitals'], 'OG')
    fg = rng(st['vitals'], 'FG')
    blurb_key = f'Historical Beer: {name}' if historical else code
    blurb = BLURBS.get(blurb_key) or BLURBS.get(name) or BLURBS.get(code)
    if not blurb:
        raise SystemExit(f'blurb mancante per {code} {name}')
    styles.append({
        'id': sid, 'code': code, 'name': name,
        'cat_id': st['cat_id'], 'cat': st['cat'],
        'family': family_for(code, name, st['fields'].get('tags')),
        'srm': srm_mid(color), 'color': color, 'abv': abv, 'ibu': ibu, 'og': og, 'fg': fg,
        'blurb': blurb,
        'aroma': st['fields'].get('aroma'),
        'appearance': st['fields'].get('appearance'),
        'flavor': st['fields'].get('flavor'),
        'mouthfeel': st['fields'].get('mouthfeel'),
        'comments': st['fields'].get('comments'),
        'history': st['fields'].get('history'),
        'comparison': st['fields'].get('styleComparison') or st['fields'].get('comparison'),
        'ingredients': st['fields'].get('ingredients'),
        'examples': st['fields'].get('examples'),
    })

# birre
beers = []
seen_beers = set()
used_ids = {}
for st in styles:
    raw_ex = st.pop('examples') or ''
    for chunk in re.split(r'[;,]', raw_ex):
        nm = chunk.strip().strip('.').replace('’', "'")
        nm = PREFIX.sub('', nm).strip()
        if not nm or PROSE.search(nm) or len(nm) > 58 or len(nm) < 2 or not nm[0].isupper():
            continue
        key = slug(nm)
        if key in seen_beers:
            continue
        seen_beers.add(key)
        bid = key
        k = used_ids.get(bid, 0)
        used_ids[bid] = k + 1
        if k:
            bid = f'{bid}-{k + 1}'
        beers.append({'id': bid, 'name': nm, 'styleId': st['id']})

# ── Scrittura bjcp.ts ───────────────────────────────────────────────────────

L = []
L.append('// ⚠ FILE GENERATO da scripts/gen-bjcp-docx.py — non modificare a mano.')
L.append('// Fonte: 2021_Guidelines_Beer_1.25.docx (documento ufficiale BJCP).')
L.append('// 116 stili: tutti i numerati (1A–34C) e i 9 storici della categoria 27.')
L.append('// I blurb italiani sono in scripts/bjcp-blurbs.py; i testi ufficiali sono')
L.append('// riportati verbatim in inglese.')
L.append('')
L.append('import type { BeerStyleId } from \'./types\';')
L.append('')
L.append('/** Uno stile BJCP 2021, con i dati vitali ufficiali. */')
L.append('export interface BjcpStyle {')
L.append('  /** Chiave unica e slug nell\'URL, es. "3B" oppure "27-kellerbier". */')
L.append('  id: string;')
L.append('  /** Etichetta ufficiale: "3B", "27" per gli stili storici. */')
L.append('  code: string;')
L.append('  name: string;')
L.append('  categoryId: string;')
L.append('  category: string;')
L.append('  /** Famiglia larga, allineata a quelle dell\'archivio. */')
L.append('  family: string;')
L.append('  /** Colore SRM al centro dell\'intervallo ufficiale. */')
L.append('  srm: number | null;')
L.append('  /** Intervallo SRM ufficiale [min, max]. */')
L.append('  color: [number, number] | null;')
L.append('  /** [min, max] in % vol, o null quando lo stile non lo dichiara. */')
L.append('  abv: [number, number] | null;')
L.append('  /** [min, max] IBU, o null quando lo stile non lo dichiara. */')
L.append('  ibu: [number, number] | null;')
L.append('  og: [number, number] | null;')
L.append('  fg: [number, number] | null;')
L.append('  /** Rilettura italiana: cosa definisce lo stile e cosa lo distingue. */')
L.append('  blurb: string;')
L.append('  /** Testo ufficiale BJCP 2021 (inglese), sezione per sezione. */')
L.append('  aroma: string | null;')
L.append('  appearance: string | null;')
L.append('  flavor: string | null;')
L.append('  mouthfeel: string | null;')
L.append('  comments: string | null;')
L.append('  history: string | null;')
L.append('  comparison: string | null;')
L.append('  ingredients: string | null;')
L.append('}')
L.append('')
L.append('export const BJCP_STYLES: BjcpStyle[] = [')


def num(v):
    if v is None:
        return 'null'
    n = float(v)
    return str(int(n)) if n == int(n) else str(n)


def pair(p):
    return 'null' if p is None else f'[{num(p[0])}, {num(p[1])}]'


for st in styles:
    L.append('  {')
    L.append(f"    id: {ts(st['id'])}, code: {ts(st['code'])}, name: {ts(st['name'])},")
    L.append(f"    categoryId: {ts(st['cat_id'])}, category: {ts(st['cat'])}, family: {ts(st['family'])},")
    L.append(f"    srm: {num(st['srm'])}, color: {pair(st['color'])},")
    L.append(f"    abv: {pair(st['abv'])}, ibu: {pair(st['ibu'])}, og: {pair(st['og'])}, fg: {pair(st['fg'])},")
    L.append(f"    blurb: {ts(st['blurb'])},")
    L.append(f"    aroma: {ts_or_null(st['aroma'])}, appearance: {ts_or_null(st['appearance'])},")
    L.append(f"    flavor: {ts_or_null(st['flavor'])}, mouthfeel: {ts_or_null(st['mouthfeel'])},")
    L.append(f"    comments: {ts_or_null(st['comments'])}, history: {ts_or_null(st['history'])},")
    L.append(f"    comparison: {ts_or_null(st['comparison'])}, ingredients: {ts_or_null(st['ingredients'])},")
    L.append('  },')
L.append('];')
L.append('')
L.append('export const BJCP_BY_ID: Map<string, BjcpStyle> = new Map(BJCP_STYLES.map((s) => [s.id, s]));')
L.append('')
L.append('/** Le categorie BJCP in ordine ufficiale, con i loro stili. */')
L.append('export const BJCP_CATEGORIES: { id: string; name: string; styles: BjcpStyle[] }[] = (() => {')
L.append('  const out: { id: string; name: string; styles: BjcpStyle[] }[] = [];')
L.append('  for (const s of BJCP_STYLES) {')
L.append('    let c = out.find((x) => x.id === s.categoryId && x.name === s.category);')
L.append('    if (!c) { c = { id: s.categoryId, name: s.category, styles: [] }; out.push(c); }')
L.append('    c.styles.push(s);')
L.append('  }')
L.append('  return out;')
L.append('})();')
L.append('')
L.append('/** Ponte fra gli stili dell\'archivio (approfondimenti) e il catalogo BJCP. */')
L.append('export const APP_TO_BJCP: Partial<Record<BeerStyleId, string[]>> = {')
MAPPING = [
    ('pilsner', ['3B']), ('helles', ['4A']), ('marzen', ['6A']), ('bock', ['6C']),
    ('doppelbock', ['9A']), ('weizenbock', ['10C']), ('hefeweizen', ['10A']),
    ('witbier', ['24A']), ('saison', ['25B']), ('berliner', ['23A']), ('lambic', ['23D']),
    ('gueuze', ['23E']), ('pale-ale', ['18B', '12A']), ('bitter', ['11A', '11B', '11C']),
    ('amber', ['19A']), ('ipa', ['21A', '12C']), ('neipa', ['21C']), ('dipa', ['22A']),
    ('porter', ['13C', '20A']), ('stout', ['15B']), ('imperial-stout', ['20C']),
    ('strong-golden', ['25C']), ('dubbel', ['26B']), ('tripel', ['26C']),
    ('quadrupel', ['26D']), ('rauchbier', ['6B']), ('barleywine', ['17D', '22C']),
]
for k, v in MAPPING:
    L.append(f"  '{k}': [{', '.join(ts(c) for c in v)}],")
L.append('};')
L.append('')
L.append('/** Inverso: da codice BJCP agli stili dell\'archivio che lo incarnano. */')
L.append('export const BJCP_TO_APP: Map<string, BeerStyleId[]> = (() => {')
L.append('  const out = new Map<string, BeerStyleId[]>();')
L.append('  for (const [app, codes] of Object.entries(APP_TO_BJCP) as [BeerStyleId, string[]][]) {')
L.append('    for (const c of codes) {')
L.append('      const arr = out.get(c);')
L.append('      if (arr) arr.push(app);')
L.append('      else out.set(c, [app]);')
L.append('    }')
L.append('  }')
L.append('  return out;')
L.append('})();')
L.append('')

open(os.path.join(OUT_DIR, 'bjcp.ts'), 'w').write('\n'.join(L))

# ── Scrittura bjcp-beers.ts ─────────────────────────────────────────────────

B = []
B.append('// ⚠ FILE GENERATO da scripts/gen-bjcp-docx.py — non modificare a mano.')
B.append('// Fonte: gli esempi commerciali del documento ufficiale BJCP 2021.')
B.append('// Ogni voce è solo un nome + l\'id dello stile a cui il BJCP la ascrive.')
B.append('// Nessun dato per-birra: ABV/IBU/SRM e testi vengono dallo stile.')
B.append('')
B.append('/** Una birra citata dal BJCP come esempio di uno stile. */')
B.append('export interface BjcpBeer {')
B.append('  /** Slug stabile, usato nell\'URL. */')
B.append('  id: string;')
B.append('  /** Nome commerciale come citato dalle linee guida. */')
B.append('  name: string;')
B.append('  /** id dello stile BJCP, es. "3B" oppure "27-kellerbier". */')
B.append('  styleId: string;')
B.append('}')
B.append('')
B.append('export const BJCP_BEERS: BjcpBeer[] = [')
for b in beers:
    B.append(f"  {{ id: {ts(b['id'])}, name: {ts(b['name'])}, styleId: {ts(b['styleId'])} }},")
B.append('];')
B.append('')
open(os.path.join(OUT_DIR, 'bjcp-beers.ts'), 'w').write('\n'.join(B))

print(f'scritti {len(styles)} stili e {len(beers)} birre')
cats = OrderedDict()
for s in styles:
    cats.setdefault((s['cat_id'], s['cat']), 0)
    cats[(s['cat_id'], s['cat'])] += 1
print('categorie:', len(cats))
print('categoria 27:', cats.get(('27', 'Historical Beer')))
