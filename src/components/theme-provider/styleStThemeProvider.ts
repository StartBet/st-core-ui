import type { InjectionKey } from 'vue';

import type {
  StThemeContext,
  StThemeMode,
  StThemeSetting,
  ThemeProviderClassProps
} from './StThemeProvider.interface';

export const stThemeContextKey: InjectionKey<StThemeContext> =
  Symbol('st-theme-context');

/** Tema do `:root`, usado quando nao ha provider nem preferencia conhecida. */
export const ST_THEME_DEFAULT_MODE: StThemeMode = 'light';

export const ST_THEME_ATTRIBUTE = 'data-theme';

type ResolveThemeOptions = {
  parentTheme?: StThemeMode | null;
  systemTheme?: StThemeMode | null;
};

/**
 * Resolve o tema pedido em um modo concreto.
 * `system` cai para o tema do pai quando a preferencia ainda nao foi medida,
 * evitando um flash de tema errado antes da hidratacao.
 */
export const resolveThemeMode = (
  setting: StThemeSetting,
  options: ResolveThemeOptions = {}
): StThemeMode => {
  const { parentTheme = null, systemTheme = null } = options;

  if (setting === 'light' || setting === 'dark') return setting;

  if (setting === 'system') {
    return systemTheme ?? parentTheme ?? ST_THEME_DEFAULT_MODE;
  }

  return parentTheme ?? ST_THEME_DEFAULT_MODE;
};

export const toggleThemeMode = (mode: StThemeMode): StThemeMode =>
  mode === 'dark' ? 'light' : 'dark';

/** Le o tema aplicado no `<html>`; fora do browser assume o tema do `:root`. */
export const readDocumentTheme = (): StThemeMode => {
  if (typeof document === 'undefined') return ST_THEME_DEFAULT_MODE;

  return document.documentElement.getAttribute(ST_THEME_ATTRIBUTE) === 'dark'
    ? 'dark'
    : ST_THEME_DEFAULT_MODE;
};

export const buildThemeProviderClasses = (props: ThemeProviderClassProps) => {
  const { inline = false, className } = props;

  return [inline ? 'contents' : undefined, className].filter(Boolean).join(' ');
};
