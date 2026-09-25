import { mount } from '@vue/test-utils';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';

import StIcon from './StIcon.vue';
import {
  stIconRendererKey,
  toFontAwesomeLookup,
  toIconifyName
} from './resolveIconName';

library.add(faPlus, faFacebookF);

describe('StIcon', () => {
  const classList = (cls: string | undefined) =>
    (cls ?? '').trim().split(/\s+/).filter(Boolean);

  it('renderiza svg quando o icone existe e aplica size', () => {
    const wrapper = mount(StIcon, {
      props: { name: 'plus', size: 2, ariaLabel: 'Adicionar' }
    });

    expect(wrapper.element.tagName.toLowerCase()).toBe('span');
    expect(wrapper.find('svg').exists()).toBe(true);
    expect(wrapper.find('svg').attributes('aria-label')).toBe('Adicionar');

    const list = classList(wrapper.attributes('class'));
    expect(list).toContain('w-st-sm');
    expect(list).toContain('h-st-sm');
    expect(classList(wrapper.find('svg').attributes('class'))).toContain(
      'w-[90%]'
    );
    expect(classList(wrapper.find('svg').attributes('class'))).toContain(
      'h-[90%]'
    );
  });

  it('renderiza svg para icone de brands quando usa prefixo fab:', () => {
    const wrapper = mount(StIcon, {
      props: { name: 'fab:facebook-f', size: 2, ariaLabel: 'Facebook' }
    });

    expect(wrapper.element.tagName.toLowerCase()).toBe('span');
    expect(wrapper.find('svg').exists()).toBe(true);
    expect(wrapper.find('svg').attributes('aria-label')).toBe('Facebook');
  });

  it('usa o Font Awesome tambem com nomes fa6-* do Iconify', () => {
    const wrapper = mount(StIcon, { props: { name: 'fa6-solid:plus' } });

    expect(wrapper.find('svg').attributes('data-icon')).toBe('plus');
  });

  it('faz fallback para span quando o icone nao existe', () => {
    const wrapper = mount(StIcon, {
      props: { name: 'does-not-exist', ariaLabel: 'X' }
    });

    expect(wrapper.element.tagName.toLowerCase()).toBe('span');
    expect(wrapper.find('svg').exists()).toBe(false);
    expect(wrapper.attributes('aria-label')).toBe('X');
  });
});

describe('StIcon — renderizador externo', () => {
  const FakeIcon = defineComponent({
    name: 'FakeIcon',
    props: { name: { type: String, required: true } },
    setup: (props) => () => h('i', { 'data-name': props.name })
  });

  const mountWithRenderer = (props: Record<string, unknown>) =>
    mount(StIcon, {
      props: { name: 'plus', ...props },
      global: { provide: { [stIconRendererKey as symbol]: FakeIcon } }
    });

  it('delega o desenho ao renderizador com o nome no formato Iconify', () => {
    const wrapper = mountWithRenderer({ name: 'plus', size: 3 });
    const glyph = wrapper.find('[data-st-icon-renderer]');

    expect(glyph.attributes('data-name')).toBe('fa6-solid:plus');
    expect(wrapper.find('svg').exists()).toBe(false);
    expect(glyph.classes()).toContain('w-[90%]');
    expect(wrapper.classes()).toContain('w-st-base');
  });

  it('converte brands e repassa outras colecoes como estao', () => {
    expect(
      mountWithRenderer({ name: 'fab:facebook-f' })
        .find('[data-st-icon-renderer]')
        .attributes('data-name')
    ).toBe('fa6-brands:facebook-f');
    expect(
      mountWithRenderer({ name: 'mdi:home' })
        .find('[data-st-icon-renderer]')
        .attributes('data-name')
    ).toBe('mdi:home');
    expect(
      mountWithRenderer({ name: 'instagram', lib: 'fab' })
        .find('[data-st-icon-renderer]')
        .attributes('data-name')
    ).toBe('fa6-brands:instagram');
  });
});

describe('resolveIconName', () => {
  it('traduz nomes da lib para o Iconify', () => {
    expect(toIconifyName('plus', 'fa')).toBe('fa6-solid:plus');
    expect(toIconifyName('Chevron_Down', 'fa')).toBe('fa6-solid:chevron-down');
    expect(toIconifyName('fab:facebook-f', 'fa')).toBe('fa6-brands:facebook-f');
    expect(toIconifyName('fa6-solid:plus', 'fa')).toBe('fa6-solid:plus');
    expect(toIconifyName('mdi:home', 'fa')).toBe('mdi:home');
  });

  it('acha o equivalente no Font Awesome so para colecoes dele', () => {
    expect(toFontAwesomeLookup('plus', 'fa')).toEqual({
      prefix: 'fas',
      iconName: 'plus'
    });
    expect(toFontAwesomeLookup('fa6-brands:facebook-f', 'fa')).toEqual({
      prefix: 'fab',
      iconName: 'facebook-f'
    });
    expect(toFontAwesomeLookup('mdi:home', 'fa')).toBeUndefined();
  });
});
