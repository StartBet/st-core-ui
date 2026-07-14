import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import StIllustration from './StIllustration.vue';
import { ST_ILLUSTRATION_CDN_BASE_URL } from './styleStIllustration';

describe('StIllustration', () => {
  it('renderiza a imagem com URL do CDN e encaminha attrs', () => {
    const wrapper = mount(StIllustration, {
      props: {
        name: 'arrows/chip_3d',
        alt: 'Chip 3D',
        width: '56',
        height: '56',
        className: 'custom-class'
      },
      attrs: {
        class: 'external-class',
        style: 'opacity: 0.5;',
        loading: 'lazy',
        decoding: 'async'
      }
    });

    const img = wrapper.get('img');

    expect(img.attributes('src')).toBe(
      `${ST_ILLUSTRATION_CDN_BASE_URL}/arrows/chip_3d.svg`
    );
    expect(img.attributes('alt')).toBe('Chip 3D');
    expect(img.attributes('width')).toBe('56');
    expect(img.attributes('height')).toBe('56');
    expect(img.attributes('loading')).toBe('lazy');
    expect(img.attributes('decoding')).toBe('async');
    expect(img.attributes('class')).toContain('custom-class');
    expect(img.attributes('class')).toContain('external-class');
    expect(img.attributes('class')).toContain('w-st-56');
    expect(img.attributes('class')).toContain('h-st-56');
    expect(img.attributes('style')).toContain('opacity: 0.5;');
  });

  it('normaliza nomes com barra inicial e extensao svg', () => {
    const wrapper = mount(StIllustration, {
      props: {
        name: '/arrows/chip_3d.svg' as string,
        alt: 'Chip 3D'
      }
    });

    expect(wrapper.get('img').attributes('src')).toBe(
      `${ST_ILLUSTRATION_CDN_BASE_URL}/arrows/chip_3d.svg`
    );
  });

  it('nao aplica width ou height nativos para valores nao numericos', () => {
    const wrapper = mount(StIllustration, {
      props: {
        name: 'brands/logo_dark',
        alt: 'Logo',
        width: 'full',
        height: 'auto'
      }
    });

    const img = wrapper.get('img');

    expect(img.attributes('width')).toBeUndefined();
    expect(img.attributes('height')).toBeUndefined();
    expect(img.attributes('class')).toContain('w-full');
    expect(img.attributes('class')).toContain('h-auto');
  });
});
