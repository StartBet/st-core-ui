import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import StToast from './StToast.vue';
import {
  buildToastClasses,
  resolveToastIcon,
  resolveToastRole
} from './styleStToast';

const mountToast = (props: Record<string, unknown> = {}, options = {}) =>
  mount(StToast, {
    props: { title: 'Aposta registrada', ...props },
    ...options
  });

const close = (wrapper: ReturnType<typeof mountToast>) =>
  wrapper.find('[data-st-toast-close]');

describe('styleStToast', () => {
  it('tem largura fixa de st-48 e altura livre', () => {
    const { container } = buildToastClasses({});

    expect(container).toContain('w-st-48');
    expect(container).toContain('max-w-full');
    expect(container).not.toMatch(/\bh-/);
  });

  it('centraliza icone e fechar na primeira linha do titulo', () => {
    // icone de 16px na linha de 28px do titulo -> (28 - 16) / 2
    const { icon, close } = buildToastClasses({});

    expect(icon).toContain('mt-[6px]');
    expect(close).toContain('mt-[6px]');
  });

  it('aplica a superficie, o acento e o conteudo de cada status', () => {
    const statuses = [
      [
        'info',
        'bg-st-surface-info',
        'border-l-st-content-info',
        'text-st-content-info'
      ],
      [
        'system',
        'bg-st-surface-system',
        'border-l-st-content-system',
        'text-st-content-system'
      ],
      [
        'warning',
        'bg-st-surface-warning',
        'border-l-st-content-warning',
        'text-st-content-warning'
      ],
      [
        'positive',
        'bg-st-surface-positive',
        'border-l-st-content-positive',
        'text-st-content-positive'
      ],
      [
        'negative',
        'bg-st-surface-negative',
        'border-l-st-content-negative',
        'text-st-content-negative'
      ]
    ] as const;

    statuses.forEach(([status, surface, accent, content]) => {
      const classes = buildToastClasses({ status });

      expect(classes.container).toContain(surface);
      expect(classes.container).toContain(accent);
      expect(classes.title).toContain(content);
    });
  });

  it('resolve o icone padrao de cada status', () => {
    expect(resolveToastIcon()).toBe('circle-info');
    expect(resolveToastIcon('info')).toBe('circle-info');
    expect(resolveToastIcon('system')).toBe('gear');
    expect(resolveToastIcon('warning')).toBe('triangle-exclamation');
    expect(resolveToastIcon('positive')).toBe('circle-check');
    expect(resolveToastIcon('negative')).toBe('circle-xmark');
  });

  it('interrompe a leitura apenas em erro e aviso', () => {
    expect(resolveToastRole('negative')).toEqual({
      role: 'alert',
      ariaLive: 'assertive'
    });
    expect(resolveToastRole('warning')).toEqual({
      role: 'alert',
      ariaLive: 'assertive'
    });
    expect(resolveToastRole('info')).toEqual({
      role: 'status',
      ariaLive: 'polite'
    });
    expect(resolveToastRole('positive')).toEqual({
      role: 'status',
      ariaLive: 'polite'
    });
    expect(resolveToastRole('system')).toEqual({
      role: 'status',
      ariaLive: 'polite'
    });
  });
});

describe('StToast', () => {
  it('renderiza titulo com status info por padrao', () => {
    const wrapper = mountToast();

    expect(wrapper.text()).toContain('Aposta registrada');
    expect(wrapper.attributes('data-st-toast-status')).toBe('info');
    expect(wrapper.classes()).toContain('bg-st-surface-info');
    expect(wrapper.classes()).toContain('w-st-48');
  });

  it('renderiza a descricao apenas quando informada', () => {
    expect(mountToast().find('[data-st-toast-description]').exists()).toBe(
      false
    );

    const comDescricao = mountToast({ description: 'Bilhete 4821' });

    expect(comDescricao.find('[data-st-toast-description]').text()).toBe(
      'Bilhete 4821'
    );
  });

  it('aplica o status recebido', () => {
    const wrapper = mountToast({ status: 'negative' });

    expect(wrapper.attributes('data-st-toast-status')).toBe('negative');
    expect(wrapper.classes()).toContain('bg-st-surface-negative');
    expect(wrapper.attributes('role')).toBe('alert');
    expect(wrapper.attributes('aria-live')).toBe('assertive');
  });

  it('usa role status e aria-live polite nos demais', () => {
    const wrapper = mountToast({ status: 'positive' });

    expect(wrapper.attributes('role')).toBe('status');
    expect(wrapper.attributes('aria-live')).toBe('polite');
  });

  it('mostra o icone do status e permite sobrescrever', () => {
    expect(mountToast().find('[data-st-toast-icon]').exists()).toBe(true);
    expect(
      mountToast({ hideIcon: true }).find('[data-st-toast-icon]').exists()
    ).toBe(false);
    expect(
      mountToast({ icon: 'xmark' }).find('[data-st-toast-icon]').exists()
    ).toBe(true);
  });

  it('emite close no botao de fechar', async () => {
    const wrapper = mountToast();

    await close(wrapper).trigger('click');

    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('esconde o botao de fechar com closable false', () => {
    expect(close(mountToast({ closable: false })).exists()).toBe(false);
  });

  it('rotula o botao de fechar', () => {
    expect(close(mountToast()).attributes('aria-label')).toBe('Fechar aviso');
    expect(
      close(mountToast({ closeAriaLabel: 'Dispensar' })).attributes(
        'aria-label'
      )
    ).toBe('Dispensar');
  });

  it('renderiza os slots default e action', () => {
    const wrapper = mountToast(
      {},
      {
        slots: {
          default: '<span class="extra">extra</span>',
          action: '<button class="acao">Ver bilhete</button>'
        }
      }
    );

    expect(wrapper.find('.extra').exists()).toBe(true);
    expect(wrapper.find('.acao').exists()).toBe(true);
  });

  it('anexa className e encaminha class, style e demais attrs', () => {
    const wrapper = mountToast(
      { className: 'custom-x' },
      { attrs: { class: 'attr-x', style: 'opacity: 0.5', 'data-id': 'abc' } }
    );

    expect(wrapper.classes()).toContain('custom-x');
    expect(wrapper.classes()).toContain('attr-x');
    expect(wrapper.attributes('style')).toContain('opacity: 0.5');
    expect(wrapper.attributes('data-id')).toBe('abc');
  });
});
