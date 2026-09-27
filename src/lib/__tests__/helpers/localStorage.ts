// T-003 — doppio in memoria di `localStorage` per i test della logica pura.
// Vitest gira in ambiente `node` (nessun DOM): i moduli che persistono su
// `localStorage` (es. `lib/compare.ts`) lo trovano via `vi.stubGlobal`.

/** Implementazione minima e tipizzata di `Storage`, senza browser. */
export class MemoryStorage implements Storage {
  private data = new Map<string, string>();

  get length(): number {
    return this.data.size;
  }

  clear(): void {
    this.data.clear();
  }

  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.data.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.data.delete(key);
  }

  setItem(key: string, value: string): void {
    this.data.set(key, String(value));
  }
}
