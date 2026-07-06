import type {
  BadgeClassProps,
  StBadgeSize,
  StBadgeVariant
} from './StBadge.interface';

const hasValue = (value: number | string | undefined) =>
  typeof value === 'number' || (typeof value === 'string' && value.length > 0);

export const formatBadgeValue = (value: number | string | undefined) => {
  if (typeof value === 'number') return value > 99 ? '99+' : String(value);
  if (typeof value === 'string')
    return value.length > 4 ? `${value.slice(0, 4)}…` : value;
  return undefined;
};

const sizeClasses: Record<
  StBadgeSize,
  {
    valueContainer: string;
    dotContainer: string;
    minWidth: string;
    text: string;
  }
> = {
  small: {
    valueContainer: 'h-[12px] px-[6px]',
    dotContainer: 'h-2.5 w-2.5 p-0',
    minWidth: 'min-w-2.5',
    text: 'text-st-xs'
  },
  medium: {
    valueContainer: 'h-[16px] px-[8px]',
    dotContainer: 'h-3 w-3 p-0',
    minWidth: 'min-w-3',
    text: 'text-st-sm'
  }
};

const variantClasses: Record<
  StBadgeVariant,
  { container: string; ring: string; text: string }
> = {
  info: {
    container: 'bg-st-info',
    ring: 'border-st-info',
    text: 'text-st-content-din'
  },
  system: {
    container: 'bg-st-system',
    ring: 'border-st-system',
    text: 'text-st-content-bright'
  },
  warning: {
    container: 'bg-st-warning',
    ring: 'border-st-warning',
    text: 'text-st-content-din'
  },
  positive: {
    container: 'bg-st-positive',
    ring: 'border-st-positive',
    text: 'text-st-content-din'
  },
  negative: {
    container: 'bg-st-negative',
    ring: 'border-st-negative',
    text: 'text-st-content-bright'
  }
};

export const buildBadgeClasses = (props: BadgeClassProps) => {
  const {
    variant = 'info',
    size = 'small',
    value,
    pulse = false,
    className
  } = props;

  const isDot = !hasValue(value);
  const variantConfig = variantClasses[variant];
  const sizeConfig = sizeClasses[size];

  const sizeContainer = isDot
    ? sizeConfig.dotContainer
    : sizeConfig.valueContainer;
  const text = isDot ? undefined : sizeConfig.text;

  const container = [
    'relative inline-flex items-center justify-center rounded-full whitespace-nowrap font-st-body font-semibold',
    sizeContainer,
    sizeConfig.minWidth,
    variantConfig.container,
    isDot ? undefined : variantConfig.text,
    text,
    className
  ]
    .filter(Boolean)
    .join(' ');

  const ring = [
    'pointer-events-none absolute inset-0 rounded-full border',
    variantConfig.ring,
    pulse ? 'animate-ping' : undefined
  ]
    .filter(Boolean)
    .join(' ');

  return { container, ring, isDot };
};
