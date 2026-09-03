import { stTailwindTheme } from '../../tokens';
import type {
  CarouselClassProps,
  StCarouselBulletsPosition,
  StCarouselGap,
  StCarouselNavigation,
  StCarouselPeek,
  StCarouselSlideAlign
} from './StCarousel.interface';

export const ST_CAROUSEL_DEFAULT_AUTOPLAY_TIMEOUT = 5000;
export const ST_CAROUSEL_DEFAULT_TRANSITION_DURATION = 350;
export const ST_CAROUSEL_MIN_SLIDE_PER_PAGE = 1;
export const ST_CAROUSEL_DRAG_THRESHOLD = 0.15;
export const ST_CAROUSEL_IDLE_SCALE = '0.94';
export const ST_CAROUSEL_HIGHLIGHT_TRANSFORM =
  'scale(calc(1 - (1 - var(--st-carousel-idle-scale)) * var(--st-carousel-slide-progress)))';

const spacingScale = stTailwindTheme.spacing as Record<string, string>;

export const gapToPixels = (gap: StCarouselGap): string => {
  const token = String(gap);

  if (token === '0') return '0px';

  return spacingScale[`st-${token}`] ?? '0px';
};

export const ST_CAROUSEL_MAX_PEEK = 6;
export const peekToPixels = (peek: StCarouselPeek): string => {
  const token = Math.min(
    Math.max(Math.trunc(Number(peek) || 0), 0),
    ST_CAROUSEL_MAX_PEEK
  );

  if (token === 0) return '0px';

  return spacingScale[`st-${token}`] ?? '0px';
};

export const resolveSlideProgress = (
  renderIndex: number,
  referencePosition: number
): number => {
  const distance = Math.min(Math.abs(renderIndex - referencePosition), 1);

  return Math.round(distance * 1000) / 1000;
};

export const resolveCenterOffset = (
  perPage: number,
  slideAlign: StCarouselSlideAlign
): number => {
  if (slideAlign !== 'center') return 0;

  return Math.floor((Math.max(1, perPage) - 1) / 2);
};

export const normalizeSlidePerPage = (value: number, total: number): number => {
  const parsed = Math.trunc(Number(value));
  const safe = Number.isFinite(parsed)
    ? Math.max(ST_CAROUSEL_MIN_SLIDE_PER_PAGE, parsed)
    : ST_CAROUSEL_MIN_SLIDE_PER_PAGE;

  if (total <= 0) return safe;

  return Math.min(safe, total);
};

export const resolveMaxPosition = (
  total: number,
  perPage: number,
  centerOffset = 0
): number => {
  const max = total - perPage + centerOffset;

  return Math.min(Math.max(max, 0), Math.max(0, total - 1));
};

export const clampPosition = (
  position: number,
  total: number,
  perPage: number,
  centerOffset = 0
): number => {
  const max = resolveMaxPosition(total, perPage, centerOffset);

  return Math.min(Math.max(position, 0), max);
};

export const normalizePosition = (position: number, total: number): number => {
  if (total <= 0) return 0;

  return ((position % total) + total) % total;
};

export const resolvePagePositions = (
  total: number,
  perPage: number,
  infiniteLoop: boolean,
  centerOffset = 0
): number[] => {
  if (total <= 0) return [];
  if (perPage >= total) return [0];

  const positions: number[] = [];
  const max = infiniteLoop
    ? total - 1
    : resolveMaxPosition(total, perPage, centerOffset);

  for (let position = 0; position <= max; position += perPage) {
    positions.push(infiniteLoop ? position : Math.min(position, max));
  }

  const last = positions.at(-1)!;

  if (!infiniteLoop && last !== max) positions.push(max);

  return [...new Set(positions)];
};

export const resolveActivePage = (
  position: number,
  pagePositions: number[]
): number => {
  if (pagePositions.length === 0) return 0;

  let closest = 0;
  let smallestDistance = Number.POSITIVE_INFINITY;

  pagePositions.forEach((pagePosition, index) => {
    const distance = Math.abs(pagePosition - position);

    if (distance < smallestDistance) {
      smallestDistance = distance;
      closest = index;
    }
  });

  return closest;
};

export const resolveDragStep = (
  dragSlides: number,
  perPage: number,
  threshold = ST_CAROUSEL_DRAG_THRESHOLD
): number => {
  const magnitude = Math.abs(dragSlides);

  if (magnitude < threshold) return 0;

  const direction = dragSlides > 0 ? 1 : -1;
  const steps = Math.max(1, Math.round(magnitude));

  return direction * Math.min(steps, perPage);
};

export const resolveVisibleIndexes = (
  position: number,
  total: number,
  perPage: number,
  infiniteLoop: boolean,
  centerOffset = 0
): number[] => {
  if (total <= 0) return [];

  const start = Math.round(position) - centerOffset;
  const indexes: number[] = [];

  for (let offset = 0; offset < perPage; offset += 1) {
    const index = start + offset;

    if (infiniteLoop) {
      indexes.push(normalizePosition(index, total));
      continue;
    }

    if (index >= 0 && index < total) indexes.push(index);
  }

  return indexes;
};

const bulletsAlignClasses: Record<StCarouselBulletsPosition, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end'
};

const arrowBaseClass =
  'z-10 inline-flex h-st-4 w-st-4 shrink-0 cursor-pointer items-center justify-center rounded-full border border-st-border-2 bg-st-surface-1 text-st-content-default transition-colors hover:bg-st-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-st-focus disabled:cursor-not-allowed disabled:opacity-50';

const peekPaddingClass = (peek: boolean, slideAlign: StCarouselSlideAlign) => {
  if (!peek) return undefined;

  return slideAlign === 'center'
    ? 'px-[var(--st-carousel-peek)]'
    : 'pr-[var(--st-carousel-peek)]';
};

const arrowPlacementClass = (
  mode: StCarouselNavigation,
  side: 'prev' | 'next'
) => {
  if (mode !== 'inside') return '';

  const sideClass = side === 'prev' ? 'left-st-1' : 'right-st-1';

  return `absolute top-1/2 -translate-y-1/2 ${sideClass}`;
};

export const buildCarouselClasses = (props: CarouselClassProps) => {
  const {
    autoHeight = false,
    peek = false,
    slideAlign = 'left',
    arrows = 'outside',
    bullets = 'outside',
    bulletsPosition = 'center',
    grab = false,
    className,
    viewportClassName,
    trackClassName,
    slideClassName
  } = props;

  const root = ['flex w-full flex-col gap-st-2', className]
    .filter(Boolean)
    .join(' ');

  const body = ['relative flex w-full items-center gap-st-2']
    .filter(Boolean)
    .join(' ');

  const viewport = [
    'relative min-w-0 flex-1 overflow-hidden',
    peekPaddingClass(peek, slideAlign),
    grab ? 'cursor-grab touch-pan-y active:cursor-grabbing' : undefined,
    viewportClassName
  ]
    .filter(Boolean)
    .join(' ');

  const track = [
    'flex w-full min-w-0 will-change-transform',

    autoHeight ? 'items-start' : 'items-stretch',
    'gap-[var(--st-carousel-gap)]',
    'ease-out',
    trackClassName
  ]
    .filter(Boolean)
    .join(' ');

  const slide = [
    'relative min-w-0 shrink-0 grow-0 basis-[var(--st-carousel-slide-width)]',
    'origin-center transition-transform duration-200 ease-out',
    slideClassName
  ]
    .filter(Boolean)
    .join(' ');

  const arrowPrev = [arrowBaseClass, arrowPlacementClass(arrows, 'prev')]
    .filter(Boolean)
    .join(' ');

  const arrowNext = [arrowBaseClass, arrowPlacementClass(arrows, 'next')]
    .filter(Boolean)
    .join(' ');

  const bulletsWrapper = [
    'flex w-full',
    bulletsAlignClasses[bulletsPosition],
    bullets === 'inside'
      ? 'pointer-events-none absolute inset-x-0 bottom-st-1 z-10 px-st-2'
      : undefined
  ]
    .filter(Boolean)
    .join(' ');

  return {
    root,
    body,
    viewport,
    track,
    slide,
    arrowPrev,
    arrowNext,
    bulletsWrapper
  };
};
