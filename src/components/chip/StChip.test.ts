import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import StChip from './StChip.vue';

describe('StChip', () => {
  const classList = (cls: string | undefined) =>
    (cls ?? '').trim().split(/\s+/).filter(Boolean);

  it('renderiza o slot e aplica defaults', () => {
    const wrapper = mount(StChip, { slots: { default: 'Chip' } });

    expect(wrapper.text()).toContain('Chip');

    const list = classList(wrapper.attributes('class'));
    expect(list).toContain('h-st-3');
    expect(list).toContain('rounded-st-1');
    expect(list).toContain('bg-st-content-primary');
    expect(list).toContain('text-st-surface-primary');
  });

  it('aplica variant warning', () => {
    const wrapper = mount(StChip, {
      props: { variant: 'warning' },
      slots: { default: 'Warning' }
    });
    const list = classList(wrapper.attributes('class'));

    expect(list).toContain('bg-st-content-warning');
    expect(list).toContain('border-st-content-warning');
    expect(list).toContain('text-st-surface-warning');
  });

  it('dispara click por mouse e teclado apenas quando clickable=true', async () => {
    const onClick = vi.fn();
    const wrapper = mount(StChip, {
      props: { clickable: true },
      attrs: { onClick },
      slots: { default: 'Clickable' }
    });

    expect(wrapper.attributes('role')).toBe('button');
    expect(wrapper.attributes('tabindex')).toBe('0');

    await wrapper.trigger('click');
    await wrapper.trigger('keydown', { key: 'Enter' });
    await wrapper.trigger('keydown', { key: ' ' });
    await wrapper.trigger('keydown', { key: 'Escape' });

    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('não dispara click quando clickable=false', async () => {
    const onClick = vi.fn();
    const wrapper = mount(StChip, {
      props: { clickable: false },
      attrs: { onClick },
      slots: { default: 'Static' }
    });

    await wrapper.trigger('click');
    await wrapper.trigger('keydown', { key: 'Enter' });

    expect(onClick).not.toHaveBeenCalled();
    expect(wrapper.attributes('role')).toBeUndefined();
  });

  it('renderiza botão de close e chama onClose sem propagar o click', async () => {
    const onClick = vi.fn();
    const onClose = vi.fn();
    const wrapper = mount(StChip, {
      props: { clickable: true, closable: true, onClose },
      attrs: { onClick },
      slots: { default: 'Closable' }
    });

    const closeButton = wrapper.find('button[aria-label="Close"]');

    expect(closeButton.exists()).toBe(true);
    expect(closeButton.find('svg').exists()).toBe(true);
    expect(wrapper.attributes('role')).toBeUndefined();
    expect(wrapper.attributes('tabindex')).toBeUndefined();

    await wrapper.trigger('click');
    await wrapper.trigger('keydown', { key: 'Enter' });

    await closeButton.trigger('click');

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });
});
