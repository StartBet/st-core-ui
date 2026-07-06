import type { ButtonColor, ButtonVariant } from '../button/StButton.interface';
import type {
  ButtonGroupClassProps,
  StButtonGroupOrientation,
  StButtonGroupValue
} from './StButtonGroup.interface';

export const normalizeButtonGroupValue = (
  value: StButtonGroupValue | undefined,
  multiple: boolean
): string[] => {
  if (value === undefined) return [];
  if (multiple)
    return Array.isArray(value) ? value.map(String) : [String(value)];
  return [String(Array.isArray(value) ? value[0] : value)];
};

export const isSelected = (selected: string[], value: string) =>
  selected.includes(value);

const oppositeColor = (color: ButtonColor): ButtonColor => {
  if (color === 'primary') return 'secondary';
  if (color === 'secondary') return 'primary';
  return color;
};

const oppositeVariant = (variant: ButtonVariant): ButtonVariant => {
  if (variant === 'solid') return 'outline';
  if (variant === 'outline') return 'solid';
  return variant;
};

export const computeActiveProps = (
  baseColor: ButtonColor,
  baseVariant: ButtonVariant
) => {
  if (baseColor === 'primary' || baseColor === 'secondary') {
    return { color: oppositeColor(baseColor), variant: baseVariant };
  }

  if (baseColor === 'positive' || baseColor === 'negative') {
    return { color: baseColor, variant: oppositeVariant(baseVariant) };
  }

  return { color: baseColor, variant: baseVariant };
};

export const buildButtonGroupClasses = (props: ButtonGroupClassProps) => {
  const { className, orientation = 'horizontal' } = props;

  const orientationClass: Record<StButtonGroupOrientation, string> = {
    horizontal: 'flex-row',
    vertical: 'flex-col'
  };

  return ['inline-flex items-stretch', orientationClass[orientation], className]
    .filter(Boolean)
    .join(' ');
};

export const buildButtonGroupItemClasses = (
  orientation: StButtonGroupOrientation
) => {
  if (orientation === 'vertical') {
    return [
      'rounded-none -mt-px first:mt-0',
      'first:rounded-t-st-1 last:rounded-b-st-1'
    ].join(' ');
  }

  return [
    'rounded-none -ml-px first:ml-0',
    'first:rounded-l-st-1 last:rounded-r-st-1'
  ].join(' ');
};
