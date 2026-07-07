import type { ChipClassProps, StChipVariant } from './StChip.interface';

const variantClasses: Record<StChipVariant, string> = {
  primary:
    'bg-st-content-primary border-st-content-primary text-st-surface-primary',
  secondary:
    'bg-st-content-secondary border-st-content-secondary text-st-surface-secondary',
  info: 'bg-st-content-info border-st-content-info text-st-surface-info',
  system:
    'bg-st-content-system border-st-content-system text-st-surface-system',
  warning:
    'bg-st-content-warning border-st-content-warning text-st-surface-warning',
  positive:
    'bg-st-content-positive border-st-content-positive text-st-surface-positive',
  negative:
    'bg-st-content-negative border-st-content-negative text-st-surface-negative'
};

export const buildChipClasses = (props: ChipClassProps) => {
  const { variant = 'primary', clickable = false, className } = props;

  const container = [
    'inline-flex h-st-3 items-center gap-st-1 rounded-st-1 border border-transparent px-st-1',
    'whitespace-nowrap font-st-body text-st-xs font-semibold',
    variantClasses[variant],
    clickable
      ? [
          'relative cursor-pointer select-none overflow-hidden',
          'transition-opacity duration-200 ease-in-out',
          'hover:opacity-90 active:opacity-80',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-st-focus focus-visible:ring-offset-2 focus-visible:ring-offset-st-surface-0'
        ].join(' ')
      : undefined,
    className
  ]
    .filter(Boolean)
    .join(' ');

  const closeButton = [
    'inline-flex items-center justify-center rounded-full bg-transparent p-0 text-current',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-st-focus focus-visible:ring-offset-2 focus-visible:ring-offset-st-surface-0'
  ].join(' ');

  return { container, closeButton };
};
