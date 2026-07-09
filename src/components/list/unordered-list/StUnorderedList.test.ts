import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import StUnorderedList from './StUnorderedList.vue';

describe('StUnorderedList', () => {
  it('renderiza ul e aplica defaults', () => {
    const wrapper = mount(StUnorderedList, {
      slots: { default: '<li>Item</li>' }
    });

    expect(wrapper.element.tagName.toLowerCase()).toBe('ul');

    const classList = wrapper.attributes('class');
    expect(classList).toContain('list-none');
    expect(classList).toContain('flex');
    expect(classList).toContain('flex-col');
  });

  it('aplica orientation horizontal', () => {
    const wrapper = mount(StUnorderedList, {
      props: { orientation: 'horizontal' },
      slots: { default: '<li>Item</li>' }
    });

    const classList = wrapper.attributes('class');
    expect(classList).toContain('flex-row');
    expect(classList).toContain('flex-wrap');
  });

  it('dense remove gap', () => {
    const wrapper = mount(StUnorderedList, {
      props: { dense: true },
      slots: { default: '<li>Item</li>' }
    });

    const classList = wrapper.attributes('class');
    expect(classList).toContain('gap-0');
    expect(classList).not.toContain('gap-st-1');
  });

  it('força render vertical para sub-lista mesmo quando parent é horizontal', () => {
    const Host = {
      components: { StUnorderedList },
      template: `
        <StUnorderedList orientation="horizontal">
          <StUnorderedList>
            <li>Sub</li>
          </StUnorderedList>
        </StUnorderedList>
      `
    };

    const wrapper = mount(Host);
    const lists = wrapper.findAll('ul');

    expect(lists.length).toBe(2);
    expect(lists[0].attributes('class')).toContain('flex-row');
    expect(lists[1].attributes('class')).toContain('flex-col');
  });
});
