import { describe, expect, it, vi } from 'vitest';

import {
  stCssTokenImport,
  stTailwindPlugins,
  stTailwindTheme
} from './tailwind-theme';

describe('tailwind theme tokens', () => {
  it('should expose the token CSS entry for external consumers', () => {
    expect(stCssTokenImport).toBe('@startbet/st-core-ui/tokens.css');
  });

  it('should expose CSS variable based semantic colors and fonts', () => {
    expect(stTailwindTheme.colors.primary).toBe('var(--color-primary)');
    expect(stTailwindTheme.colors.surface[0]).toBe('var(--color-surface-0)');
    expect(stTailwindTheme.fontFamily.heading).toEqual([
      '"Base Neue Condensed"',
      'sans-serif'
    ]);
  });

  it('should keep the utility plugin for text shadows available', () => {
    expect(stTailwindPlugins).toHaveLength(1);
    expect(typeof stTailwindPlugins[0]).toBe('function');
  });

  it('should register text shadow utilities from the theme configuration', () => {
    const addUtilities = vi.fn();
    const plugin = stTailwindPlugins[0];

    plugin({
      addUtilities,
      theme: (path) =>
        path === 'textShadow'
          ? {
              'ds-small': '0 0 4px var(--shadow-scale-950)',
              'action-hover': '0 0 16px var(--color-shadow-hover)'
            }
          : undefined
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
    const addUtilities = vi.fn();
    const plugin = stTailwindPlugins[0];

    plugin({
      addUtilities,
      theme: () => undefined
    });

    expect(addUtilities).toHaveBeenCalledWith([]);
  });
});
