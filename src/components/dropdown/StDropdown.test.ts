import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { h, nextTick } from 'vue';

import StDropdown from './StDropdown.vue';

describe('StDropdown', () => {
  it('abre e fecha ao clicar no trigger no modo não controlado', async () => {
    const wrapper = mount(StDropdown, {
      slots: {
        trigger: () => 'Abrir',
        default: () => h('div', { 'data-testid': 'panel' }, 'Panel')
      }
    });

    expect(wrapper.find('[data-testid="panel"]').exists()).toBe(false);

    await wrapper.find('button').trigger('click');
    await nextTick();
    await nextTick();

    expect(wrapper.find('[data-testid="panel"]').exists()).toBe(true);

    await wrapper.find('button').trigger('click');
    await nextTick();
    await nextTick();

    expect(wrapper.find('[data-testid="panel"]').exists()).toBe(false);
  });

  it('fecha ao clicar fora quando closeOnOutsideClick=true', async () => {
    const wrapper = mount(StDropdown, {
      props: { defaultOpen: true, closeOnOutsideClick: true },
      slots: {
        trigger: () => 'Abrir',
        default: () => h('div', { 'data-testid': 'panel' }, 'Panel')
      }
    });

    await nextTick();
    await nextTick();

    expect(wrapper.find('[data-testid="panel"]').exists()).toBe(true);

    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await nextTick();
    await nextTick();

    expect(wrapper.find('[data-testid="panel"]').exists()).toBe(false);
  });

  it('não fecha ao clicar fora quando closeOnOutsideClick=false', async () => {
    const wrapper = mount(StDropdown, {
      props: { defaultOpen: true, closeOnOutsideClick: false },
      slots: {
        trigger: () => 'Abrir',
        default: () => h('div', { 'data-testid': 'panel' }, 'Panel')
      }
    });

    await nextTick();
    await nextTick();

    expect(wrapper.find('[data-testid="panel"]').exists()).toBe(true);

    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await nextTick();
    await nextTick();

    expect(wrapper.find('[data-testid="panel"]').exists()).toBe(true);
  });

  it('fecha ao pressionar Escape quando está aberto', async () => {
    const wrapper = mount(StDropdown, {
      props: { defaultOpen: true },
      slots: {
        trigger: () => 'Abrir',
        default: () => h('div', { 'data-testid': 'panel' }, 'Panel')
      }
    });

    await nextTick();
    await nextTick();

    expect(wrapper.find('[data-testid="panel"]').exists()).toBe(true);

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    await nextTick();
    await nextTick();

    expect(wrapper.find('[data-testid="panel"]').exists()).toBe(false);
  });

  it('emite open-change, update:open e chama onOpenChange em modo controlado', async () => {
    const onOpenChange = vi.fn();
    const wrapper = mount(StDropdown, {
      props: { open: false, onOpenChange },
      slots: {
        trigger: () => 'Abrir',
        default: () => h('div', { 'data-testid': 'panel' }, 'Panel')
      }
    });

    await wrapper.find('button').trigger('click');

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(wrapper.emitted('open-change')?.[0]?.[0]).toBe(true);
    expect(wrapper.emitted('update:open')?.[0]?.[0]).toBe(true);
  });

  it('aplica width=full com base na largura do trigger', async () => {
    const wrapper = mount(StDropdown, {
      props: { width: 'full' },
      slots: {
        trigger: () => 'Abrir',
        default: () => h('div', { 'data-testid': 'panel' }, 'Panel')
      }
    });

    const trigger = wrapper.find('button').element as HTMLButtonElement;
    Object.defineProperty(trigger, 'getBoundingClientRect', {
      configurable: true,
      value: () =>
        ({
          width: 123,
          height: 10,
          top: 10,
          left: 10,
          bottom: 20,
          right: 30
        }) as DOMRect
    });

    await wrapper.find('button').trigger('click');
    await nextTick();
    await nextTick();

    const dialog = wrapper.find('dialog').element as HTMLDialogElement;

    expect(dialog.style.width).toBe('123px');
  });

  it('não aplica w-auto por padrão no painel', async () => {
    const wrapper = mount(StDropdown, {
      slots: {
        trigger: () => 'Abrir',
        default: () => h('div', { 'data-testid': 'panel' }, 'Panel')
      }
    });

    await wrapper.find('button').trigger('click');
    await nextTick();
    await nextTick();

    expect(wrapper.find('dialog').classes()).not.toContain('w-auto');
  });

  it('expõe triggerAsChild com slot props para alternar o painel', async () => {
    const wrapper = mount(StDropdown, {
      props: { triggerAsChild: true },
      slots: {
        trigger: ({ open, toggle, setTriggerEl, attrs }) =>
          h(
            'span',
            {
              ref: setTriggerEl,
              role: 'button',
              tabindex: 0,
              ...attrs,
              onClick: toggle
            },
            open ? 'Fechar' : 'Abrir'
          ),
        default: () => h('div', { 'data-testid': 'panel' }, 'Panel')
      }
    });

    const trigger = wrapper.find('[role="button"]');

    expect(trigger.attributes('aria-expanded')).toBe('false');

    await trigger.trigger('click');
    await nextTick();
    await nextTick();

    expect(wrapper.find('[data-testid="panel"]').exists()).toBe(true);
    expect(trigger.attributes('aria-expanded')).toBe('true');
  });
});
