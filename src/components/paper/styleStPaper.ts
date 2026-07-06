import type {
  PaperBorder,
  PaperBorderRadius,
  PaperClassProps,
  PaperElevation,
  PaperVariant
} from './StPaper.interface';
import type { SizeValue } from '../../types';

type ResponsivePrefix = 'sm' | 'md' | 'lg';
type SpacingRule = 'p' | 'm';

const variantClasses: Record<PaperVariant, string> = {
  'surface-0': 'bg-st-surface-0',
  'surface-1': 'bg-st-surface-1',
  'surface-2': 'bg-st-surface-2',
  'surface-3': 'bg-st-surface-3',
  'surface-4': 'bg-st-surface-4',
  'surface-info': 'bg-st-surface-info',
  'surface-system': 'bg-st-surface-system',
  'surface-warning': 'bg-st-surface-warning',
  'surface-positive': 'bg-st-surface-positive',
  'surface-negative': 'bg-st-surface-negative',
  'surface-primary': 'bg-st-surface-primary',
  'surface-secondary': 'bg-st-surface-secondary'
};

const borderClasses: Record<PaperBorder, string> = {
  none: 'border-0',
  '1': 'border border-st-border-1',
  '2': 'border border-st-border-2',
  '3': 'border border-st-border-3',
  primary: 'border border-st-primary',
  secondary: 'border border-st-secondary',
  info: 'border border-st-content-info',
  system: 'border border-st-content-system',
  warning: 'border border-st-content-warning',
  positive: 'border border-st-content-positive',
  negative: 'border border-st-content-negative'
};

const borderRadiusClasses: Record<PaperBorderRadius, string> = {
  none: 'rounded-none',
  '1': 'rounded-st-1',
  '2': 'rounded-st-2'
};

const elevationClasses: Record<PaperElevation, string> = {
  0: 'shadow-st-paper-0',
  1: 'shadow-st-paper-1',
  2: 'shadow-st-paper-2',
  3: 'shadow-st-paper-3',
  4: 'shadow-st-paper-4'
};

const hoverElevationClasses: Record<Exclude<PaperElevation, 4>, string> = {
  0: 'hover:shadow-st-paper-1',
  1: 'hover:shadow-st-paper-2',
  2: 'hover:shadow-st-paper-3',
  3: 'hover:shadow-st-paper-4'
};

const sizeClassSuffixes: Record<SizeValue, string> = {
  auto: 'auto',
  full: 'full',
  'fit-content': 'fit',
  'min-content': 'min',
  'max-content': 'max',
  '1': 'st-1',
  '2': 'st-2',
  '3': 'st-3',
  '4': 'st-4',
  '5': 'st-5',
  '6': 'st-6',
  '7': 'st-7',
  '8': 'st-8',
  '9': 'st-9',
  '10': 'st-10',
  '11': 'st-11',
  '12': 'st-12',
  '16': 'st-16',
  '20': 'st-20',
  '24': 'st-24',
  '32': 'st-32',
  '40': 'st-40',
  '48': 'st-48',
  '56': 'st-56',
  '64': 'st-64',
  '72': 'st-72',
  '80': 'st-80',
  '96': 'st-96',
  '128': 'st-128',
  '144': 'st-144',
  '160': 'st-160',
  '168': 'st-168',
  '240': 'st-240'
};

const createSizeClasses = (prefix: 'w' | 'h') =>
  Object.fromEntries(
    Object.entries(sizeClassSuffixes).map(([key, suffix]) => [
      key,
      `${prefix}-${suffix}`
    ])
  ) as Record<SizeValue, string>;

const sizeHeightClasses = createSizeClasses('h');
const sizeWidthClasses = createSizeClasses('w');

const toValueSuffix = (value: string) => {
  const resolved = value.trim();
  if (resolved === '0') return '0';
  if (resolved === 'auto') return 'auto';
  return `st-${resolved}`;
};

const spacingShorthandToClasses = (
  value: string | undefined,
  rule: SpacingRule,
  responsivePrefix?: ResponsivePrefix
) => {
  if (!value) return [];

  const values = value.trim().split(/\s+/).filter(Boolean).map(toValueSuffix);
  const prefix = responsivePrefix ? `${responsivePrefix}:` : '';

  if (values.length === 1) return [`${prefix}${rule}-${values[0]}`];

  if (values.length === 2) {
    return [`${prefix}${rule}y-${values[0]}`, `${prefix}${rule}x-${values[1]}`];
  }

  if (values.length === 3) {
    return [
      `${prefix}${rule}t-${values[0]}`,
      `${prefix}${rule}x-${values[1]}`,
      `${prefix}${rule}b-${values[2]}`
    ];
  }

  return [
    `${prefix}${rule}t-${values[0]}`,
    `${prefix}${rule}r-${values[1]}`,
    `${prefix}${rule}b-${values[2]}`,
    `${prefix}${rule}l-${values[3]}`
  ];
};

export const buildPaperStyle = (props: Pick<PaperClassProps, 'bgImage'>) => {
  const { bgImage } = props;

  if (!bgImage) return undefined;

  return {
    backgroundImage: `url(${bgImage})`
  } satisfies Record<string, string>;
};

export const buildPaperClasses = (props: PaperClassProps) => {
  const {
    variant = 'surface-1',
    border = 'none',
    borderRadius = '1',
    elevation = 1,
    interactive = false,
    bgImage,
    width,
    height,
    padding,
    paddingSm,
    paddingMd,
    paddingLg,
    margin,
    marginSm,
    marginMd,
    marginLg,
    className
  } = props;

  return [
    'relative block transition-all duration-200 ease-in-out',
    variantClasses[variant],
    borderClasses[border],
    borderRadiusClasses[borderRadius],
    elevationClasses[elevation],
    bgImage ? 'bg-cover bg-center bg-no-repeat' : undefined,
    interactive ? 'cursor-pointer active:translate-y-px' : undefined,
    interactive && elevation !== 4
      ? hoverElevationClasses[elevation]
      : undefined,
    width ? sizeWidthClasses[width] : undefined,
    height ? sizeHeightClasses[height] : undefined,
    ...spacingShorthandToClasses(padding, 'p'),
    ...spacingShorthandToClasses(paddingSm, 'p', 'sm'),
    ...spacingShorthandToClasses(paddingMd, 'p', 'md'),
    ...spacingShorthandToClasses(paddingLg, 'p', 'lg'),
    ...spacingShorthandToClasses(margin, 'm'),
    ...spacingShorthandToClasses(marginSm, 'm', 'sm'),
    ...spacingShorthandToClasses(marginMd, 'm', 'md'),
    ...spacingShorthandToClasses(marginLg, 'm', 'lg'),
    className
  ]
    .filter(Boolean)
    .join(' ');
};
