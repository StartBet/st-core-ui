<script setup lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import {
  cloneVNode,
  computed,
  defineComponent,
  onMounted,
  ref,
  useSlots,
  watch,
  type CSSProperties,
  type PropType,
  type VNode
} from 'vue';

import {
  useActiveBreakpoints,
  useCarouselAutoHeight,
  useCarouselAutoplay,
  useCarouselDrag,
  useCarouselPagination,
  useResponsiveValue
} from '../../composables';
import { flattenSlotChildren } from '../../utils/slotChildren';
import StBullets from '../bullets/StBullets.vue';
import StIcon from '../icon/StIcon.vue';
import type {
  StCarouselGap,
  StCarouselNavigation,
  StCarouselPeek,
  StCarouselProps,
  StCarouselSlideAlign
} from './StCarousel.interface';
import {
  buildCarouselClasses,
  gapToPixels,
  peekToPixels,
  resolveDragStep,
  resolveCenterOffset,
  resolveSlideProgress,
  ST_CAROUSEL_DEFAULT_AUTOPLAY_TIMEOUT,
  ST_CAROUSEL_DEFAULT_TRANSITION_DURATION,
  ST_CAROUSEL_HIGHLIGHT_TRANSFORM,
  ST_CAROUSEL_IDLE_SCALE
} from './styleStCarousel';

library.add(faChevronLeft, faChevronRight);

defineOptions({ name: 'StCarousel' });

const props = withDefaults(defineProps<StCarouselProps>(), {
  autoplay: false,
  autoplayTimeout: ST_CAROUSEL_DEFAULT_AUTOPLAY_TIMEOUT,
  autoplayHoverPause: true,
  autoHeight: false,
  infiniteLoop: false,

  bullets: 'outside',
  smBullets: undefined,
  mdBullets: undefined,
  lgBullets: undefined,
  bulletsPosition: 'center',

  arrows: 'outside',
  smArrows: undefined,
  mdArrows: undefined,
  lgArrows: undefined,

  slidePerPage: 1,
  smSlidePerPage: undefined,
  mdSlidePerPage: undefined,
  lgSlidePerPage: undefined,

  peek: 0,
  smPeek: undefined,
  mdPeek: undefined,
  lgPeek: undefined,

  slideAlign: 'left',
  smSlideAlign: undefined,
  mdSlideAlign: undefined,
  lgSlideAlign: undefined,

  gap: 2,
  smGap: undefined,
  mdGap: undefined,
  lgGap: undefined,

  grab: false,
  smGrab: undefined,
  mdGrab: undefined,
  lgGrab: undefined,

  highlight: false,
  smHighlight: undefined,
  mdHighlight: undefined,
  lgHighlight: undefined,

  modelValue: undefined,
  transitionDuration: ST_CAROUSEL_DEFAULT_TRANSITION_DURATION,

  ariaLabel: 'Carousel',
  className: '',
  viewportClassName: '',
  trackClassName: '',
  slideClassName: ''
});

const emit = defineEmits<{
  'update:modelValue': [index: number];
  change: [index: number];
  'page-change': [page: number];
}>();

const StCarouselSlideContent = defineComponent({
  name: 'StCarouselSlideContent',
  props: {
    vnode: {
      type: Object as PropType<VNode>,
      required: true
    }
  },
  setup: (slideProps) => () => slideProps.vnode
});

const slots = useSlots();

const viewportRef = ref<HTMLElement | null>(null);
const trackRef = ref<HTMLElement | null>(null);
const isHovered = ref(false);
const isFocused = ref(false);

const activeBreakpoints = useActiveBreakpoints();

const slidePerPage = useResponsiveValue<number>(
  () => ({
    base: props.slidePerPage,
    sm: props.smSlidePerPage,
    md: props.mdSlidePerPage,
    lg: props.lgSlidePerPage
  }),
  activeBreakpoints
);

const gap = useResponsiveValue<StCarouselGap>(
  () => ({
    base: props.gap,
    sm: props.smGap,
    md: props.mdGap,
    lg: props.lgGap
  }),
  activeBreakpoints
);

const grab = useResponsiveValue<boolean>(
  () => ({
    base: props.grab,
    sm: props.smGrab,
    md: props.mdGrab,
    lg: props.lgGrab
  }),
  activeBreakpoints
);

const arrows = useResponsiveValue<StCarouselNavigation>(
  () => ({
    base: props.arrows,
    sm: props.smArrows,
    md: props.mdArrows,
    lg: props.lgArrows
  }),
  activeBreakpoints
);

const peek = useResponsiveValue<StCarouselPeek>(
  () => ({
    base: props.peek,
    sm: props.smPeek,
    md: props.mdPeek,
    lg: props.lgPeek
  }),
  activeBreakpoints
);

const highlight = useResponsiveValue<boolean>(
  () => ({
    base: props.highlight,
    sm: props.smHighlight,
    md: props.mdHighlight,
    lg: props.lgHighlight
  }),
  activeBreakpoints
);

const slideAlign = useResponsiveValue<StCarouselSlideAlign>(
  () => ({
    base: props.slideAlign,
    sm: props.smSlideAlign,
    md: props.mdSlideAlign,
    lg: props.lgSlideAlign
  }),
  activeBreakpoints
);

const bullets = useResponsiveValue<StCarouselNavigation>(
  () => ({
    base: props.bullets,
    sm: props.smBullets,
    md: props.mdBullets,
    lg: props.lgBullets
  }),
  activeBreakpoints
);

const slideNodes = computed<VNode[]>(() =>
  flattenSlotChildren(slots.default?.())
);

const pagination = useCarouselPagination({
  total: () => slideNodes.value.length,
  slidePerPage: () => slidePerPage.value,
  infiniteLoop: () => props.infiniteLoop,
  centerOffset: () => centerOffset.value,
  animated: () => props.transitionDuration > 0,
  initialIndex: props.modelValue ?? 0
});

const {
  activeIndex,
  activePage,
  canNavigate,
  cloneOffset,
  infiniteLoop,
  isSnapping,
  pageCount,
  perPage,
  position,
  total,
  visibleIndexes
} = pagination;

const centerOffset = computed(() =>
  canNavigate.value ? resolveCenterOffset(perPage.value, slideAlign.value) : 0
);

const gapPixels = computed(() => gapToPixels(gap.value));
const peekPixels = computed(() => peekToPixels(peek.value));
const hasPeek = computed(() => peekPixels.value !== '0px');
const isGrabEnabled = computed(() => grab.value && canNavigate.value);

const measureStepSize = () => {
  const firstSlide = trackRef.value?.firstElementChild as HTMLElement | null;
  const gapValue = Number.parseFloat(gapPixels.value) || 0;

  if (firstSlide?.offsetWidth) return firstSlide.offsetWidth + gapValue;

  const viewportWidth = viewportRef.value?.offsetWidth ?? 0;

  return viewportWidth / Math.max(1, perPage.value);
};

const drag = useCarouselDrag({
  enabled: () => isGrabEnabled.value,
  stepSize: measureStepSize,
  onDragStart: () => autoplay.clear(),
  onDragEnd: (dragSlides) => {
    pagination.moveBy(resolveDragStep(dragSlides, perPage.value));
    autoplay.restart();
  }
});

const isAutoplayPaused = computed(
  () =>
    drag.isPressed.value ||
    (props.autoplayHoverPause && (isHovered.value || isFocused.value))
);

const autoplay = useCarouselAutoplay({
  enabled: () => props.autoplay && canNavigate.value,
  timeout: () => props.autoplayTimeout,
  paused: () => isAutoplayPaused.value,
  onTick: () => pagination.next()
});

type RenderSlide = {
  key: string;
  vnode: VNode;
  logicalIndex: number;
  isClone: boolean;
};

const renderSlides = computed<RenderSlide[]>(() => {
  const nodes = slideNodes.value;

  if (nodes.length === 0) return [];

  const slides: RenderSlide[] = nodes.map((vnode, logicalIndex) => ({
    key: `slide-${logicalIndex}`,
    vnode,
    logicalIndex,
    isClone: false
  }));

  if (!infiniteLoop.value) return slides;

  const cloneCount = Math.min(perPage.value, nodes.length);

  const leading = slides.slice(-cloneCount).map((slide) => ({
    key: `clone-leading-${slide.logicalIndex}`,
    vnode: cloneVNode(slide.vnode),
    logicalIndex: slide.logicalIndex,
    isClone: true
  }));

  const trailing = slides.slice(0, cloneCount).map((slide) => ({
    key: `clone-trailing-${slide.logicalIndex}`,
    vnode: cloneVNode(slide.vnode),
    logicalIndex: slide.logicalIndex,
    isClone: true
  }));

  return [...leading, ...slides, ...trailing];
});

const selectedRenderIndex = computed(
  () => Math.round(position.value) + cloneOffset.value
);

const visibleRenderIndexes = computed(() =>
  Array.from(
    { length: perPage.value },
    (_, offset) => selectedRenderIndex.value - centerOffset.value + offset
  )
);

const autoHeight = useCarouselAutoHeight({
  enabled: () => props.autoHeight,
  trackRef,
  visibleRenderIndexes: () => visibleRenderIndexes.value
});

const classes = computed(() =>
  buildCarouselClasses({
    autoHeight: props.autoHeight,
    peek: hasPeek.value,
    slideAlign: slideAlign.value,
    arrows: arrows.value,
    bullets: bullets.value,
    bulletsPosition: props.bulletsPosition,
    grab: isGrabEnabled.value,
    className: props.className,
    viewportClassName: props.viewportClassName,
    trackClassName: props.trackClassName,
    slideClassName: props.slideClassName
  })
);

const referenceRenderPosition = computed(
  () => position.value + cloneOffset.value + drag.dragSlides.value
);

const offset = computed(
  () => referenceRenderPosition.value - centerOffset.value
);

const rootStyle = computed(
  () =>
    ({
      '--st-carousel-idle-scale': ST_CAROUSEL_IDLE_SCALE,
      '--st-carousel-peek': peekPixels.value
    }) as CSSProperties
);

const trackStyle = computed(() => {
  const duration = drag.isDragging.value
    ? 0
    : Math.max(0, props.transitionDuration);

  return {
    '--st-carousel-per-page': String(perPage.value),
    '--st-carousel-gap': gapPixels.value,
    '--st-carousel-slide-width':
      'calc((100% - var(--st-carousel-gap) * (var(--st-carousel-per-page) - 1)) / var(--st-carousel-per-page))',
    '--st-carousel-step':
      'calc(var(--st-carousel-slide-width) + var(--st-carousel-gap))',
    transform: `translate3d(calc(var(--st-carousel-step) * ${-offset.value}), 0, 0)`,
    transitionProperty: 'transform',
    transitionDuration: isSnapping.value ? '0ms' : `${duration}ms`
  } as CSSProperties;
});

const viewportStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {};

  if (isGrabEnabled.value) style.WebkitTouchCallout = 'none';

  if (drag.isDragging.value) {
    style.userSelect = 'none';
    style.WebkitUserSelect = 'none';
  }

  if (props.autoHeight && autoHeight.height.value !== undefined) {
    style.height = `${autoHeight.height.value}px`;
    style.transition = `height ${Math.max(0, props.transitionDuration)}ms ease-out`;
  }

  return style;
});

const isSlideVisible = (renderIndex: number) =>
  visibleRenderIndexes.value.includes(renderIndex);

const isSlideSelected = (renderIndex: number) =>
  renderIndex === selectedRenderIndex.value;
const slideStyle = (renderIndex: number): CSSProperties => {
  if (!highlight.value) return {};

  const style: Record<string, string> = {
    '--st-carousel-slide-progress': String(
      resolveSlideProgress(renderIndex, referenceRenderPosition.value)
    ),
    transform: ST_CAROUSEL_HIGHLIGHT_TRANSFORM
  };

  if (drag.isDragging.value) style.transitionDuration = '0ms';

  return style as CSSProperties;
};

const showArrows = computed(() => arrows.value !== 'none' && total.value > 0);
const showBullets = computed(
  () => bullets.value !== 'none' && pageCount.value > 1
);

const isPrevDisabled = computed(
  () => !canNavigate.value || (!infiniteLoop.value && position.value <= 0)
);
const isNextDisabled = computed(
  () =>
    !canNavigate.value ||
    (!infiniteLoop.value && position.value >= total.value - perPage.value)
);

const goToPage = (page: number) => {
  pagination.goToPage(page);
  autoplay.restart();
};

const next = () => {
  pagination.next();
  autoplay.restart();
};

const prev = () => {
  pagination.prev();
  autoplay.restart();
};

const onTrackTransitionEnd = (event: TransitionEvent) => {
  if (event.target !== trackRef.value) return;

  pagination.handleTransitionEnd(event);
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    next();
    return;
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    prev();
  }
};

onMounted(() => {
  watch(activeIndex, (index) => {
    emit('update:modelValue', index);
    emit('change', index);
  });

  watch(activePage, (page) => emit('page-change', page));
});

watch(
  () => props.modelValue,
  (index) => {
    if (index === undefined || index === activeIndex.value) return;

    pagination.goToSlide(index);
  }
);

defineExpose({
  activeIndex,
  activePage,
  pageCount,
  visibleIndexes,
  goToPage,
  goToSlide: pagination.goToSlide,
  next,
  prev
});
</script>

<template>
  <section
    :class="classes.root"
    :style="rootStyle"
    role="group"
    aria-roledescription="carousel"
    :aria-label="props.ariaLabel"
    :data-st-carousel-index="activeIndex"
    :data-st-carousel-page="activePage"
    :data-st-carousel-per-page="perPage"
    :data-st-carousel-grabbing="drag.isPressed.value || undefined"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @focusin="isFocused = true"
    @focusout="isFocused = false"
    @keydown="onKeydown"
  >
    <div :class="classes.body">
      <button
        v-if="showArrows"
        type="button"
        :class="classes.arrowPrev"
        :disabled="isPrevDisabled"
        aria-label="Slide anterior"
        @click="prev"
      >
        <slot name="arrow-prev">
          <StIcon name="chevron-left" :size="3" />
        </slot>
      </button>

      <div
        ref="viewportRef"
        :class="classes.viewport"
        :style="viewportStyle"
        :aria-live="props.autoplay ? 'off' : 'polite'"
        v-on="drag.handlers"
        @click.capture="drag.onClickCapture"
      >
        <div
          ref="trackRef"
          :class="classes.track"
          :style="trackStyle"
          :data-st-carousel-position="position"
          :data-st-carousel-gap="gapPixels"
          @transitionend="onTrackTransitionEnd"
        >
          <div
            v-for="(slide, renderIndex) in renderSlides"
            :key="slide.key"
            :class="classes.slide"
            :style="slideStyle(renderIndex)"
            role="group"
            aria-roledescription="slide"
            :aria-label="`${slide.logicalIndex + 1} de ${total}`"
            :aria-hidden="slide.isClone ? 'true' : undefined"
            :data-st-slide-index="slide.logicalIndex"
            :data-st-slide-clone="slide.isClone || undefined"
            :data-st-slide-active="isSlideVisible(renderIndex) || undefined"
            :data-st-slide-selected="isSlideSelected(renderIndex) || undefined"
          >
            <StCarouselSlideContent :vnode="slide.vnode" />
          </div>
        </div>
      </div>

      <button
        v-if="showArrows"
        type="button"
        :class="classes.arrowNext"
        :disabled="isNextDisabled"
        aria-label="Proximo slide"
        @click="next"
      >
        <slot name="arrow-next">
          <StIcon name="chevron-right" :size="3" />
        </slot>
      </button>

      <div
        v-if="showBullets && bullets === 'inside'"
        :class="classes.bulletsWrapper"
      >
        <StBullets
          class="pointer-events-auto"
          :total="pageCount"
          :model-value="activePage"
          :align="props.bulletsPosition"
          @update:model-value="goToPage"
        />
      </div>
    </div>

    <div
      v-if="showBullets && bullets === 'outside'"
      :class="classes.bulletsWrapper"
    >
      <StBullets
        :total="pageCount"
        :model-value="activePage"
        :align="props.bulletsPosition"
        @update:model-value="goToPage"
      />
    </div>
  </section>
</template>
