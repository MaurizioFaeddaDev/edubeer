import { EVIDENCE_LABELS, evidenceFor, importedAt } from '../lib/provenance';

export function BeerSources({ id }: { id: string }) {
  const evidence = evidenceFor(id);
  return <section className="beer-sources"><h2>Fonti dei valori</h2>
    <p className="caption">Importazione del corpus: {importedAt}. Questa data non è una verifica delle informazioni del produttore. I valori da verificare sono riferimenti editoriali, non misure certificate della bottiglia.</p>
    <dl>{(['abv', 'ibu', 'srm'] as const).map(key => {
      const item = evidence[key];
      return <div key={key}><dt>{key.toUpperCase()} · {EVIDENCE_LABELS[item.status]}</dt><dd>
        {'url' in item ? <a href={item.url} target="_blank" rel="noreferrer">{item.source}</a> : item.source ?? 'Fonte assente'}
        {item.checkedAt ? ` · Verifica: ${item.checkedAt} · Variante: ${item.variant}` : ' · Data di verifica e variante non documentate'}
      </dd></div>;
    })}</dl>
  </section>;
}
