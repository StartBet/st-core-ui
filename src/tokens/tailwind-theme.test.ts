import { describe, expect, it } from 'vitest';

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
});
