import type { PromotionCardClassProps } from './StPromotionCard.interface';

export const ST_PROMOTION_CARD_CTA_LABEL = 'Saiba mais';

export const resolvePromotionCardLinkLabel = (name?: string): string => {
  const target = name?.trim();

  return target
    ? `Saiba mais sobre a promoção ${target}`
    : 'Saiba mais sobre a promoção';
};

export const buildPromotionCardClasses = (props: PromotionCardClassProps) => {
  const { hasLink = false, className } = props;

  const shape =
    'relative flex w-full min-w-0 flex-col overflow-hidden rounded-st-1';

  const root = [
    shape,
    'group isolate border border-st-border-1 bg-st-surface-2 font-st-body',
    'transition-colors duration-200 ease-linear motion-reduce:transition-none',
    hasLink
      ? 'cursor-pointer [@media(hover:hover)]:hover:border-st-primary'
      : undefined,
    className
  ]
    .filter(Boolean)
    .join(' ');

  const skeleton = [shape, 'animate-pulse bg-st-surface-1', className]
    .filter(Boolean)
    .join(' ');

  // A midia reserva o 16/9 antes da imagem chegar, entao o card nao pula.
  const media = 'relative aspect-video w-full overflow-hidden bg-st-surface-1';

  const image = [
    'absolute inset-0 h-full w-full object-cover object-center',
    'transition-transform duration-300 ease-out motion-reduce:transition-none',
    hasLink ? 'md:[@media(hover:hover)]:group-hover:scale-105' : undefined
  ]
    .filter(Boolean)
    .join(' ');

  const fallback = [
    'absolute inset-0 flex items-center justify-center px-st-2',
    'bg-[linear-gradient(160deg,var(--st-color-surface-2)_0%,var(--st-color-surface-0)_100%)]',
    'text-center font-st-heading text-st-lg uppercase leading-st-tight text-st-content-ghost'
  ].join(' ');

  const skeletonMedia = 'aspect-video w-full';

  const skeletonFooter = 'h-14 w-full bg-st-surface-2 sm:h-16';

  const footer =
    'flex items-center justify-between gap-st-1 px-st-1 py-[10px] sm:px-st-2 sm:py-st-1';

  const text = 'flex min-w-0 flex-col gap-[2px]';

  const name =
    'line-clamp-1 text-st-xs font-bold uppercase leading-st-snug text-st-content-default sm:text-st-sm';

  const description =
    'line-clamp-2 text-st-xxs leading-st-snug text-st-content-default opacity-60 sm:text-st-xs';

  const link = [
    'absolute inset-0 z-[2] rounded-st-1 no-underline outline-none',
    'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-st-focus'
  ].join(' ');

  const top = [
    'pointer-events-none absolute inset-x-0 top-0 z-[3] flex items-start gap-st-1 p-st-1',
    '[&>*]:pointer-events-auto'
  ].join(' ');

  return {
    root,
    skeleton,
    skeletonMedia,
    skeletonFooter,
    media,
    image,
    fallback,
    footer,
    text,
    name,
    description,
    link,
    top
  };
};
