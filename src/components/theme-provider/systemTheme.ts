import { ref } from 'vue';

import type { StThemeMode } from './StThemeProvider.interface';

export const ST_THEME_SYSTEM_QUERY = '(prefers-color-scheme: dark)';

/**
 * `prefers-color-scheme` e um estado unico do documento, entao a medicao vive
 * fora dos componentes: um `MediaQueryList` atende todos os providers montados,
 * com contagem de assinantes para descartar o listener no fim.
 */
const systemTheme = ref<StThemeMode | null>(null);

let query: MediaQueryList | null = null;
let listener: ((event: MediaQueryListEvent) => void) | null = null;
let subscribers = 0;

const startWatching = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return;

  query = window.matchMedia(ST_THEME_SYSTEM_QUERY);
  systemTheme.value = query.matches ? 'dark' : 'light';

  if (typeof query.addEventListener !== 'function') return;

  listener = (event: MediaQueryListEvent) => {
    systemTheme.value = event.matches ? 'dark' : 'light';
  };

  query.addEventListener('change', listener);
};

const stopWatching = () => {
  if (query && listener) query.removeEventListener('change', listener);

  query = null;
  listener = null;
  systemTheme.value = null;
};

export const useSystemThemeState = () => systemTheme;

/** Assina a preferencia do sistema e devolve o descarte da assinatura. */
export const subscribeSystemTheme = () => {
  subscribers += 1;

  if (subscribers === 1) startWatching();

  let released = false;

  return () => {
    if (released) return;

    released = true;
    subscribers -= 1;

    if (subscribers === 0) stopWatching();
  };
};
