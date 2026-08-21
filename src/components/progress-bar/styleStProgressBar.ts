import type {
  ProgressBarClassProps,
  StProgressBarSize,
  StProgressBarVariant
} from './StProgressBar.interface';

export const ST_PROGRESS_BAR_MIN_PERCENT = 0;
export const ST_PROGRESS_BAR_MAX_PERCENT = 100;

export const clampProgressPercent = (percent: number | undefined) => {
  if (typeof percent !== 'number' || Number.isNaN(percent)) {
    return ST_PROGRESS_BAR_MIN_PERCENT;
  }

  if (percent < ST_PROGRESS_BAR_MIN_PERCENT) return ST_PROGRESS_BAR_MIN_PERCENT;
  if (percent > ST_PROGRESS_BAR_MAX_PERCENT) return ST_PROGRESS_BAR_MAX_PERCENT;

  return percent;
};

const sizeClasses: Record<
  StProgressBarSize,
  { track: string; text: string; gap: string }
> = {
  small: {
    track: 'h-[4px]',
    text: 'text-st-body-small',
    gap: 'gap-[4px]'
  },
  large: {
    track: 'h-[8px]',
    text: 'text-st-body-medium',
    gap: 'gap-st-1'
  }
};

const variantClasses: Record<StProgressBarVariant, string> = {
  primary: 'bg-st-primary',
  secondary: 'bg-st-secondary',
  info: 'bg-st-info',
  system: 'bg-st-system',
  warning: 'bg-st-warning',
  positive: 'bg-st-positive',
  negative: 'bg-st-negative'
};

export const buildProgressBarClasses = (props: ProgressBarClassProps) => {
  const { variant = 'primary', size = 'small', className } = props;

  const sizeConfig = sizeClasses[size];

  const container = ['flex w-full flex-col', sizeConfig.gap, className]
    .filter(Boolean)
    .join(' ');

  const track = [
    'relative w-full overflow-hidden rounded-full bg-st-surface-2',
    sizeConfig.track
  ].join(' ');

  const fill = [
    'h-full rounded-full transition-[width] duration-300 ease-out',
    variantClasses[variant]
  ].join(' ');

  const text = ['font-st-body text-st-content-default', sizeConfig.text].join(
    ' '
  );

  return { container, track, fill, text };
};
