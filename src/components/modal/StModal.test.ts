import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import StModal from './StModal.vue';

describe('StModal', () => {
  it('não renderiza quando open=false', () => {
    const wrapper = mount(StModal, {
      global: { stubs: { teleport: true } }
    });

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
  });

  it('renderiza quando open=true e aceita slot', () => {
    const wrapper = mount(StModal, {
      props: {
        open: true,
        variant: 'surface-2',
        elevation: 4,
        className: 'modal-custom'
      },
      slots: {
        default: '<div data-test="slot">Conteudo</div>'
      },
      global: { stubs: { teleport: true } }
    });

    const dialog = wrapper.find('[role="dialog"]');

    expect(dialog.exists()).toBe(true);
    expect(dialog.attributes('aria-modal')).toBe('true');
    expect(dialog.classes()).toContain('bg-st-surface-2');
    expect(dialog.classes()).toContain('shadow-st-paper-4');
    expect(dialog.classes()).toContain('modal-custom');
    expect(wrapper.find('[data-test="slot"]').text()).toBe('Conteudo');
  });

  it('encaminha attrs para o dialog', () => {
    const wrapper = mount(StModal, {
      props: { open: true },
      attrs: {
        id: 'modal-principal',
        'aria-labelledby': 'titulo-modal'
      },
      global: { stubs: { teleport: true } }
    });

    const dialog = wrapper.find('[role="dialog"]');

    expect(dialog.attributes('id')).toBe('modal-principal');
    expect(dialog.attributes('aria-labelledby')).toBe('titulo-modal');
  });

  it('renderiza botão de fechar e emite update:open', async () => {
    const wrapper = mount(StModal, {
      props: { open: true, showCloseButton: true },
      global: { stubs: { teleport: true } }
    });

    await wrapper.find('button[aria-label="Fechar modal"]').trigger('click');

    expect(wrapper.emitted('update:open')?.[0]).toEqual([false]);
    expect(wrapper.emitted('close')?.length).toBe(1);
  });

  it('fecha ao clicar fora quando closeOnOutsideClick=true', async () => {
    const wrapper = mount(StModal, {
      props: { open: true, closeOnOutsideClick: true },
      global: { stubs: { teleport: true } }
    });

    await wrapper.find('[data-test="modal-overlay"]').trigger('click');

    expect(wrapper.emitted('update:open')?.[0]).toEqual([false]);
    expect(wrapper.emitted('close')?.length).toBe(1);
  });

  it('não fecha ao clicar fora quando closeOnOutsideClick=false', async () => {
    const wrapper = mount(StModal, {
      props: { open: true },
      global: { stubs: { teleport: true } }
    });

    await wrapper.find('[data-test="modal-overlay"]').trigger('click');

    expect(wrapper.emitted('update:open')).toBeUndefined();
  });

  it('fecha ao pressionar Escape', () => {
    const wrapper = mount(StModal, {
      props: { open: true },
      global: { stubs: { teleport: true } }
    });

    globalThis.window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape' })
    );

    expect(wrapper.emitted('update:open')?.[0]).toEqual([false]);
    expect(wrapper.emitted('close')?.length).toBe(1);
  });
});
