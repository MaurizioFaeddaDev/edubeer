const TERMS = [
  ['ABV', 'Gradazione alcolica: percentuale di alcol sul volume della bevanda.'],
  ['IBU', 'Scala dell’amarezza analitica. La sensazione di amaro dipende anche da dolcezza, corpo e altri ingredienti.'],
  ['SRM', 'Scala del colore: valori bassi indicano birre chiare, valori alti birre scure. Il colore sullo schermo è illustrativo.'],
  ['OG', 'Densità iniziale del mosto, prima della fermentazione, rispetto all’acqua.'],
  ['FG', 'Densità finale, dopo la fermentazione, rispetto all’acqua.'],
];

export function MetricGlossary() {
  return <details className="metric-glossary"><summary>Come leggere ABV, IBU, SRM, OG e FG</summary>
    <dl>{TERMS.map(([term, description]) => <div key={term}><dt>{term}</dt><dd>{description}</dd></div>)}</dl>
    <p className="caption">Negli stili e nel catalogo BJCP i numeri sono intervalli di stile. Il punto medio non è una misura della singola birra.</p>
  </details>;
}
