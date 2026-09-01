import { mount, type DOMWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import StCarousel from './StCarousel.vue';
import {
  gapToPixels,
  normalizeSlidePerPage,
  peekToPixels,
  resolveActivePage,
  resolveDragStep,
  resolvePagePositions,
  resolveCenterOffset,
  resolveMaxPosition,
  resolveVisibleIndexes
} from './styleStCarousel';

const slides = (amount: number) =>
  Array.from(
    { length: amount },
    (_, index) => `<div data-testid="slide">Item ${index + 1}</div>`
  ).join('');

const mountCarousel = (props: Record<string, unknown> = {}, amount = 6) =>
  mount(StCarousel, {
    props,
    slots: { default: slides(amount) }
  });

const viewportClass = (wrapper: ReturnType<typeof mountCarousel>) =>
  (
    wrapper.find('[data-st-carousel-position]').element
      .parentElement as HTMLElement
  ).className;

const slideProgress = (slide: {
  attributes: (key: string) => string | undefined;
}) =>
  slide
    .attributes('style')
    ?.match(/--st-carousel-slide-progress:\s*([\d.]+)/)?.[1];

describe('styleStCarousel', () => {
  it('converte o token de gap em pixels', () => {
    expect(gapToPixels(1)).toBe('8px');
    expect(gapToPixels('3')).toBe('24px');
    expect(gapToPixels(0)).toBe('0px');
  });

  it('normaliza slidePerPage dentro dos limites', () => {
    expect(normalizeSlidePerPage(0, 5)).toBe(1);
    expect(normalizeSlidePerPage(3, 5)).toBe(3);
    expect(normalizeSlidePerPage(9, 5)).toBe(5);
  });

  it('resolve as posicoes de pagina sem loop garantindo a ultima pagina', () => {
    expect(resolvePagePositions(5, 2, false)).toEqual([0, 2, 3]);
    expect(resolvePagePositions(6, 2, false)).toEqual([0, 2, 4]);
    expect(resolvePagePositions(3, 3, false)).toEqual([0]);
  });

  it('resolve as posicoes de pagina com loop sem recorte final', () => {
    expect(resolvePagePositions(5, 2, true)).toEqual([0, 2, 4]);
  });

  it('resolve a pagina mais proxima da posicao atual', () => {
    expect(resolveActivePage(0, [0, 2, 4])).toBe(0);
    expect(resolveActivePage(3, [0, 2, 4])).toBe(1);
    expect(resolveActivePage(4, [0, 2, 4])).toBe(2);
  });

  it('converte o arraste em slides limitando ao slidePerPage', () => {
    expect(resolveDragStep(0.1, 3)).toBe(0);
    expect(resolveDragStep(0.4, 3)).toBe(1);
    expect(resolveDragStep(2.6, 3)).toBe(3);
    expect(resolveDragStep(5, 3)).toBe(3);
    expect(resolveDragStep(4, 1)).toBe(1);
    expect(resolveDragStep(-0.8, 3)).toBe(-1);
  });

  it('resolve os indices visiveis com e sem loop', () => {
    expect(resolveVisibleIndexes(4, 5, 3, false)).toEqual([4]);
    expect(resolveVisibleIndexes(4, 5, 3, true)).toEqual([4, 0, 1]);
  });
});

describe('StCarousel', () => {
  it('renderiza um slide-item livre para cada filho do slot', () => {
    const wrapper = mountCarousel({ slidePerPage: 3 }, 4);

    expect(wrapper.findAll('[data-st-slide-index]')).toHaveLength(4);
    expect(wrapper.findAll('[data-testid="slide"]')).toHaveLength(4);
    expect(wrapper.attributes('aria-roledescription')).toBe('carousel');
  });

  it('aplica gap e slidePerPage via variaveis de estilo', () => {
    const wrapper = mountCarousel({ slidePerPage: 3, gap: 3 });
    const track = wrapper.find('[data-st-carousel-position]');

    expect(track.attributes('data-st-carousel-gap')).toBe('24px');
    expect(wrapper.attributes('data-st-carousel-per-page')).toBe('3');
  });

  it('navega por pagina pelas setas', async () => {
    const wrapper = mountCarousel({ slidePerPage: 2 }, 6);
    const [prev, next] = wrapper.findAll('button');

    expect(prev.attributes('disabled')).toBeDefined();

    await next.trigger('click');

    expect(wrapper.attributes('data-st-carousel-index')).toBe('2');
    expect(wrapper.emitted('change')?.slice(-1)[0]).toEqual([2]);

    await next.trigger('click');
    await next.trigger('click');

    expect(wrapper.attributes('data-st-carousel-index')).toBe('4');
    expect(next.attributes('disabled')).toBeDefined();
  });

  it('renderiza clones nas pontas quando o loop esta habilitado', () => {
    const wrapper = mountCarousel({ slidePerPage: 2, infiniteLoop: true }, 5);

    expect(wrapper.findAll('[data-st-slide-clone]')).toHaveLength(4);
    expect(wrapper.findAll('[data-st-slide-index]')).toHaveLength(9);
  });

  it('permite voltar do primeiro slide quando o loop esta habilitado', async () => {
    const wrapper = mountCarousel({ slidePerPage: 2, infiniteLoop: true }, 5);
    const [prev] = wrapper.findAll('button');

    expect(prev.attributes('disabled')).toBeUndefined();

    await prev.trigger('click');

    expect(
      wrapper
        .find('[data-st-carousel-position]')
        .attributes('data-st-carousel-position')
    ).toBe('-2');
  });

  it('nao habilita navegacao quando todos os slides cabem na pagina', () => {
    const wrapper = mountCarousel({ slidePerPage: 3 }, 3);
    const buttons = wrapper.findAll('button');

    expect(
      buttons.every((button) => button.attributes('disabled') !== undefined)
    ).toBe(true);
    expect(wrapper.find('[data-st-bullet-active]').exists()).toBe(false);
  });

  it('renderiza bullets externos por pagina e navega ao clicar', async () => {
    const wrapper = mountCarousel({ slidePerPage: 2 }, 6);
    const bullets = wrapper.findAll('[data-st-bullet-active]');

    expect(bullets).toHaveLength(3);

    await bullets[2].trigger('click');

    expect(wrapper.attributes('data-st-carousel-index')).toBe('4');
    expect(wrapper.emitted('page-change')?.slice(-1)[0]).toEqual([2]);
  });

  it('omite setas e bullets quando a navegacao e none', () => {
    const wrapper = mountCarousel({ arrows: 'none', bullets: 'none' });

    expect(wrapper.findAll('button')).toHaveLength(0);
  });

  it('posiciona setas internas com classes absolutas', () => {
    const wrapper = mountCarousel({ arrows: 'inside' });
    const [prev] = wrapper.findAll('button');

    expect(prev.attributes('class')).toContain('absolute');
  });

  it('destaca somente o slide de referencia quando highlight esta ativo', () => {
    const withoutHighlight = mountCarousel({ slidePerPage: 3 }, 6);
    const withHighlight = mountCarousel(
      { slidePerPage: 3, highlight: true },
      6
    );
    const slides = withHighlight.findAll('[data-st-slide-index]');

    expect(
      withoutHighlight.find('[data-st-slide-index]').attributes('style')
    ).toBeUndefined();
    expect(withHighlight.find('.cursor-grab').exists()).toBe(false);

    expect(slideProgress(slides[0])).toBe('0');
    expect(slides[0].attributes('data-st-slide-selected')).toBe('true');

    for (const index of [1, 2]) {
      expect(slideProgress(slides[index])).toBe('1');
      expect(slides[index].attributes('data-st-slide-active')).toBe('true');
      expect(
        slides[index].attributes('data-st-slide-selected')
      ).toBeUndefined();
    }

    expect(slides[3].attributes('data-st-slide-active')).toBeUndefined();
  });

  it('move o destaque junto com a navegacao', async () => {
    const wrapper = mountCarousel({ slidePerPage: 3, highlight: true }, 6);
    const [, next] = wrapper.findAll('button');

    await next.trigger('click');

    const slides = wrapper.findAll('[data-st-slide-index]');

    expect(slides[0].attributes('data-st-slide-selected')).toBeUndefined();
    expect(slides[3].attributes('data-st-slide-selected')).toBe('true');
    expect(slideProgress(slides[3])).toBe('0');
  });

  it('sincroniza o v-model de indice', async () => {
    const wrapper = mountCarousel({ slidePerPage: 2, modelValue: 0 }, 6);

    await wrapper.setProps({ modelValue: 4 });

    expect(wrapper.attributes('data-st-carousel-index')).toBe('4');
  });

  it('expoe a api imperativa de navegacao', async () => {
    const wrapper = mountCarousel({ slidePerPage: 2 }, 6);
    const carousel = wrapper.vm as unknown as {
      next: () => void;
      goToPage: (page: number) => void;
      pageCount: number;
    };

    expect(carousel.pageCount).toBe(3);

    carousel.next();
    await wrapper.vm.$nextTick();

    expect(wrapper.attributes('data-st-carousel-index')).toBe('2');

    carousel.goToPage(0);
    await wrapper.vm.$nextTick();

    expect(wrapper.attributes('data-st-carousel-index')).toBe('0');
  });
});

describe('StCarousel autoplay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('avanca automaticamente no intervalo informado', async () => {
    const wrapper = mountCarousel(
      { slidePerPage: 2, autoplay: true, autoplayTimeout: 1000 },
      6
    );

    expect(wrapper.attributes('data-st-carousel-index')).toBe('0');

    vi.advanceTimersByTime(1000);
    await wrapper.vm.$nextTick();

    expect(wrapper.attributes('data-st-carousel-index')).toBe('2');
  });

  it('pausa o autoplay com hover quando autoplayHoverPause esta ativo', async () => {
    const wrapper = mountCarousel(
      {
        slidePerPage: 2,
        autoplay: true,
        autoplayTimeout: 1000,
        autoplayHoverPause: true
      },
      6
    );

    await wrapper.trigger('mouseenter');

    vi.advanceTimersByTime(3000);
    await wrapper.vm.$nextTick();

    expect(wrapper.attributes('data-st-carousel-index')).toBe('0');

    await wrapper.trigger('mouseleave');

    vi.advanceTimersByTime(1000);
    await wrapper.vm.$nextTick();

    expect(wrapper.attributes('data-st-carousel-index')).toBe('2');
  });

  it('mantem o autoplay durante o hover quando a pausa esta desligada', async () => {
    const wrapper = mountCarousel(
      {
        slidePerPage: 2,
        autoplay: true,
        autoplayTimeout: 1000,
        autoplayHoverPause: false
      },
      6
    );

    await wrapper.trigger('mouseenter');

    vi.advanceTimersByTime(1000);
    await wrapper.vm.$nextTick();

    expect(wrapper.attributes('data-st-carousel-index')).toBe('2');
  });
});

describe('StCarousel grab', () => {
  const SLIDE_WIDTH = 100;

  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get: () => SLIDE_WIDTH
    });
  });

  afterEach(() => {
    Reflect.deleteProperty(HTMLElement.prototype, 'offsetWidth');
    vi.restoreAllMocks();
  });

  const dragBy = async (
    wrapper: ReturnType<typeof mountCarousel>,
    pixels: number
  ) => {
    const viewport = wrapper.find('[data-st-carousel-position]').element
      .parentElement as HTMLElement;
    const target = wrapper
      .findAll('div')
      .find((node) => node.element === viewport);

    await target?.trigger('pointerdown', { button: 0, clientX: 0, clientY: 0 });
    await target?.trigger('pointermove', {
      button: 0,
      clientX: pixels,
      clientY: 0
    });
    await target?.trigger('pointerup', { button: 0, clientX: pixels });
  };

  it('arrasta proporcionalmente ate o limite de slidePerPage', async () => {
    const wrapper = mountCarousel({ slidePerPage: 3, grab: true, gap: 0 }, 9);

    await dragBy(wrapper, -SLIDE_WIDTH * 3);

    expect(wrapper.attributes('data-st-carousel-index')).toBe('3');
  });

  it('ignora arrastes menores que o limite minimo', async () => {
    const wrapper = mountCarousel({ slidePerPage: 3, grab: true, gap: 0 }, 9);

    await dragBy(wrapper, -SLIDE_WIDTH * 0.1);

    expect(wrapper.attributes('data-st-carousel-index')).toBe('0');
  });

  it('anda sempre um slide quando ha uma coluna por pagina', async () => {
    const wrapper = mountCarousel({ slidePerPage: 1, grab: true, gap: 0 }, 6);

    await dragBy(wrapper, -SLIDE_WIDTH * 3);

    expect(wrapper.attributes('data-st-carousel-index')).toBe('1');
  });

  it('interpola a escala acompanhando o arraste', async () => {
    const wrapper = mountCarousel(
      { slidePerPage: 2, grab: true, highlight: true, gap: 0 },
      6
    );
    const viewport = wrapper.find('[data-st-carousel-position]').element
      .parentElement as HTMLElement;
    const target = wrapper
      .findAll('div')
      .find((node) => node.element === viewport);
    const slideAt = (index: number) =>
      wrapper.findAll('[data-st-slide-index]')[index];

    expect(slideProgress(slideAt(0))).toBe('0');
    expect(slideProgress(slideAt(1))).toBe('1');

    await target?.trigger('pointerdown', { button: 0, clientX: 300 });
    /** Meio slide arrastado: os dois ficam a meio caminho da escala. */
    await target?.trigger('pointermove', {
      button: 0,
      clientX: 300 - SLIDE_WIDTH / 2
    });

    expect(slideProgress(slideAt(0))).toBe('0.5');
    expect(slideProgress(slideAt(1))).toBe('0.5');
    expect(slideAt(0).attributes('style')).toContain(
      'transition-duration: 0ms'
    );

    /** Um quarto de slide: a referencia ainda domina. */
    await target?.trigger('pointermove', {
      button: 0,
      clientX: 300 - SLIDE_WIDTH / 4
    });

    expect(slideProgress(slideAt(0))).toBe('0.25');
    expect(slideProgress(slideAt(1))).toBe('0.75');

    await target?.trigger('pointerup', {
      button: 0,
      clientX: 300 - SLIDE_WIDTH / 4
    });

    expect(slideAt(0).attributes('style')).not.toContain(
      'transition-duration: 0ms'
    );
  });

  it('nao habilita o arraste quando grab esta desligado', async () => {
    const wrapper = mountCarousel({ slidePerPage: 3, gap: 0 }, 9);

    await dragBy(wrapper, -SLIDE_WIDTH * 3);

    expect(wrapper.attributes('data-st-carousel-index')).toBe('0');
  });
});

describe('StCarousel loop', () => {
  it('normaliza a posicao sem animacao ao terminar a transicao', async () => {
    const wrapper = mountCarousel({ slidePerPage: 2, infiniteLoop: true }, 5);
    const [prev] = wrapper.findAll('button');
    const track = wrapper.find('[data-st-carousel-position]');

    await prev.trigger('click');

    expect(track.attributes('data-st-carousel-position')).toBe('-2');

    await track.trigger('transitionend', { propertyName: 'transform' });

    expect(track.attributes('data-st-carousel-position')).toBe('3');
    expect(track.attributes('style')).toContain('transition-duration: 0ms');
  });

  it('ignora transicoes de outras propriedades', async () => {
    const wrapper = mountCarousel({ slidePerPage: 2, infiniteLoop: true }, 5);
    const [prev] = wrapper.findAll('button');
    const track = wrapper.find('[data-st-carousel-position]');

    await prev.trigger('click');
    await track.trigger('transitionend', { propertyName: 'height' });

    expect(track.attributes('data-st-carousel-position')).toBe('-2');
  });

  it('normaliza imediatamente quando a transicao esta desligada', async () => {
    const wrapper = mountCarousel(
      { slidePerPage: 2, infiniteLoop: true, transitionDuration: 0 },
      5
    );
    const [prev] = wrapper.findAll('button');

    await prev.trigger('click');

    expect(
      wrapper
        .find('[data-st-carousel-position]')
        .attributes('data-st-carousel-position')
    ).toBe('3');
  });
});

describe('StCarousel destaque', () => {
  it('nao aplica destaque sem a prop highlight', () => {
    const wrapper = mountCarousel({ slidePerPage: 3, grab: true }, 6);
    const slides = wrapper.findAll('[data-st-slide-index]');

    expect(wrapper.find('.cursor-grab').exists()).toBe(true);
    expect(slides[0].attributes('data-st-slide-selected')).toBe('true');
    expect(slides[0].attributes('style')).toBeUndefined();
    expect(wrapper.find('.overflow-x-clip').exists()).toBe(false);
    expect(wrapper.find('.overflow-hidden').exists()).toBe(true);
  });

  it('aplica destaque sem grab', () => {
    const wrapper = mountCarousel({ slidePerPage: 3, highlight: true }, 6);
    const slides = wrapper.findAll('[data-st-slide-index]');

    expect(wrapper.find('.cursor-grab').exists()).toBe(false);
    expect(slideProgress(slides[0])).toBe('0');
  });

  it('aplica destaque com uma coluna por pagina quando pedido', () => {
    const wrapper = mountCarousel({ slidePerPage: 1, highlight: true }, 6);
    const slides = wrapper.findAll('[data-st-slide-index]');

    expect(slides[0].attributes('data-st-slide-selected')).toBe('true');
    expect(slideProgress(slides[0])).toBe('0');
    expect(slideProgress(slides[1])).toBe('1');
  });

  it('mantem o destaque mesmo sem navegacao disponivel', () => {
    const wrapper = mountCarousel({ slidePerPage: 3, highlight: true }, 3);
    const slides = wrapper.findAll('[data-st-slide-index]');

    expect(slideProgress(slides[0])).toBe('0');
  });

  it('mantem o recorte simples do viewport e encolhe do centro', () => {
    const wrapper = mountCarousel({ slidePerPage: 3, highlight: true }, 9);
    const slideClass = wrapper
      .find('[data-st-slide-index]')
      .attributes('class');

    expect(viewportClass(wrapper)).toContain('overflow-hidden');
    expect(viewportClass(wrapper)).not.toContain('overflow-x-clip');
    expect(slideClass).toContain('origin-center');
  });
});

describe('StCarousel area de escape', () => {
  it('converte o token de escape limitando ao maximo', () => {
    expect(peekToPixels(0)).toBe('0px');
    expect(peekToPixels(2)).toBe('16px');
    expect(peekToPixels('6')).toBe('48px');
    expect(peekToPixels(9 as unknown as 6)).toBe('48px');
  });

  it('resolve o recuo da janela conforme o alinhamento', () => {
    expect(resolveCenterOffset(3, 'left')).toBe(0);
    expect(resolveCenterOffset(3, 'center')).toBe(1);
    expect(resolveCenterOffset(5, 'center')).toBe(2);
    expect(resolveCenterOffset(4, 'center')).toBe(1);
    expect(resolveCenterOffset(1, 'center')).toBe(0);
  });

  it('estende a ultima posicao com a janela centralizada', () => {
    expect(resolveMaxPosition(8, 3)).toBe(5);
    expect(resolveMaxPosition(8, 3, 1)).toBe(6);
    expect(resolveMaxPosition(8, 5, 2)).toBe(5);
    /** Nunca passa do ultimo slide. */
    expect(resolveMaxPosition(3, 1, 0)).toBe(2);
    expect(resolveMaxPosition(0, 3, 1)).toBe(0);
  });

  it('recalcula as paginas com a janela centralizada', () => {
    expect(resolvePagePositions(8, 3, false, 0)).toEqual([0, 3, 5]);
    expect(resolvePagePositions(8, 3, false, 1)).toEqual([0, 3, 6]);
  });

  it('nao aplica padding de escape sem a prop', () => {
    const wrapper = mountCarousel({ slidePerPage: 3 }, 9);

    expect(viewportClass(wrapper)).not.toContain('--st-carousel-peek');
    expect(wrapper.attributes('style')).toContain('--st-carousel-peek: 0px');
  });

  it('abre o escape apenas a direita com referencia a esquerda', () => {
    const wrapper = mountCarousel({ slidePerPage: 3, peek: 4 }, 9);

    expect(wrapper.attributes('style')).toContain('--st-carousel-peek: 32px');
    expect(viewportClass(wrapper)).toContain('pr-[var(--st-carousel-peek)]');
    expect(viewportClass(wrapper)).not.toContain(
      'px-[var(--st-carousel-peek)]'
    );
  });

  it('abre o escape nos dois lados com referencia centralizada', () => {
    const wrapper = mountCarousel(
      { slidePerPage: 3, peek: 3, slideAlign: 'center' },
      9
    );

    expect(wrapper.attributes('style')).toContain('--st-carousel-peek: 24px');
    expect(viewportClass(wrapper)).toContain('px-[var(--st-carousel-peek)]');
  });

  it('centraliza o slide ativo recuando a janela', () => {
    const wrapper = mountCarousel(
      { slidePerPage: 3, slideAlign: 'center', highlight: true },
      9
    );
    const slides = wrapper.findAll('[data-st-slide-index]');

    expect(slides[0].attributes('data-st-slide-selected')).toBe('true');
    expect(slideProgress(slides[0])).toBe('0');
    expect(wrapper.attributes('data-st-carousel-index')).toBe('0');

    for (const index of [0, 1]) {
      expect(slides[index].attributes('data-st-slide-active')).toBe('true');
    }

    expect(slides[2].attributes('data-st-slide-active')).toBeUndefined();
  });

  it('preenche o slot anterior com o slide anterior ao avancar', async () => {
    const wrapper = mountCarousel(
      { slidePerPage: 3, slideAlign: 'center', highlight: true },
      9
    );
    const [, next] = wrapper.findAll('button');

    await next.trigger('click');

    const slides = wrapper.findAll('[data-st-slide-index]');

    expect(wrapper.attributes('data-st-carousel-index')).toBe('3');
    expect(slides[3].attributes('data-st-slide-selected')).toBe('true');
    expect(slideProgress(slides[3])).toBe('0');

    for (const index of [2, 3, 4]) {
      expect(slides[index].attributes('data-st-slide-active')).toBe('true');
    }
  });

  it('preenche o slot anterior com o clone do ultimo no loop', () => {
    const wrapper = mountCarousel(
      {
        slidePerPage: 3,
        slideAlign: 'center',
        highlight: true,
        infiniteLoop: true
      },
      9
    );
    const slides = wrapper.findAll('[data-st-slide-index]');
    const previousSlot = slides[2];

    expect(previousSlot.attributes('data-st-slide-clone')).toBe('true');
    expect(previousSlot.attributes('data-st-slide-index')).toBe('8');
    expect(previousSlot.attributes('data-st-slide-active')).toBe('true');
    expect(slides[3].attributes('data-st-slide-selected')).toBe('true');
  });

  it('alcanca o ultimo slide na ultima pagina centralizada', async () => {
    const wrapper = mountCarousel({ slidePerPage: 3, slideAlign: 'center' }, 8);
    const [, next] = wrapper.findAll('button');

    await next.trigger('click');
    await next.trigger('click');

    expect(wrapper.attributes('data-st-carousel-index')).toBe('6');

    const slides = wrapper.findAll('[data-st-slide-index]');

    expect(slides[7].attributes('data-st-slide-active')).toBe('true');
    expect(next.attributes('disabled')).toBeDefined();
  });

  it('centraliza a origem do destaque com referencia central', () => {
    const wrapper = mountCarousel(
      { slidePerPage: 3, slideAlign: 'center', highlight: true },
      9
    );

    expect(wrapper.find('[data-st-slide-index]').attributes('class')).toContain(
      'origin-center'
    );
  });
});

describe('StCarousel selecao durante o arraste', () => {
  const mountWithButton = (props: Record<string, unknown>) =>
    mount(StCarousel, {
      props,
      slots: {
        default:
          '<div><button type="button" data-testid="cta">Jogar</button>texto</div>' +
          '<div>Slide 2</div><div>Slide 3</div>'
      }
    });

  const viewportOf = (wrapper: ReturnType<typeof mountWithButton>) =>
    wrapper.find('[data-st-carousel-position]').element
      .parentElement as HTMLElement;

  const dispatchSelectstart = (viewport: HTMLElement) => {
    const event = new Event('selectstart', {
      bubbles: true,
      cancelable: true
    });

    viewport.dispatchEvent(event);

    return event.defaultPrevented;
  };

  const pointer = (
    viewport: HTMLElement,
    type: string,
    clientX: number,
    clientY = 10
  ) =>
    viewport.dispatchEvent(
      new PointerEvent(type, { bubbles: true, button: 0, clientX, clientY })
    );

  it('permite selecionar texto fora do gesto', () => {
    const wrapper = mountWithButton({ slidePerPage: 1, grab: true });

    expect(dispatchSelectstart(viewportOf(wrapper))).toBe(false);
    expect(viewportOf(wrapper).style.userSelect).toBe('');
  });

  it('permite selecionar com o ponteiro pressionado sem arrastar', async () => {
    const wrapper = mountWithButton({ slidePerPage: 1, grab: true });
    const viewport = viewportOf(wrapper);

    pointer(viewport, 'pointerdown', 200);
    await wrapper.vm.$nextTick();

    expect(dispatchSelectstart(viewport)).toBe(false);
    expect(viewport.style.userSelect).toBe('');
  });

  it('bloqueia a selecao depois do arraste ser reconhecido', async () => {
    const wrapper = mountWithButton({ slidePerPage: 1, grab: true });
    const viewport = viewportOf(wrapper);

    pointer(viewport, 'pointerdown', 200);
    pointer(viewport, 'pointermove', 120);
    await wrapper.vm.$nextTick();

    expect(dispatchSelectstart(viewport)).toBe(true);
    expect(viewport.style.userSelect).toBe('none');

    pointer(viewport, 'pointerup', 120);
    await wrapper.vm.$nextTick();

    expect(dispatchSelectstart(viewport)).toBe(false);
    expect(viewport.style.userSelect).toBe('');
  });

  it('ignora o gesto vertical, preservando a selecao', async () => {
    const wrapper = mountWithButton({ slidePerPage: 1, grab: true });
    const viewport = viewportOf(wrapper);

    pointer(viewport, 'pointerdown', 200, 10);
    pointer(viewport, 'pointermove', 205, 120);
    await wrapper.vm.$nextTick();

    expect(dispatchSelectstart(viewport)).toBe(false);
    expect(viewport.style.userSelect).toBe('');
  });

  it('nao bloqueia a selecao quando grab esta desligado', async () => {
    const wrapper = mountWithButton({ slidePerPage: 1 });
    const viewport = viewportOf(wrapper);

    pointer(viewport, 'pointerdown', 200);
    pointer(viewport, 'pointermove', 120);
    await wrapper.vm.$nextTick();

    expect(dispatchSelectstart(viewport)).toBe(false);
    expect(viewport.style.userSelect).toBe('');
  });

  it('previne o arraste nativo de imagens e links', () => {
    const wrapper = mountWithButton({ slidePerPage: 1, grab: true });
    const event = new Event('dragstart', { bubbles: true, cancelable: true });

    viewportOf(wrapper).dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it('mantem o clique em elementos internos quando nao houve arraste', async () => {
    const clicks: string[] = [];
    const wrapper = mountWithButton({ slidePerPage: 1, grab: true });
    const cta = wrapper.find('[data-testid="cta"]');

    cta.element.addEventListener('click', () => clicks.push('cta'));

    const viewport = viewportOf(wrapper);

    pointer(viewport, 'pointerdown', 200);
    pointer(viewport, 'pointerup', 200);
    await cta.trigger('click');

    expect(clicks).toEqual(['cta']);
  });

  it('descarta o clique disparado pelo fim de um arraste', async () => {
    const clicks: string[] = [];
    const wrapper = mountWithButton({ slidePerPage: 1, grab: true });
    const cta = wrapper.find('[data-testid="cta"]');

    cta.element.addEventListener('click', () => clicks.push('cta'));

    const viewport = viewportOf(wrapper);

    pointer(viewport, 'pointerdown', 200);
    pointer(viewport, 'pointermove', 120);
    pointer(viewport, 'pointerup', 120);
    await cta.trigger('click');

    expect(clicks).toEqual([]);
  });
});

describe('StCarousel loop com destaque', () => {
  const trackOf = (wrapper: ReturnType<typeof mountCarousel>) =>
    wrapper.find('[data-st-carousel-position]');

  const positionOf = (wrapper: ReturnType<typeof mountCarousel>) =>
    trackOf(wrapper).attributes('data-st-carousel-position');

  const emitTransitionEnd = (
    target: DOMWrapper<Element>,
    propertyName = 'transform'
  ) => target.trigger('transitionend', { propertyName });

  const mountLooping = () =>
    mountCarousel(
      {
        slidePerPage: 3,
        infiniteLoop: true,
        highlight: true,
        transitionDuration: 800
      },
      8
    );

  it('ignora o fim da transicao de escala dos slides', async () => {
    const wrapper = mountLooping();
    const [prev] = wrapper.findAll('button');

    await prev.trigger('click');

    expect(positionOf(wrapper)).toBe('-3');

    await emitTransitionEnd(wrapper.findAll('[data-st-slide-index]')[0]);

    expect(positionOf(wrapper)).toBe('-3');
  });

  it('ignora transicoes de outras propriedades no track', async () => {
    const wrapper = mountLooping();
    const [prev] = wrapper.findAll('button');

    await prev.trigger('click');

    await emitTransitionEnd(trackOf(wrapper), 'opacity');

    expect(positionOf(wrapper)).toBe('-3');
  });

  it('normaliza no fim do deslocamento do proprio track', async () => {
    const wrapper = mountLooping();
    const [prev] = wrapper.findAll('button');

    await prev.trigger('click');

    await emitTransitionEnd(trackOf(wrapper));

    expect(positionOf(wrapper)).toBe('5');
    expect(trackOf(wrapper).attributes('style')).toContain(
      'transition-duration: 0ms'
    );
  });

  it('completa o ciclo do ultimo para o primeiro slide', async () => {
    const wrapper = mountLooping();
    const [, next] = wrapper.findAll('button');

    await next.trigger('click');
    await next.trigger('click');

    expect(positionOf(wrapper)).toBe('6');

    await next.trigger('click');

    expect(positionOf(wrapper)).toBe('8');

    await emitTransitionEnd(wrapper.findAll('[data-st-slide-index]')[0]);

    expect(positionOf(wrapper)).toBe('8');

    await emitTransitionEnd(trackOf(wrapper));

    expect(positionOf(wrapper)).toBe('0');
  });
});
