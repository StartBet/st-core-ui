import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  toValue,
  watch,
  type MaybeRefOrGetter
} from 'vue';

export type UseCarouselAutoplayOptions = {
  enabled: MaybeRefOrGetter<boolean>;
  timeout: MaybeRefOrGetter<number>;
  paused: MaybeRefOrGetter<boolean>;
  onTick: () => void;
};

const MIN_TIMEOUT = 100;
export const useCarouselAutoplay = (options: UseCarouselAutoplayOptions) => {
  const isDocumentVisible = ref(true);
  const prefersReducedMotion = ref(false);
  const restartToken = ref(0);

  let timer: ReturnType<typeof setTimeout> | undefined;
  let disposeReducedMotion: (() => void) | undefined;

  const timeout = computed(() =>
    Math.max(MIN_TIMEOUT, Math.trunc(toValue(options.timeout) || 0))
  );

  const isRunning = computed(
    () =>
      toValue(options.enabled) &&
      !toValue(options.paused) &&
      isDocumentVisible.value &&
      !prefersReducedMotion.value
  );

  const clear = () => {
    if (timer === undefined) return;

    clearTimeout(timer);
    timer = undefined;
  };

  const schedule = () => {
    clear();

    if (!isRunning.value) return;

    timer = setTimeout(() => {
      options.onTick();
      restartToken.value += 1;
    }, timeout.value);
  };
  const restart = () => {
    restartToken.value += 1;
  };

  const handleVisibilityChange = () => {
    isDocumentVisible.value = document.visibilityState !== 'hidden';
  };

  onMounted(() => {
    if (typeof document !== 'undefined') {
      handleVisibilityChange();
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    if (typeof window !== 'undefined' && window.matchMedia) {
      const query = window.matchMedia('(prefers-reduced-motion: reduce)');

      prefersReducedMotion.value = query.matches;

      const listener = (event: MediaQueryListEvent) => {
        prefersReducedMotion.value = event.matches;
      };

      if (typeof query.addEventListener === 'function') {
        query.addEventListener('change', listener);
        disposeReducedMotion = () =>
          query.removeEventListener('change', listener);
      }
    }

    watch(
      [isRunning, timeout, restartToken],
      () => {
        schedule();
      },
      { immediate: true }
    );
  });

  onBeforeUnmount(() => {
    clear();

    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }

    disposeReducedMotion?.();
  });

  return { isRunning, prefersReducedMotion, restart, clear };
};
