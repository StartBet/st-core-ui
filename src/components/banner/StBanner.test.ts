import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import StBanner from './StBanner.vue';
import {
  buildBannerClasses,
  resolveBannerActionColor,
  resolveBannerRole
} from './styleStBanner';

const mountBanner = (props: Record<string, unknown> = {}, options = {}) =>
  mount(StBanner, {
    props: { text: 'Bonus liberado', ...props },
    ...options
  });

const find = (wrapper: ReturnType<typeof mountBanner>, part: string) =>
  wrapper.find(`[data-st-banner-${part}]`);

describe('styleStBanner', () => {
  it('e uma pill que cresce na horizontal com a frase', () => {
    const { container, text } = buildBannerClasses({});

    expect(container).toContain('rounded-full');
    expect(container).toContain('w-fit');
    expect(container).toContain('max-w-full');
    expect(text).toContain('truncate');
  });

  it('inverte superficie e conteudo nos sete status, sem borda', () => {
    const statuses = [
      'info',
      'system',
      'warning',
      'positive',
      'negative',
      'primary',
      'secondary'
    ] as const;

    statuses.forEach((status) => {
      const classes = buildBannerClasses({ status });

      expect(classes.container).toContain(`bg-st-content-${status}`);
      expect(classes.container).not.toContain('border');
      expect(classes.text).toContain(`text-st-surface-${status}`);
      expect(classes.icon).toContain(`bg-st-surface-${status}`);
      expect(classes.icon).toContain(`text-st-content-${status}`);
      expect(classes.icon).toContain('rounded-full');
    });
  });

  it('encolhe o padding do lado que termina em icone, botao ou fechar', () => {
    expect(buildBannerClasses({}).container).toContain('pl-st-2');
    expect(buildBannerClasses({}).container).toContain('pr-st-2');
    expect(buildBannerClasses({ hasIcon: true }).container).toContain(
      'pl-[6px]'
    );
    expect(buildBannerClasses({ hasAction: true }).container).toContain(
      'pr-[6px]'
    );
    expect(buildBannerClasses({ closable: true }).container).toContain(
      'pr-[6px]'
    );
  });

  it('resolve cor da acao e papel por status', () => {
    expect(resolveBannerActionColor('secondary')).toBe('secondary');
    expect(resolveBannerActionColor('negative')).toBe('negative');
    expect(resolveBannerActionColor('info')).toBe('primary');

    expect(resolveBannerRole('warning')).toBe('alert');
    expect(resolveBannerRole('primary')).toBe('status');
  });
});

describe('StBanner', () => {
  it('renderiza a frase sem icone, acao nem fechar por padrao', () => {
    const wrapper = mountBanner();

    expect(find(wrapper, 'text').text()).toBe('Bonus liberado');
    expect(find(wrapper, 'text').attributes('title')).toBe('Bonus liberado');
    expect(find(wrapper, 'icon').exists()).toBe(false);
    expect(find(wrapper, 'action').exists()).toBe(false);
    expect(find(wrapper, 'close').exists()).toBe(false);
    expect(wrapper.attributes('role')).toBe('status');
  });

  it('usa o slot padrao no lugar da prop text', () => {
    const wrapper = mountBanner({}, { slots: { default: '<b>Livre</b>' } });

    expect(find(wrapper, 'text').find('b').text()).toBe('Livre');
  });

  it('mostra o icone escolhido', () => {
    const wrapper = mountBanner({ icon: 'xmark' });

    expect(find(wrapper, 'icon').exists()).toBe(true);
  });

  it('renderiza o StButton de acao e emite action no clique', async () => {
    const wrapper = mountBanner({
      status: 'secondary',
      actionLabel: 'Ver jogo'
    });
    const action = find(wrapper, 'action');

    expect(action.text()).toBe('Ver jogo');
    expect(action.classes()).toContain('!rounded-full');
    expect(action.classes()).toContain('bg-st-secondary');

    await action.trigger('click');

    expect(wrapper.emitted('action')).toHaveLength(1);
  });

  it('prioriza o slot action sobre actionLabel', () => {
    const wrapper = mountBanner(
      { actionLabel: 'Ignorado' },
      { slots: { action: '<button class="custom">Custom</button>' } }
    );

    expect(wrapper.find('.custom').exists()).toBe(true);
    expect(find(wrapper, 'action').exists()).toBe(false);
  });

  it('some sozinho ao fechar quando nao e controlado', async () => {
    const wrapper = mountBanner({ closable: true });

    expect(find(wrapper, 'close').attributes('aria-label')).toBe(
      'Fechar banner'
    );

    await find(wrapper, 'close').trigger('click');

    expect(wrapper.emitted('close')).toHaveLength(1);
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false]);
    expect(wrapper.find('[data-st-banner-status]').exists()).toBe(false);
  });

  it('segue o open controlado', async () => {
    const wrapper = mountBanner({ closable: true, open: false });

    expect(wrapper.find('[data-st-banner-status]').exists()).toBe(false);

    await wrapper.setProps({ open: true });

    expect(wrapper.find('[data-st-banner-status]').exists()).toBe(true);
  });

  it('repassa atributos e classes para o container', () => {
    const wrapper = mountBanner(
      { className: 'mb-st-2' },
      { attrs: { id: 'banner', class: 'extra' } }
    );

    expect(wrapper.attributes('id')).toBe('banner');
    expect(wrapper.classes()).toContain('mb-st-2');
    expect(wrapper.classes()).toContain('extra');
  });
});
