import { computed, inject, ref } from 'vue';

import type {
  StThemeContext,
  StThemeSetting
} from '../components/theme-provider/StThemeProvider.interface';
import {
  ST_THEME_ATTRIBUTE,
  readDocumentTheme,
  stThemeContextKey
} from '../components/theme-provider/styleStThemeProvider';

let detachedContext: StThemeContext | null = null;

/**
 * Contexto usado fora de um `StThemeProvider`: espelha o `data-theme` do
 * `<html>` em modo leitura. E um singleton porque observa um estado global -
 * um unico `MutationObserver` atende todos os consumidores sem provider.
 */
const useDetachedThemeContext = (): StThemeContext => {
  if (detachedContext) return detachedContext;

  const documentTheme = ref(readDocumentTheme());

  if (
    typeof MutationObserver !== 'undefined' &&
    typeof document !== 'undefined'
  ) {
    const observer = new MutationObserver(() => {
      documentTheme.value = readDocumentTheme();
    });

    observer.observe(document.documentElement, {
      attributeFilter: [ST_THEME_ATTRIBUTE]
    });
  }

  detachedContext = {
    theme: computed<StThemeSetting>(() => 'inherit'),
    resolvedTheme: computed(() => documentTheme.value),
    systemTheme: computed(() => null),
    setTheme: () => undefined,
    toggle: () => undefined
  };

  return detachedContext;
};

/**
 * Le o tema do `StThemeProvider` mais proximo.
 *
 * Sem provider na arvore, `resolvedTheme` acompanha o `data-theme` do `<html>`
 * e `setTheme`/`toggle` nao fazem nada - nao ha escopo para alterar.
 */
export const useTheme = (): StThemeContext =>
  inject(stThemeContextKey, null) ?? useDetachedThemeContext();
