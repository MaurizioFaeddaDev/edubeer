export type Route =
  | { name: 'styles' }
  | { name: 'style'; id: string }
  | { name: 'catalog' }
  | { name: 'beer'; id: string }
  | { name: 'compare' }
  | { name: 'deep' }
  | { name: 'deepDetail'; id: string }
  | { name: 'notFound' };

export function parseRoute(hash: string): { route: Route; search: string } {
  const raw = hash.replace(/^#/, '') || '/';
  const split = raw.indexOf('?');
  const path = split < 0 ? raw : raw.slice(0, split);
  const search = split < 0 ? '' : raw.slice(split + 1);
  if (!import.meta.env.DEV && (path === '/approfondimenti' || path.startsWith('/a/'))) {
    return { route: { name: 'notFound' }, search };
  }
  const detail = (prefix: string, name: 'beer' | 'style' | 'deepDetail'): Route | null => {
    if (!path.startsWith(prefix)) return null;
    try {
      const id = decodeURIComponent(path.slice(prefix.length));
      return id && !id.includes('/') ? { name, id } : { name: 'notFound' };
    } catch { return { name: 'notFound' }; }
  };
  const route = detail('/b/', 'beer') ?? detail('/a/', 'deepDetail') ?? detail('/stili/', 'style');
  if (route) return { route, search };
  const named: Record<string, Route> = {
    '/': { name: 'styles' }, '/stili': { name: 'styles' },
    '/birre': { name: 'catalog' }, '/confronta': { name: 'compare' },
    '/approfondimenti': { name: 'deep' },
  };
  return { route: named[path] ?? { name: 'notFound' }, search };
}

export const styleHref = (id: string) => `#/stili/${encodeURIComponent(id)}`;
export const beerHref = (id: string) => `#/b/${encodeURIComponent(id)}`;
export const deepHref = (id: string) => `#/a/${encodeURIComponent(id)}`;
