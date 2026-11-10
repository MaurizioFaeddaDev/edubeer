import { afterEach, describe, expect, it, vi } from 'vitest';
import { parseRoute, styleHref } from '../routes';

describe('route condivisibili', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('rende gli approfondimenti accessibili solo in sviluppo', () => {
    for (const dev of [true, false]) {
      vi.stubEnv('DEV', dev);
      expect(parseRoute('#/approfondimenti?q=dupont').route.name).toBe(dev ? 'deep' : 'notFound');
      expect(parseRoute('#/a/saison-dupont').route.name).toBe(dev ? 'deepDetail' : 'notFound');
      expect(parseRoute('#/birre').route.name).toBe('catalog');
    }
  });
  it('mantiene alias, filtri e indirizzi precedenti', () => {
    expect(parseRoute('#/stili?fam=Lager')).toEqual({ route: { name: 'styles' }, search: 'fam=Lager' });
    expect(parseRoute('#/birre?q=stout&stile=20B')).toEqual({ route: { name: 'catalog' }, search: 'q=stout&stile=20B' });
    expect(parseRoute('#/b/pilsner-urquell').route).toEqual({ name: 'beer', id: 'pilsner-urquell' });
    expect(parseRoute('#/a/saison-dupont').route).toEqual({ name: 'deepDetail', id: 'saison-dupont' });
  });
  it('supporta gli stili storici e codifica gli identificatori', () => {
    expect(parseRoute(styleHref('27-kellerbier')).route).toEqual({ name: 'style', id: '27-kellerbier' });
    expect(parseRoute(styleHref('27-weiß')).route).toEqual({ name: 'style', id: '27-weiß' });
  });
  it('gestisce indirizzi sconosciuti, vuoti e malformati senza eccezioni', () => {
    for (const hash of ['#/stili/%E0%A4%A', '#/stili/', '#/b/a/b', '#/inesistente']) {
      expect(parseRoute(hash).route.name).toBe('notFound');
    }
    expect(parseRoute('').route.name).toBe('styles');
  });
});
