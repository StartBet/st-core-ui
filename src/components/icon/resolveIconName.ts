import type { Component, InjectionKey } from 'vue';

import type { StIconLibrary } from './StIcon.interface';

/**
 * Componente que desenha o icone no lugar do Font Awesome embutido, como o
 * `Icon` do `@nuxt/icon`. Recebe `name` no formato Iconify (`colecao:icone`).
 */
export const stIconRendererKey: InjectionKey<Component> =
  Symbol('st-icon-renderer');

/**
 * Prefixos da lib e as colecoes do Iconify equivalentes. As colecoes `fa6-*`
 * usam os mesmos nomes do Font Awesome 6 Free, entao a troca e so de prefixo.
 */
const iconifyCollections: Record<string, string> = {
  fa: 'fa6-solid',
  fas: 'fa6-solid',
  fab: 'fa6-brands'
};

const fontAwesomePrefixes: Record<string, 'fas' | 'fab'> = {
  fa: 'fas',
  fas: 'fas',
  'fa6-solid': 'fas',
  fab: 'fab',
  'fa6-brands': 'fab'
};

const normalize = (value: string) =>
  value.trim().toLowerCase().split('_').join('-');

export const parseIconName = (value: string, fallbackLib: StIconLibrary) => {
  const raw = value.trim();
  const index = raw.indexOf(':');

  if (index <= 0) return { collection: fallbackLib, icon: normalize(raw) };

  return {
    collection: normalize(raw.slice(0, index)),
    icon: normalize(raw.slice(index + 1))
  };
};

/** `plus` → `fa6-solid:plus`, `fab:x` → `fa6-brands:x`, `mdi:home` segue igual. */
export const toIconifyName = (value: string, fallbackLib: StIconLibrary) => {
  const { collection, icon } = parseIconName(value, fallbackLib);

  return `${iconifyCollections[collection] ?? collection}:${icon}`;
};

/** Busca no Font Awesome; colecoes fora do Font Awesome nao tem equivalente. */
export const toFontAwesomeLookup = (
  value: string,
  fallbackLib: StIconLibrary
) => {
  const { collection, icon } = parseIconName(value, fallbackLib);
  const prefix = fontAwesomePrefixes[collection];

  return prefix ? { prefix, iconName: icon } : undefined;
};
