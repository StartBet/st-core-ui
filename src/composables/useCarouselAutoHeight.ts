import {
  onBeforeUnmount,
  onMounted,
  ref,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref
} from 'vue';

export type UseCarouselAutoHeightOptions = {
  enabled: MaybeRefOrGetter<boolean>;
  trackRef: Ref<HTMLElement | null>;
  visibleRenderIndexes: MaybeRefOrGetter<number[]>;
};

export const useCarouselAutoHeight = (
  options: UseCarouselAutoHeightOptions
) => {
  const height = ref<number | undefined>(undefined);

  let observer: ResizeObserver | undefined;

  const measure = () => {
    if (!toValue(options.enabled)) {
      height.value = undefined;
      return;
    }

    const track = options.trackRef.value;

    if (!track) return;

    const slides = Array.from(track.children) as HTMLElement[];
    const indexes = toValue(options.visibleRenderIndexes);
    const targets = indexes.length > 0 ? indexes : slides.map((_, i) => i);

    const tallest = targets.reduce((largest, index) => {
      const slide = slides[index];

      if (!slide) return largest;

      return Math.max(largest, slide.offsetHeight);
    }, 0);

    height.value = tallest > 0 ? tallest : undefined;
  };

  const observeSlides = () => {
    observer?.disconnect();

    if (!toValue(options.enabled)) return;
    if (typeof ResizeObserver === 'undefined') return;

    const track = options.trackRef.value;

    if (!track) return;

    observer = new ResizeObserver(() => measure());

    for (const slide of Array.from(track.children)) observer.observe(slide);
  };

  const handleResize = () => measure();

  onMounted(() => {
    watch(
      [
        () => toValue(options.enabled),
        () => toValue(options.visibleRenderIndexes),
        () => options.trackRef.value
      ],
      () => {
        observeSlides();
        measure();
      },
      { immediate: true, flush: 'post', deep: true }
    );

    watch(
      () => toValue(options.enabled),
      (enabled) => {
        if (typeof window === 'undefined') return;

        window.removeEventListener('resize', handleResize);

        if (enabled) window.addEventListener('resize', handleResize);
      },
      { immediate: true }
    );
  });

  onBeforeUnmount(() => {
    observer?.disconnect();

    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', handleResize);
    }
  });

  return { height, measure };
};
