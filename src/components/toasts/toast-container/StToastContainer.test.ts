import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import StToastContainer from './StToastContainer.vue';
import {
  buildToastContainerClasses,
  isBottomPosition
} from './styleStToastContainer';
import {
  dismissAllToasts,
  stToastConfig,
  ST_TOAST_DEFAULT_DURATION,
  ST_TOAST_DEFAULT_MAX,
  useToast
} from '../../../composables/useToast';

const toast = useToast();

// `to: false` desliga o Teleport para o wrapper enxergar a arvore nos testes.
const mountContainer = (props: Record<string, unknown> = {}) =>
  mount(StToastContainer, { props: { to: false, ...props } });

const items = (wrapper: ReturnType<typeof mountContainer>) =>
  wrapper.findAll('[data-st-toast-status]');

beforeEach(() => {
  vi.useFakeTimers();
  dismissAllToasts();
  stToastConfig.duration = ST_TOAST_DEFAULT_DURATION;
  stToastConfig.max = ST_TOAST_DEFAULT_MAX;
});

afterEach(() => {
  dismissAllToasts();
  vi.useRealTimers();
});

describe('styleStToastContainer', () => {
  it('identifica as posicoes de baixo', () => {
    expect(isBottomPosition('bottom-left')).toBe(true);
    expect(isBottomPosition('bottom-center')).toBe(true);
    expect(isBottomPosition('bottom-right')).toBe(true);
    expect(isBottomPosition('top-right')).toBe(false);
  });

  it('empilha ao contrario nas posicoes de baixo', () => {
    expect(
      buildToastContainerClasses({ position: 'top-right' }).container
    ).toContain('flex-col');
    expect(
      buildToastContainerClasses({ position: 'bottom-right' }).container
    ).toContain('flex-col-reverse');
  });

  it('ancora em cada canto da tela', () => {
    const posicoes = [
      ['top-left', 'top-st-2'],
      ['top-center', 'left-1/2'],
      ['top-right', 'right-st-2'],
      ['bottom-left', 'bottom-st-2'],
      ['bottom-center', 'left-1/2'],
      ['bottom-right', 'bottom-st-2']
    ] as const;

    posicoes.forEach(([position, expected]) => {
      expect(buildToastContainerClasses({ position }).container).toContain(
        expected
      );
    });
  });

  it('deixa a pagina clicavel ao redor da pilha', () => {
    const classes = buildToastContainerClasses({});

    expect(classes.container).toContain('pointer-events-none');
    expect(classes.item).toContain('pointer-events-auto');
  });
});

describe('StToastContainer', () => {
  it('comeca sem toasts na tela', () => {
    expect(items(mountContainer())).toHaveLength(0);
  });

  it('renderiza os toasts disparados pelo composable', async () => {
    const wrapper = mountContainer();

    toast.positive({ title: 'Aposta registrada', description: 'Bilhete 4821' });
    await wrapper.vm.$nextTick();

    expect(items(wrapper)).toHaveLength(1);
    expect(wrapper.text()).toContain('Aposta registrada');
    expect(wrapper.text()).toContain('Bilhete 4821');
    expect(items(wrapper)[0].attributes('data-st-toast-status')).toBe(
      'positive'
    );
  });

  it('mantem a ordem da fila', async () => {
    const wrapper = mountContainer();

    toast.info('Primeiro');
    toast.negative('Segundo');
    await wrapper.vm.$nextTick();

    expect(
      items(wrapper).map((item) => item.attributes('data-st-toast-status'))
    ).toEqual(['info', 'negative']);
  });

  it('remove o toast no clique do botao de fechar', async () => {
    const wrapper = mountContainer();

    toast.info('Some no clique');
    await wrapper.vm.$nextTick();

    await wrapper.find('[data-st-toast-close]').trigger('click');

    expect(items(wrapper)).toHaveLength(0);
    expect(toast.toasts.value).toHaveLength(0);
  });

  it('some da tela quando a duracao acaba', async () => {
    const wrapper = mountContainer();

    toast.info({ title: 'Temporario', duration: 1000 });
    await wrapper.vm.$nextTick();
    expect(items(wrapper)).toHaveLength(1);

    vi.advanceTimersByTime(1000);
    await wrapper.vm.$nextTick();

    expect(items(wrapper)).toHaveLength(0);
  });

  it('congela a contagem enquanto o ponteiro esta sobre a pilha', async () => {
    const wrapper = mountContainer();

    toast.info({ title: 'Pausado', duration: 1000 });
    await wrapper.vm.$nextTick();

    await wrapper.find('[data-st-toast-container]').trigger('mouseenter');
    vi.advanceTimersByTime(5000);
    await wrapper.vm.$nextTick();

    expect(items(wrapper)).toHaveLength(1);

    await wrapper.find('[data-st-toast-container]').trigger('mouseleave');
    vi.advanceTimersByTime(1000);
    await wrapper.vm.$nextTick();

    expect(items(wrapper)).toHaveLength(0);
  });

  it('nao congela quando pauseOnHover e false', async () => {
    const wrapper = mountContainer({ pauseOnHover: false });

    toast.info({ title: 'Segue contando', duration: 1000 });
    await wrapper.vm.$nextTick();

    await wrapper.find('[data-st-toast-container]').trigger('mouseenter');
    vi.advanceTimersByTime(1000);
    await wrapper.vm.$nextTick();

    expect(items(wrapper)).toHaveLength(0);
  });

  it('aplica posicao, gap e className', () => {
    const wrapper = mountContainer({
      position: 'bottom-center',
      gap: 3,
      className: 'pilha-x'
    });
    const container = wrapper.find('[data-st-toast-container]');

    expect(container.classes()).toContain('flex-col-reverse');
    expect(container.classes()).toContain('bottom-st-2');
    expect(container.classes()).toContain('gap-st-3');
    expect(container.classes()).toContain('pilha-x');
  });

  it('expoe a regiao de avisos', () => {
    const wrapper = mountContainer({ ariaLabel: 'Feedback da aposta' });
    const container = wrapper.find('[data-st-toast-container]');

    expect(container.attributes('role')).toBe('region');
    expect(container.attributes('aria-label')).toBe('Feedback da aposta');
  });
});
