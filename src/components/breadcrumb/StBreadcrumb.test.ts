import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';

import StBreadcrumb from './StBreadcrumb.vue';
import {
  buildBreadcrumbSchema,
  isBreadcrumbCurrent,
  shouldShowBreadcrumb
} from './styleStBreadcrumb';

const items = [
  { label: 'Inicio', href: '/' },
  { label: 'Cassino', href: '/casino' },
  { label: 'Gates of Olympus' }
];

const mountBreadcrumb = (props: Record<string, unknown> = {}, options = {}) =>
  mount(StBreadcrumb, { props: { items, ...props }, ...options });

describe('styleStBreadcrumb', () => {
  it('so aparece a partir do minimo de niveis', () => {
    expect(shouldShowBreadcrumb([])).toBe(false);
    expect(shouldShowBreadcrumb([items[0]])).toBe(false);
    expect(shouldShowBreadcrumb(items.slice(0, 2))).toBe(true);
    expect(shouldShowBreadcrumb([items[0]], 1)).toBe(true);
    expect(shouldShowBreadcrumb([], 0)).toBe(false);
  });

  it('marca o ultimo nivel como atual', () => {
    expect(isBreadcrumbCurrent(2, 3)).toBe(true);
    expect(isBreadcrumbCurrent(1, 3)).toBe(false);
  });

  it('monta o BreadcrumbList do schema.org', () => {
    const schema = buildBreadcrumbSchema(items, {
      origin: 'https://startbet.io/',
      currentPath: '/play/pragmatic/gates-of-olympus'
    });

    expect(schema['@type']).toBe('BreadcrumbList');
    expect(schema.itemListElement).toEqual([
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: 'https://startbet.io/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Cassino',
        item: 'https://startbet.io/casino'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Gates of Olympus',
        item: 'https://startbet.io/play/pragmatic/gates-of-olympus'
      }
    ]);
  });

  it('mantem destinos que ja sao absolutos', () => {
    const schema = buildBreadcrumbSchema(
      [{ label: 'Blog', href: 'https://blog.startbet.io' }, { label: 'Post' }],
      { origin: 'https://startbet.io', currentPath: '/post' }
    );

    expect(schema.itemListElement[0].item).toBe('https://blog.startbet.io');
  });
});

describe('StBreadcrumb', () => {
  it('renderiza nav e lista ordenada com os niveis', () => {
    const wrapper = mountBreadcrumb();

    expect(wrapper.element.tagName).toBe('NAV');
    expect(wrapper.attributes('aria-label')).toBe('Breadcrumb');
    expect(wrapper.find('ol').exists()).toBe(true);
    expect(wrapper.findAll('[data-st-breadcrumb-item]')).toHaveLength(3);
  });

  it('usa link nos niveis com href e texto na pagina atual', () => {
    const wrapper = mountBreadcrumb();
    const links = wrapper.findAll('[data-st-breadcrumb-link]');

    expect(links).toHaveLength(2);
    expect(links[1].element.tagName).toBe('A');
    expect(links[1].attributes('href')).toBe('/casino');
    expect(links[1].attributes('title')).toBe('Cassino');

    const current = wrapper.find('[aria-current="page"]');

    expect(current.text()).toBe('Gates of Olympus');
    expect(current.classes()).toContain('text-st-content-primary');
  });

  it('nao transforma o ultimo nivel em link mesmo com href', () => {
    const wrapper = mountBreadcrumb({
      items: [
        { label: 'Inicio', href: '/' },
        { label: 'Cassino', href: '/casino' }
      ]
    });

    expect(wrapper.findAll('[data-st-breadcrumb-link]')).toHaveLength(1);
    expect(wrapper.find('[aria-current="page"]').text()).toBe('Cassino');
  });

  it('coloca separador entre os niveis, nunca depois do ultimo', () => {
    const wrapper = mountBreadcrumb();
    const separators = wrapper.findAll('[data-st-breadcrumb-separator]');

    expect(separators).toHaveLength(2);
    expect(separators[0].attributes('aria-hidden')).toBe('true');
    expect(separators[0].find('svg').attributes('data-icon')).toBe(
      'chevron-right'
    );
  });

  it('aceita separador pelo slot', () => {
    const wrapper = mountBreadcrumb({}, { slots: { separator: '/' } });

    expect(wrapper.find('[data-st-breadcrumb-separator]').text()).toBe('/');
  });

  it('entrega o destino como href ao componente de link', () => {
    const FakeLink = defineComponent({
      name: 'FakeLink',
      props: { href: { type: String, default: '' } },
      setup:
        (props, { slots }) =>
        () =>
          h('a', { 'data-fake': props.href }, slots.default?.())
    });

    const wrapper = mountBreadcrumb({ linkAs: FakeLink });

    expect(wrapper.findAll('[data-fake]')[1].attributes('data-fake')).toBe(
      '/casino'
    );
  });

  it('nao renderiza nada abaixo do minimo de niveis', () => {
    expect(mountBreadcrumb({ items: [items[0]] }).html()).toBe('<!--v-if-->');
    expect(
      mountBreadcrumb({ items: [items[0]], minItems: 1 })
        .find('nav')
        .exists()
    ).toBe(true);
  });
});
