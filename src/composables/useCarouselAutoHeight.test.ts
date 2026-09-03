import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick, ref, type Ref } from 'vue';

import { useCarouselAutoHeight } from './useCarouselAutoHeight';

describe('useCarouselAutoHeight', () => {
  const addEventListener = window.addEventListener;
  const removeEventListener = window.removeEventListener;
  let resizeCallbacks: Set<ResizeObserverCallback>;
  let resizeObservations: Map<Element, ResizeObserver>;
  const originalResizeObserver = window.ResizeObserver;

  beforeEach(() => {
    resizeCallbacks = new Set();
    resizeObservations = new Map();
    class MockResizeObserver {
      constructor(private cb: ResizeObserverCallback) {
        resizeCallbacks.add(cb);
      }
      observe(el: Element) {
        resizeObservations.set(el, this as unknown as ResizeObserver);
      }
      unobserve(el: Element) {
        resizeObservations.delete(el);
      }
      disconnect() {
        resizeCallbacks.delete(this.cb);
      }
    }
    window.ResizeObserver =
      MockResizeObserver as unknown as typeof ResizeObserver;
  });

  afterEach(() => {
    window.ResizeObserver = originalResizeObserver;
    window.addEventListener = addEventListener;
    window.removeEventListener = removeEventListener;
    try {
      document.body.innerHTML = '';
    } catch {
      /* noop */
    }
  });

  const fireResize = () => {
    for (const cb of Array.from(resizeCallbacks)) {
      cb([], null as unknown as ResizeObserver);
    }
  };

  const makeSlides = (heights: number[]): HTMLElement[] =>
    heights.map((h) => {
      const slide = document.createElement('div');
      Object.defineProperty(slide, 'offsetHeight', {
        configurable: true,
        value: h
      });
      return slide;
    });

  const makeTrack = (heights: number[]): HTMLElement => {
    const track = document.createElement('div');
    for (const slide of makeSlides(heights)) track.appendChild(slide);
    return track;
  };

  const setup = (params: {
    enabled: boolean | Ref<boolean>;
    track: HTMLElement | null;
    visibleIndexes: number[] | Ref<number[]>;
    attach?: boolean;
  }) => {
    const enabled = ref(params.enabled) as Ref<boolean>;
    const trackRef = ref(params.track) as Ref<HTMLElement | null>;
    const visibleRenderIndexes = ref(params.visibleIndexes) as Ref<number[]>;

    let api: ReturnType<typeof useCarouselAutoHeight>;

    const Harness = defineComponent({
      setup() {
        api = useCarouselAutoHeight({
          enabled,
          trackRef,
          visibleRenderIndexes
        });
        return () => h('div');
      }
    });

    const wrapper = mount(
      Harness,
      params.attach ? { attachTo: document.body } : undefined
    );
    return { enabled, trackRef, visibleRenderIndexes, api: api!, wrapper };
  };

  it('retorna undefined quando disabled', async () => {
    const track = makeTrack([100, 200, 150]);
    const { api } = setup({
      enabled: false,
      track,
      visibleIndexes: [0, 1]
    });

    await nextTick();
    expect(api.height.value).toBeUndefined();
  });

  it('retorna undefined quando trackRef é nulo', async () => {
    const { api } = setup({
      enabled: true,
      track: null,
      visibleIndexes: [0, 1]
    });

    await nextTick();
    expect(api.height.value).toBeUndefined();
  });

  it('mede altura do slide mais alto dentre os visiveis', async () => {
    const track = makeTrack([50, 300, 120, 80]);
    const { api } = setup({
      enabled: true,
      track,
      visibleIndexes: [0, 2]
    });

    await nextTick();
    expect(api.height.value).toBe(120);
  });

  it('usa todos os slides quando visibleIndexes vazio', async () => {
    const track = makeTrack([10, 250, 60]);
    const { api } = setup({
      enabled: true,
      track,
      visibleIndexes: []
    });

    await nextTick();
    expect(api.height.value).toBe(250);
  });

  it('ignora indexes fora do range', async () => {
    const track = makeTrack([100, 200]);
    const { api } = setup({
      enabled: true,
      track,
      visibleIndexes: [0, 99, -1]
    });

    await nextTick();
    expect(api.height.value).toBe(100);
  });

  it('atualiza altura quando visibleIndexes muda', async () => {
    const track = makeTrack([50, 400, 100, 10]);
    const { visibleRenderIndexes, api, wrapper } = setup({
      enabled: true,
      track,
      visibleIndexes: [0]
    });

    await nextTick();
    expect(api.height.value).toBe(50);

    visibleRenderIndexes.value = [1, 2];
    await wrapper.vm.$nextTick();
    expect(api.height.value).toBe(400);
  });

  it('reage a mudanca de enabled', async () => {
    const track = makeTrack([300]);
    const { enabled, api, wrapper } = setup({
      enabled: true,
      track,
      visibleIndexes: [0]
    });

    await nextTick();
    expect(api.height.value).toBe(300);

    enabled.value = false;
    await wrapper.vm.$nextTick();
    expect(api.height.value).toBeUndefined();

    enabled.value = true;
    await wrapper.vm.$nextTick();
    expect(api.height.value).toBe(300);
  });

  it('medicao manual funciona via measure()', async () => {
    const track = makeTrack([90, 180]);
    const { api } = setup({
      enabled: true,
      track,
      visibleIndexes: [0]
    });

    await nextTick();
    expect(api.height.value).toBe(90);

    const first = track.children[0] as HTMLElement;
    Object.defineProperty(first, 'offsetHeight', {
      configurable: true,
      value: 500
    });

    api.measure();
    expect(api.height.value).toBe(500);
  });

  it('ResizeObserver dispara nova medicao', async () => {
    const track = makeTrack([100, 200]);
    const { api, wrapper } = setup({
      enabled: true,
      track,
      visibleIndexes: [0, 1]
    });

    await wrapper.vm.$nextTick();
    expect(api.height.value).toBe(200);
    expect(resizeObservations.has(track.children[0])).toBe(true);
    expect(resizeObservations.has(track.children[1])).toBe(true);

    const second = track.children[1] as HTMLElement;
    Object.defineProperty(second, 'offsetHeight', {
      configurable: true,
      value: 500
    });

    fireResize();
    expect(api.height.value).toBe(500);
  });

  it('observer nao conecta quando disabled', async () => {
    const track = makeTrack([100]);
    setup({
      enabled: false,
      track,
      visibleIndexes: [0]
    });

    await nextTick();
    expect(resizeCallbacks.size).toBe(0);
    expect(resizeObservations.size).toBe(0);
  });

  it('adiciona e remove listener de window resize conforme enabled', async () => {
    const addSpy = vi.fn();
    const removeSpy = vi.fn();
    window.addEventListener = addSpy;
    window.removeEventListener = removeSpy;

    const track = makeTrack([100]);
    const { enabled, wrapper } = setup({
      enabled: false,
      track,
      visibleIndexes: [0]
    });

    await wrapper.vm.$nextTick();
    expect(addSpy).not.toHaveBeenCalledWith('resize', expect.any(Function));

    enabled.value = true;
    await wrapper.vm.$nextTick();
    expect(addSpy).toHaveBeenCalledWith('resize', expect.any(Function));

    enabled.value = false;
    await wrapper.vm.$nextTick();
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('limpa observer e listener de resize ao desmontar', async () => {
    const addSpy = vi.fn();
    const removeSpy = vi.fn();
    window.addEventListener = addSpy;
    window.removeEventListener = removeSpy;

    const track = makeTrack([100, 200]);
    const { wrapper } = setup({
      enabled: true,
      track,
      visibleIndexes: [0, 1]
    });

    await wrapper.vm.$nextTick();
    expect(resizeCallbacks.size).toBeGreaterThan(0);

    wrapper.unmount();
    expect(resizeCallbacks.size).toBe(0);
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('lida com ResizeObserver indefinido (ex: SSR)', async () => {
    const OriginalResize = window.ResizeObserver;
    (window as unknown as { ResizeObserver?: ResizeObserver }).ResizeObserver =
      undefined;
    const track = makeTrack([100, 300]);
    const { api } = setup({
      enabled: true,
      track,
      visibleIndexes: [0, 1]
    });

    await nextTick();
    expect(api.height.value).toBe(300);
    window.ResizeObserver = OriginalResize;
  });
});
