import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import StTooltip from './StTooltip.vue';

describe('StTooltip', () => {
  it('abre no mouseenter e fecha no mouseleave no modo não controlado', async () => {
    const wrapper = mount(StTooltip, {
      slots: {
        trigger: '<button type="button">Trigger</button>',
        default: 'Tooltip content'
      }
    });

    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false);

    await wrapper.trigger('mouseenter');
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(true);

    await wrapper.trigger('mouseleave');
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false);
  });

  it('aplica aria-describedby no trigger quando aberto', async () => {
    const wrapper = mount(StTooltip, {
      slots: {
        trigger: '<button type="button">Trigger</button>',
        default: 'Tooltip content'
      }
    });

    const triggerWrapper = wrapper.findAll('span')[1];

    expect(triggerWrapper.attributes('aria-describedby')).toBeUndefined();

    await wrapper.trigger('mouseenter');

    const describedBy = triggerWrapper.attributes('aria-describedby');

    expect(describedBy).toMatch(/^st-tooltip-/);
    expect(wrapper.find('[role="tooltip"]').attributes('id')).toBe(describedBy);
  });

  it('fecha com Escape', async () => {
    const wrapper = mount(StTooltip, {
      slots: {
        trigger: '<button type="button">Trigger</button>',
        default: 'Tooltip content'
      }
    });

    await wrapper.trigger('mouseenter');
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(true);

    await wrapper.trigger('keydown', { key: 'Escape' });

    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false);
  });

  it('disabled impede abrir', async () => {
    const wrapper = mount(StTooltip, {
      props: { disabled: true },
      slots: {
        trigger: '<button type="button">Trigger</button>',
        default: 'Tooltip content'
      }
    });

    await wrapper.trigger('mouseenter');

    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false);
  });

  it('modo controlado respeita open', async () => {
    const wrapper = mount(StTooltip, {
      props: { open: false },
      slots: {
        trigger: '<button type="button">Trigger</button>',
        default: 'Tooltip content'
      }
    });

    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false);

    await wrapper.setProps({ open: true });
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(true);

    await wrapper.setProps({ open: false });
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false);
  });

  it('dispara onOpenChange e eventos no modo não controlado', async () => {
    const onOpenChange = vi.fn();
    const wrapper = mount(StTooltip, {
      props: { onOpenChange },
      slots: {
        trigger: '<button type="button">Trigger</button>',
        default: 'Tooltip content'
      }
    });

    await wrapper.trigger('mouseenter');

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(wrapper.emitted('open-change')?.[0]).toEqual([true]);
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true]);
  });

  it('encaminha triggerProps e normaliza classes do root', async () => {
    const onFocus = vi.fn();
    const wrapper = mount(StTooltip, {
      props: {
        triggerProps: {
          className: 'trigger-extra',
          title: 'tooltip-trigger',
          onFocus
        }
      },
      attrs: {
        class: { 'root-extra': true }
      },
      slots: {
        trigger: '<button type="button">Trigger</button>',
        default: 'Tooltip content'
      }
    });

    expect(wrapper.classes()).toContain('root-extra');

    const triggerWrapper = wrapper.findAll('span')[1];

    expect(triggerWrapper.classes()).toContain('trigger-extra');
    expect(triggerWrapper.attributes('title')).toBe('tooltip-trigger');

    await wrapper.trigger('focusin');

    expect(onFocus).toHaveBeenCalledTimes(1);
  });
});
