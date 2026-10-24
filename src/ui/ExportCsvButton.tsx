// ─────────────────────────────────────────────────────────────────────────────
// Il solo punto in cui l'export tocca il browser: un bottone che scarica il
// testo costruito al click. Nessuna navigazione, nessuna history: l'hash con i
// filtri resta esattamente com'era.
// ─────────────────────────────────────────────────────────────────────────────

export function ExportCsvButton({ filename, build }: { filename: string; build: () => string }) {
  return (
    <button
      type="button"
      className="mini mini-tap"
      onClick={() => downloadCsv(filename, build())}
      title={`Scarica ${filename}`}
    >
      Esporta CSV
    </button>
  );
}

function downloadCsv(filename: string, text: string): void {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  // L'anchor deve stare nel documento perché Firefox avvii il download, e il
  // blob si revoca solo quando il browser ha finito di leggerlo: revocarlo
  // subito dopo `click()` fa fallire il salvataggio su motori più lenti.
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
