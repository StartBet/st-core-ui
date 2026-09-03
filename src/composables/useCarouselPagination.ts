import {
  computed,
  onMounted,
  ref,
  toValue,
  watch,
  type MaybeRefOrGetter
} from 'vue';

import {
  clampPosition,
  normalizePosition,
  normalizeSlidePerPage,
  resolveActivePage,
  resolvePagePositions,
  resolveVisibleIndexes
} from '../components/carousel/styleStCarousel';

export type UseCarouselPaginationOptions = {
  total: MaybeRefOrGetter<number>;
  slidePerPage: MaybeRefOrGetter<number>;
  infiniteLoop: MaybeRefOrGetter<boolean>;
  /** Recuo da janela visivel quando o slide ativo fica centralizado. */
  centerOffset?: MaybeRefOrGetter<number>;
  /** Quando `false`, a normalizacao do loop acontece sem esperar a transicao. */
  animated?: MaybeRefOrGetter<boolean>;
  initialIndex?: number;
};

/**
 * Controla o estado de navegacao do carousel.
 *
 * A `position` e mantida em slides e pode sair temporariamente do
 * intervalo logico quando o loop infinito acontece: nesse caso os clones
 * das pontas ficam visiveis e a posicao e normalizada sem transicao ao
 * final do deslocamento, produzindo o efeito continuo.
 */
export const useCarouselPagination = (
  options: UseCarouselPaginationOptions
) => {
  const total = computed(() =>
    Math.max(0, Math.trunc(toValue(options.total) || 0))
  );
  const perPage = computed(() =>
    normalizeSlidePerPage(toValue(options.slidePerPage), total.value)
  );
  const isAnimated = computed(() => toValue(options.animated ?? true));
  const centerOffset = computed(() =>
    Math.max(0, Math.trunc(toValue(options.centerOffset ?? 0)))
  );
  const canNavigate = computed(() => total.value > perPage.value);
  const infiniteLoop = computed(
    () => toValue(options.infiniteLoop) && canNavigate.value
  );

  const position = ref(options.initialIndex ?? 0);
  const isSnapping = ref(false);

  const pagePositions = computed(() =>
    resolvePagePositions(
      total.value,
      perPage.value,
      infiniteLoop.value,
      centerOffset.value
    )
  );
  const pageCount = computed(() => pagePositions.value.length);
  const activeIndex = computed(() =>
    normalizePosition(Math.round(position.value), total.value)
  );
  const activePage = computed(() =>
    resolveActivePage(activeIndex.value, pagePositions.value)
  );
  const visibleIndexes = computed(() =>
    resolveVisibleIndexes(
      position.value,
      total.value,
      perPage.value,
      infiniteLoop.value,
      centerOffset.value
    )
  );

  const cloneOffset = computed(() => (infiniteLoop.value ? perPage.value : 0));
  const needsNormalization = computed(
    () => position.value < 0 || position.value >= total.value
  );

  const normalize = () => {
    if (!needsNormalization.value) return;

    isSnapping.value = true;
    position.value = normalizePosition(position.value, total.value);
  };

  const commit = (target: number) => {
    const previous = position.value;

    isSnapping.value = false;
    position.value = target;

    if (!needsNormalization.value) return;
    if (!isAnimated.value || previous === target) normalize();
  };

  const moveBy = (slides: number) => {
    if (!canNavigate.value || slides === 0) return;

    const target = position.value + slides;

    if (!infiniteLoop.value) {
      commit(
        clampPosition(target, total.value, perPage.value, centerOffset.value)
      );
      return;
    }

    commit(Math.min(Math.max(target, -perPage.value), total.value));
  };

  const next = () => moveBy(perPage.value);
  const prev = () => moveBy(-perPage.value);

  const goToSlide = (index: number) => {
    if (total.value === 0) return;

    const target = infiniteLoop.value
      ? normalizePosition(index, total.value)
      : clampPosition(index, total.value, perPage.value, centerOffset.value);

    commit(target);
  };

  const goToPage = (page: number) => {
    const positions = pagePositions.value;

    if (positions.length === 0) return;

    const safePage = Math.min(
      Math.max(Math.trunc(page), 0),
      positions.length - 1
    );

    commit(positions[safePage]);
  };

  const handleTransitionEnd = (event?: TransitionEvent) => {
    if (event && event.propertyName !== 'transform') return;

    normalize();
  };

  onMounted(() => {
    watch([total, perPage, infiniteLoop, centerOffset], () => {
      if (infiniteLoop.value) {
        position.value = normalizePosition(position.value, total.value);
        return;
      }

      position.value = clampPosition(
        position.value,
        total.value,
        perPage.value,
        centerOffset.value
      );
    });
  });

  return {
    activeIndex,
    activePage,
    canNavigate,
    cloneOffset,
    infiniteLoop,
    isSnapping,
    pageCount,
    pagePositions,
    perPage,
    position,
    total,
    visibleIndexes,
    goToPage,
    goToSlide,
    handleTransitionEnd,
    moveBy,
    next,
    prev
  };
};
