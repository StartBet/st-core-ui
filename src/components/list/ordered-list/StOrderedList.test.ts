import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import StOrderedList from './StOrderedList.vue';

describe('StOrderedList', () => {
  it('renderiza ol e aplica defaults', () => {
    const wrapper = mount(StOrderedList, {
      slots: { default: '<li>Item</li>' }
    });

    expect(wrapper.element.tagName.toLowerCase()).toBe('ol');

    const classList = wrapper.attributes('class');
    expect(classList).toContain('!m-0');
    expect(classList).toContain('list-decimal');
    expect(classList).toContain('flex-col');
    expect(classList).toContain('gap-st-1');
  });

  it('aplica orientation horizontal', () => {
    const wrapper = mount(StOrderedList, {
      props: { orientation: 'horizontal' },
      slots: { default: '<li>Item</li>' }
    });

    const classList = wrapper.attributes('class');
    expect(classList).toContain('flex-row');
    expect(classList).toContain('list-none');
    expect(classList).toContain('gap-st-2');
  });

  it('dense remove gap', () => {
    const wrapper = mount(StOrderedList, {
      props: { dense: true },
      slots: { default: '<li>Item</li>' }
    });

    const classList = wrapper.attributes('class');
    expect(classList).toContain('gap-0');
    expect(classList).not.toContain('gap-st-1');
    expect(classList).not.toContain('gap-st-2');
  });

  it('força render vertical para sub-lista mesmo quando parent é horizontal', () => {
    const Host = {
      components: { StOrderedList },
      template: `
        <StOrderedList orientation="horizontal">
          <StOrderedList>
            <li>Sub</li>
          </StOrderedList>
        </StOrderedList>
      `
    };

    const wrapper = mount(Host);
    const lists = wrapper.findAll('ol');

    expect(lists).toHaveLength(2);
    expect(lists[0].attributes('class')).toContain('flex-row');
    expect(lists[1].attributes('class')).toContain('flex-col');
  });
});
