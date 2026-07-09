import type {
  PaperBorder,
  PaperBorderRadius,
  PaperClassProps,
  PaperElevation,
  PaperVariant
} from './StPaper.interface';
import {
  sizeHeightClasses,
  sizeWidthClasses,
  spacingShorthandToClasses
} from '../../utils/spacingShorthand';

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
