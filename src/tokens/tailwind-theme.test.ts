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
    expect(stTailwindTheme.colors['st-primary']).toBe(
      'var(--st-color-primary)'
    );
    expect(stTailwindTheme.colors['st-surface'][0]).toBe(
      'var(--st-color-surface-0)'
    );
    expect(stTailwindTheme.colors.st['brand-primary'][700]).toBe(
      'var(--st-brand-primary-700)'
    );
    expect(stTailwindTheme.colors.st.neutral[0]).toBe(
      'var(--st-neutral-color-0)'
    );
    expect(stTailwindTheme.fontFamily['st-heading']).toEqual([
      '"Base Neue Condensed"',
      'sans-serif'
    ]);
    expect(stTailwindTheme.fontSize['st-base']).toBe('1rem');
    expect(stTailwindTheme.spacing['st-base']).toBe('1rem');
  });

  it('should keep the utility plugin for text shadows available', () => {
    expect(stTailwindPlugins).toHaveLength(1);
    expect(typeof stTailwindPlugins[0]).toBe('function');
  });

  it('should register text shadow utilities from the theme configuration', () => {
    const addUtilities = runTextShadowPlugin({
      'st-small': '0 0 4px var(--st-shadow-scale-950)',
      'st-action-hover': '0 0 16px var(--st-color-shadow-hover)'
    });

    expect(addUtilities).toHaveBeenCalledWith([
      {
        '.text-shadow-st-small': {
          textShadow: '0 0 4px var(--st-shadow-scale-950)'
        }
      },
      {
        '.text-shadow-st-action-hover': {
          textShadow: '0 0 16px var(--st-color-shadow-hover)'
        }
      }
    ]);
  });

  it('should register an empty utility list when text shadows are not configured', () => {
    const addUtilities = runTextShadowPlugin();

    expect(addUtilities).toHaveBeenCalledWith([]);
  });
});
