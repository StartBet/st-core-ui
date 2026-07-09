import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import StLoading from './StLoading.vue';

describe('StLoading', () => {
  it('renderiza o container e usa primary por default', () => {
    const wrapper = mount(StLoading);

    expect(wrapper.element.tagName.toLowerCase()).toBe('span');
    expect(wrapper.attributes('role')).toBe('status');
    expect(wrapper.attributes('aria-busy')).toBe('true');
    expect(
      wrapper.find('[data-loading-arrow]').attributes('data-variant')
    ).toBe('primary');
  });

  it('renderiza variant secondary', () => {
    const wrapper = mount(StLoading, {
      props: { variant: 'secondary' }
    });

    expect(
      wrapper.find('[data-loading-arrow]').attributes('data-variant')
    ).toBe('secondary');
    expect(wrapper.find('[data-loading-arrow]').attributes('style')).toContain(
      'color: var(--st-color-primary);'
    );
  });

  it('renderiza variant tertiary', () => {
    const wrapper = mount(StLoading, {
      props: { variant: 'tertiary' }
    });

    expect(
      wrapper.find('[data-loading-arrow]').attributes('data-variant')
    ).toBe('tertiary');
    expect(wrapper.find('[data-loading-arrow]').attributes('style')).toContain(
      'color: var(--st-color-content-bright);'
    );
  });

  it('aplica cor secondary no arrow quando variant é primary', () => {
    const wrapper = mount(StLoading);

    expect(wrapper.find('[data-loading-arrow]').attributes('style')).toContain(
      'color: var(--st-color-secondary);'
    );
  });

  it('renderiza spinner', () => {
    const wrapper = mount(StLoading, {
      props: { type: 'spinner', size: '3' }
    });

    expect(wrapper.find('[data-loading-arrow]').exists()).toBe(false);
    expect(wrapper.find('[data-loading-spinner]').exists()).toBe(true);
    expect(wrapper.find('[data-loading-spinner]').classes()).toContain(
      'animate-st-spinner-infinite'
    );
    expect(
      wrapper.find('[data-loading-spinner]').attributes('style')
    ).toContain('color: var(--st-color-content-bright);');
  });

  it('renderiza cyclical e atualiza com value', async () => {
    const wrapper = mount(StLoading, {
      props: { type: 'cyclical', value: 50 }
    });

    const circle = wrapper.find('circle');
    expect(circle.exists()).toBe(true);
    expect(circle.attributes('stroke')).toBe('var(--st-color-content-bright)');

    const circumference = 2 * Math.PI * 46;
    const offset50 = Number(circle.attributes('stroke-dashoffset'));
    expect(offset50).toBeCloseTo(circumference * 0.5, 3);

    await wrapper.setProps({ value: 100 });

    const offset100 = Number(
      wrapper.find('circle').attributes('stroke-dashoffset')
    );
    expect(offset100).toBeCloseTo(0, 3);
  });

  it('aplica size no container', () => {
    const wrapper = mount(StLoading, {
      props: { size: '3' }
    });

    expect(wrapper.classes()).toContain('h-st-3');
    expect(wrapper.classes()).toContain('w-st-3');
  });
});
