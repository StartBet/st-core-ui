import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { h, nextTick } from 'vue';

import { stListContextKey } from '../styleStList';
import StUnorderedList from '../unordered-list/StUnorderedList.vue';
import StListItem from './StListItem.vue';

describe('StListItem', () => {
  it('remove border radius inferior quando usa divider', () => {
    const wrapper = mount(StListItem, {
      props: { clickable: true, divider: true },
      slots: { default: 'Item' }
    });

    expect(wrapper.find('button[type="button"]').classes()).toContain(
      'rounded-b-none'
    );
  });

  it('renderiza li e dispara click quando clickable', async () => {
    const onClick = vi.fn();

    const wrapper = mount(StListItem, {
      props: { clickable: true, onClick },
      slots: { default: 'Item' }
    });

    expect(wrapper.element.tagName.toLowerCase()).toBe('li');

    const mainButton = wrapper.find('button[type="button"]');
    expect(mainButton.exists()).toBe(true);

    await mainButton.trigger('click');

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renderiza startAdornment e endAdornment', () => {
    const wrapper = mount(StListItem, {
      props: { clickable: true },
      slots: {
        default: 'Item',
        startAdornment: () => 'S',
        endAdornment: () => 'E'
      }
    });

    expect(wrapper.text()).toContain('S');
    expect(wrapper.text()).toContain('Item');
    expect(wrapper.text()).toContain('E');
  });

  it('vertical: renderiza toggle e expande sub-lista inline', async () => {
    const wrapper = mount(StListItem, {
      props: { clickable: true },
      global: {
        provide: {
          [stListContextKey as symbol]: {
            navOrientation: 'vertical',
            level: 1
          }
        }
      },
      slots: {
        default: () => [
          'Parent',
          h(StUnorderedList, null, {
            default: () => h('li', null, 'Sub')
          })
        ]
      }
    });

    const toggle = wrapper.find('button[aria-label="Abrir submenu"]');
    expect(toggle.exists()).toBe(true);

    const list = wrapper.find('ul');
    expect(list.exists()).toBe(true);
    expect(list.element.parentElement?.className).toContain('hidden');

    await toggle.trigger('click');
    await nextTick();

    expect(list.element.parentElement?.className).toContain('block');
  });

  it('horizontal: abre submenu via dropdown', async () => {
    const wrapper = mount(StListItem, {
      props: { clickable: true },
      attachTo: document.body,
      global: {
        provide: {
          [stListContextKey as symbol]: {
            navOrientation: 'horizontal',
            level: 1
          }
        }
      },
      slots: {
        default: () => [
          'Parent',
          h(StUnorderedList, null, {
            default: () => h('li', null, 'Sub')
          })
        ]
      }
    });

    expect(wrapper.find('ul').exists()).toBe(false);
    expect(wrapper.find('dialog').exists()).toBe(false);

    const trigger = wrapper.find('button[aria-label="Abrir submenu"]');
    expect(trigger.exists()).toBe(true);

    await trigger.trigger('click');
    await nextTick();
    await nextTick();

    const dialog = wrapper.find('dialog');
    expect(dialog.exists()).toBe(true);
    expect(dialog.find('ul').exists()).toBe(true);

    wrapper.unmount();
  });

  it('horizontal: reabre dropdown sem perder os itens do submenu', async () => {
    const wrapper = mount(StListItem, {
      props: { clickable: true },
      attachTo: document.body,
      global: {
        provide: {
          [stListContextKey as symbol]: {
            navOrientation: 'horizontal',
            level: 1
          }
        }
      },
      slots: {
        default: () => [
          'Parent',
          h(StUnorderedList, null, {
            default: () => [h('li', null, 'Sub A'), h('li', null, 'Sub B')]
          })
        ]
      }
    });

    const trigger = wrapper.find('button[aria-label="Abrir submenu"]');
    expect(trigger.exists()).toBe(true);

    await trigger.trigger('click');
    await nextTick();
    await nextTick();

    expect(wrapper.find('dialog').exists()).toBe(true);
    expect(wrapper.findAll('dialog ul li')).toHaveLength(2);

    await trigger.trigger('click');
    await nextTick();
    await nextTick();

    expect(wrapper.find('dialog').exists()).toBe(false);

    await trigger.trigger('click');
    await nextTick();
    await nextTick();

    expect(wrapper.find('dialog').exists()).toBe(true);
    expect(wrapper.findAll('dialog ul li')).toHaveLength(2);

    wrapper.unmount();
  });
});
