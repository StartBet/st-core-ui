import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h, ref } from 'vue';

import {
  createInactiveBreakpoints,
  resolveResponsiveValue,
  stBreakpointMinWidths,
  toResponsiveValue,
  useResponsiveValue
} from './useResponsiveValue';

describe('resolveResponsiveValue', () => {
  it('usa o valor base quando nenhum breakpoint esta ativo', () => {
    expect(
      resolveResponsiveValue({ base: 1, md: 3 }, createInactiveBreakpoints())
    ).toBe(1);
  });

  it('aplica a cascata mobile first', () => {
    const value = { base: 1, sm: 2, lg: 4 };

    expect(
      resolveResponsiveValue(value, { sm: true, md: false, lg: false })
    ).toBe(2);
    expect(
      resolveResponsiveValue(value, { sm: true, md: true, lg: true })
    ).toBe(4);
  });

  it('ignora breakpoints sem valor definido', () => {
    expect(
      resolveResponsiveValue(
        { base: 'outside', md: 'inside' },
        { sm: true, md: true, lg: true }
      )
    ).toBe('inside');
  });

  it('monta o valor responsivo a partir das props prefixadas', () => {
    expect(
      toResponsiveValue(2, { sm: undefined, md: 4, lg: undefined })
    ).toEqual({ base: 2, sm: undefined, md: 4, lg: undefined });
  });

  it('expoe os breakpoints do tailwind usados pela lib', () => {
    expect(stBreakpointMinWidths).toEqual({ sm: 640, md: 768, lg: 1024 });
  });
});

describe('useResponsiveValue', () => {
  it('reage a mudanca da fonte e dos breakpoints ativos', async () => {
    const active = ref({ sm: false, md: false, lg: false });
    const slidePerPage = ref(1);

    const component = defineComponent({
      setup() {
        const resolved = useResponsiveValue(
          () => ({ base: slidePerPage.value, md: 3 }),
          active
        );

        return () => h('span', String(resolved.value));
      }
    });

    const wrapper = mount(component);

    expect(wrapper.text()).toBe('1');

    active.value = { sm: false, md: true, lg: false };
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toBe('3');

    active.value = { sm: false, md: false, lg: false };
    slidePerPage.value = 2;
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toBe('2');
  });
});
