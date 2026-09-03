import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, ref, toValue } from 'vue';

import { useCarouselAutoplay } from './useCarouselAutoplay';

describe('useCarouselAutoplay', () => {
  const docAddEventListener = document.addEventListener;
  const docRemoveEventListener = document.removeEventListener;
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    document.addEventListener = docAddEventListener;
    document.removeEventListener = docRemoveEventListener;
    window.matchMedia = originalMatchMedia;
    vi.useRealTimers();
  });

  const mockMatchMedia = (matches = false) => {
    const listeners: Array<(event: MediaQueryListEvent) => void> = [];
    const mql = {
      matches,
      addEventListener: vi.fn(
        (_event: string, listener: (event: MediaQueryListEvent) => void) => {
          listeners.push(listener);
        }
      ),
      removeEventListener: vi.fn(
        (_event: string, listener: (event: MediaQueryListEvent) => void) => {
          const idx = listeners.indexOf(listener);
          if (idx > -1) listeners.splice(idx, 1);
        }
      ),
      _fire: (value: boolean) => {
        const event = { matches: value } as MediaQueryListEvent;
        listeners.forEach((l) => l(event));
      }
    };
    window.matchMedia = vi.fn().mockReturnValue(mql);
    return mql;
  };

  const setupAutoplay = (
    opts: Partial<Parameters<typeof useCarouselAutoplay>[0]> & {
      onTick: () => void;
    }
  ) => {
    const enabled = ref<boolean>(toValue(opts.enabled) ?? true);
    const timeout = ref<number>(toValue(opts.timeout) ?? 1000);
    const paused = ref<boolean>(toValue(opts.paused) ?? false);
    const onTick = vi.fn(opts.onTick);

    let api: ReturnType<typeof useCarouselAutoplay>;

    const Harness = defineComponent({
      setup() {
        api = useCarouselAutoplay({ enabled, timeout, paused, onTick });
        return () => h('div');
      }
    });

    const wrapper = mount(Harness);
    return { enabled, timeout, paused, onTick, api: api!, wrapper };
  };

  const flushReactivity = async (wrapper: ReturnType<typeof mount>) => {
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
  };

  describe('isRunning', () => {
    it('é true quando enabled e sem pausa', () => {
      mockMatchMedia(false);
      const { api } = setupAutoplay({
        onTick: () => undefined,
        enabled: true,
        paused: false
      });

      expect(api.isRunning.value).toBe(true);
    });

    it('é false quando disabled', () => {
      mockMatchMedia(false);
      const { api } = setupAutoplay({
        onTick: () => undefined,
        enabled: false
      });

      expect(api.isRunning.value).toBe(false);
    });

    it('é false quando paused=true', () => {
      mockMatchMedia(false);
      const { api } = setupAutoplay({
        onTick: () => undefined,
        paused: true
      });

      expect(api.isRunning.value).toBe(false);
    });

    it('é false quando prefers-reduced-motion está ativo', () => {
      mockMatchMedia(true);
      const { api } = setupAutoplay({
        onTick: () => undefined,
        enabled: true,
        paused: false
      });

      expect(api.prefersReducedMotion.value).toBe(true);
      expect(api.isRunning.value).toBe(false);
    });

    it('reage a mudanca de prefers-reduced-motion dinamicamente', async () => {
      const mql = mockMatchMedia(false);
      const { api, wrapper } = setupAutoplay({
        onTick: () => undefined,
        enabled: true,
        paused: false
      });

      expect(api.isRunning.value).toBe(true);

      mql._fire(true);
      await wrapper.vm.$nextTick();
      expect(api.isRunning.value).toBe(false);

      mql._fire(false);
      await wrapper.vm.$nextTick();
      expect(api.isRunning.value).toBe(true);
    });
  });

  describe('agendamento', () => {
    it('dispara onTick no timeout configurado', async () => {
      mockMatchMedia(false);
      const { onTick } = setupAutoplay({
        onTick: () => undefined,
        timeout: 300
      });

      expect(onTick).not.toHaveBeenCalled();
      await vi.advanceTimersByTimeAsync(299);
      expect(onTick).not.toHaveBeenCalled();
      await vi.advanceTimersByTimeAsync(1);
      expect(onTick).toHaveBeenCalledTimes(1);
    });

    it('aplica MIN_TIMEOUT quando valor muito baixo', async () => {
      mockMatchMedia(false);
      const { onTick } = setupAutoplay({
        onTick: () => undefined,
        timeout: 10
      });

      await vi.advanceTimersByTimeAsync(50);
      expect(onTick).not.toHaveBeenCalled();
      await vi.advanceTimersByTimeAsync(50);
      expect(onTick).toHaveBeenCalledTimes(1);
    });

    it('nao agenda quando isRunning=false, agenda apos despausar', async () => {
      mockMatchMedia(false);
      const { onTick, paused, wrapper } = setupAutoplay({
        onTick: () => undefined,
        timeout: 200,
        paused: true
      });

      await vi.advanceTimersByTimeAsync(2000);
      expect(onTick).not.toHaveBeenCalled();

      paused.value = false;
      await flushReactivity(wrapper);

      await vi.advanceTimersByTimeAsync(199);
      expect(onTick).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(2);
      expect(onTick).toHaveBeenCalledTimes(1);
    });

    it('restart recomeca contagem', async () => {
      mockMatchMedia(false);
      const { onTick, api, wrapper } = setupAutoplay({
        onTick: () => undefined,
        timeout: 500
      });

      await vi.advanceTimersByTimeAsync(100);
      expect(onTick).not.toHaveBeenCalled();

      api.restart();
      await flushReactivity(wrapper);
      expect(onTick).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(499);
      expect(onTick).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(2);
      expect(onTick).toHaveBeenCalledTimes(1);
    });

    it('clear limpa timer pendente', async () => {
      mockMatchMedia(false);
      const { onTick, api } = setupAutoplay({
        onTick: () => undefined,
        timeout: 200
      });

      api.clear();
      await vi.advanceTimersByTimeAsync(2000);
      expect(onTick).not.toHaveBeenCalled();
    });
  });

  describe('visibilidade e cleanup', () => {
    it('pausa quando document fica hidden', () => {
      mockMatchMedia(false);
      const visibilityListeners: Array<() => void> = [];
      document.addEventListener = vi.fn(
        (evt: string, listener: EventListenerOrEventListenerObject) => {
          if (evt === 'visibilitychange')
            visibilityListeners.push(listener as () => void);
        }
      );
      document.removeEventListener = vi.fn();
      Object.defineProperty(document, 'visibilityState', {
        configurable: true,
        get: () => 'hidden'
      });

      let api: ReturnType<typeof useCarouselAutoplay>;
      const Harness = defineComponent({
        setup() {
          api = useCarouselAutoplay({
            enabled: true,
            timeout: 100,
            paused: false,
            onTick: vi.fn()
          });
          return () => h('div');
        }
      });

      mount(Harness);
      visibilityListeners.forEach((l) => l());
      expect(api!.isRunning.value).toBe(false);
    });

    it('remove listeners ao desmontar', () => {
      mockMatchMedia(false);
      const docRemove = vi.fn();
      document.removeEventListener = docRemove;

      const { wrapper } = setupAutoplay({
        onTick: () => undefined
      });

      wrapper.unmount();

      expect(docRemove).toHaveBeenCalledWith(
        'visibilitychange',
        expect.any(Function)
      );
    });
  });
});
