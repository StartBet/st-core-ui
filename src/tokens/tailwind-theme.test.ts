import { describe, expect, it, vi } from 'vitest';

import {
  stCssTokenImport,
  stTailwindPlugins,
  stTailwindTheme
} from './tailwind-theme';

const runTextShadowPlugin = (textShadow?: Record<string, string>) => {
  const addUtilities = vi.fn();
  const plugin = stTailwindPlugins[0];

  plugin({
    addUtilities,
    theme: (path) => (path === 'textShadow' ? textShadow : undefined)
  });

  return addUtilities;
};

describe('tailwind theme tokens', () => {
  it('should expose the token CSS entry for external consumers', () => {
    expect(stCssTokenImport).toBe('@startbet/st-core-ui/tokens.css');
  });

  it('should expose CSS variable based semantic colors, scales and fonts', () => {
    expect(stTailwindTheme.colors.primary).toBe('var(--color-primary)');
    expect(stTailwindTheme.colors.surface[0]).toBe('var(--color-surface-0)');
    expect(stTailwindTheme.colors.st['brand-primary'][700]).toBe(
      'var(--brand-primary-700)'
    );
    expect(stTailwindTheme.colors.st.neutral[0]).toBe('var(--neutral-color-0)');
    expect(stTailwindTheme.fontFamily.heading).toEqual([
      '"Base Neue Condensed"',
      'sans-serif'
    ]);
    expect(stTailwindTheme.fontSize['ds-base']).toBe('1rem');
    expect(stTailwindTheme.spacing['ds-base']).toBe('1rem');
  });

  it('should keep the utility plugin for text shadows available', () => {
    expect(stTailwindPlugins).toHaveLength(1);
    expect(typeof stTailwindPlugins[0]).toBe('function');
  });

  it('should register text shadow utilities from the theme configuration', () => {
    const addUtilities = runTextShadowPlugin({
      'ds-small': '0 0 4px var(--shadow-scale-950)',
      'action-hover': '0 0 16px var(--color-shadow-hover)'
    });

    expect(addUtilities).toHaveBeenCalledWith([
      {
        '.text-shadow-ds-small': {
          textShadow: '0 0 4px var(--shadow-scale-950)'
        }
      },
      {
        '.text-shadow-action-hover': {
          textShadow: '0 0 16px var(--color-shadow-hover)'
        }
      }
    ]);
  });

  it('should register an empty utility list when text shadows are not configured', () => {
    const addUtilities = runTextShadowPlugin();

    expect(addUtilities).toHaveBeenCalledWith([]);
  });
});
