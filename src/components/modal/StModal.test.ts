import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import StModal from './StModal.vue';

const getCloseButton = () =>
  document.body.querySelector(
    'button[aria-label="Fechar modal"]'
  ) as HTMLButtonElement | null;

const getElementByTestId = (value: string) =>
  document.body.querySelector(`[data-test="${value}"]`) as HTMLElement | null;

describe('StModal', () => {
  it('foca o primeiro elemento ao abrir e restaura o foco ao fechar', async () => {
    const trigger = document.createElement('button');
    trigger.textContent = 'Abrir';
    document.body.appendChild(trigger);
    trigger.focus();

    const wrapper = mount(StModal, {
      props: { open: true, showCloseButton: true },
      attachTo: document.body
    });

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(document.activeElement).toBe(getCloseButton());
    expect(document.body.style.overflow).toBe('hidden');

    await wrapper.setProps({ open: false });
    await wrapper.vm.$nextTick();

    expect(document.activeElement).toBe(trigger);
    expect(document.body.style.overflow).toBe('');

    wrapper.unmount();
    trigger.remove();
  });

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

    const closeButton = wrapper.find('button[aria-label="Fechar modal"]');

    expect(closeButton.exists()).toBe(true);
    expect(closeButton.find('svg').exists()).toBe(true);

    await closeButton.trigger('click');

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

  it('fecha ao pressionar Escape', async () => {
    const wrapper = mount(StModal, {
      props: { open: true },
      global: { stubs: { teleport: true } }
    });

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    globalThis.window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape' })
    );

    expect(wrapper.emitted('update:open')?.[0]).toEqual([false]);
    expect(wrapper.emitted('close')?.length).toBe(1);
  });

  it('mantém o foco dentro do modal com Tab e Shift+Tab', async () => {
    const wrapper = mount(StModal, {
      props: { open: true, showCloseButton: true },
      slots: {
        default:
          '<button type="button" data-test="first-action">Primeiro</button><button type="button" data-test="last-action">Ultimo</button>'
      },
      attachTo: document.body
    });

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    const closeButton = getCloseButton() as HTMLButtonElement;
    const lastAction = getElementByTestId('last-action') as HTMLButtonElement;

    closeButton.focus();
    globalThis.window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true })
    );
    expect(document.activeElement).toBe(lastAction);

    lastAction.focus();
    globalThis.window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab' })
    );
    expect(document.activeElement).toBe(closeButton);

    wrapper.unmount();
  });
});
