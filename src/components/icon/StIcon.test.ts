import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import StIcon from './StIcon.vue';

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

  it('faz fallback para span quando o icone nao existe', () => {
    const wrapper = mount(StIcon, {
      props: { name: 'does-not-exist', ariaLabel: 'X' }
    });

    expect(wrapper.element.tagName.toLowerCase()).toBe('span');
    expect(wrapper.find('svg').exists()).toBe(false);
    expect(wrapper.attributes('aria-label')).toBe('X');
  });
});
