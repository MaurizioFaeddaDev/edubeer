import source from '../data/source.json';

export type MetricEvidence =
  | { status: 'declared' | 'estimated'; source: string; url: string; checkedAt: string; variant: string }
  | { status: 'unverified'; source: string; checkedAt: null; variant: null }
  | { status: 'missing'; source: null; checkedAt: null; variant: null };
export type BeerEvidence = Record<'abv' | 'ibu' | 'srm', MetricEvidence>;

// Maintained independently from generated BIRRAMON data. Only add a verified
// record with a precise source, product variant and actual review date.
export const BEER_EVIDENCE: Record<string, BeerEvidence> = {};
export const importedAt = source.at.slice(0, 10);
export function evidenceFor(id: string): BeerEvidence {
  const unverified: MetricEvidence = { status: 'unverified', source: 'Corpus editoriale BIRRAMON', checkedAt: null, variant: null };
  return BEER_EVIDENCE[id] ?? { abv: unverified, ibu: unverified, srm: unverified };
}
export const EVIDENCE_LABELS = { declared: 'Dichiarato dalla fonte', estimated: 'Stima documentata', unverified: 'Da verificare', missing: 'Non disponibile' };
