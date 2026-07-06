import type {
  ButtonClassProps,
  ButtonColor,
  ButtonSize,
  ButtonVariant
} from './StButton.interface';
import { interactionsHoverPressed } from '../../../utils/compositions';

const sizeClasses: Record<
  ButtonSize,
  {
    container: string;
    iconOnly: string;
    contentPadding: string;
    contentGap: string;
  }
> = {
  small: {
    container: 'h-8 text-st-sm',
    iconOnly: 'w-8 px-0',
    contentPadding: 'px-st-2',
    contentGap: 'gap-st-1'
  },
  medium: {
    container: 'h-10 text-st-base',
    iconOnly: 'w-10 px-0',
    contentPadding: 'px-st-2',
    contentGap: 'gap-st-1'
  },
  large: {
    container: 'h-12 text-st-md',
    iconOnly: 'w-12 px-0',
    contentPadding: 'px-st-2',
    contentGap: 'gap-st-1'
  }
};

const solidClasses: Record<ButtonColor, string> = {
  primary: 'bg-st-primary text-st-content-bright border border-transparent',
  secondary: 'bg-st-secondary text-st-content-din border border-transparent',
  positive: 'bg-st-positive text-st-content-din border border-transparent',
  negative: 'bg-st-negative text-st-content-bright border border-transparent'
};

const outlineClasses: Record<ButtonColor, string> = {
  primary: 'bg-transparent text-st-content-primary border border-st-primary',
  secondary:
    'bg-transparent text-st-content-secondary border border-st-secondary',
  positive: 'bg-transparent text-st-content-positive border border-st-positive',
  negative: 'bg-transparent text-st-content-negative border border-st-negative'
};

const textClasses: Record<ButtonColor, string> = {
  primary: 'bg-transparent text-st-content-primary border border-transparent',
  secondary:
    'bg-transparent text-st-content-secondary border border-transparent',
  positive: 'bg-transparent text-st-content-positive border border-transparent',
  negative: 'bg-transparent text-st-content-negative border border-transparent'
};

const variantClasses: Record<ButtonVariant, Record<ButtonColor, string>> = {
  solid: solidClasses,
  outline: outlineClasses,
  text: textClasses
};

export const buildButtonClasses = (
  props: ButtonClassProps
): { container: string; content: string } => {
  const {
    variant = 'solid',
    size = 'medium',
    color = 'primary',
    disabled = false,
    fullWidth = false,
    isIconOnly = false,
    className
  } = props;

  const s = sizeClasses[size];

  const base = [
    'relative inline-flex items-center rounded-st-1 font-st-body font-semibold transition-all duration-200 ease-in-out',
    disabled ? 'cursor-not-allowed' : 'cursor-pointer',
    isIconOnly ? 'justify-center' : 'justify-between',
    disabled ? undefined : interactionsHoverPressed
  ]
    .filter(Boolean)
    .join(' ');

  const disabledClasses =
    'bg-st-surface-3 text-st-content-disable border border-st-border-2 opacity-80';

  const container = [
    base,
    s.container,
    isIconOnly ? s.iconOnly : undefined,
    !isIconOnly && fullWidth ? 'w-full' : undefined,
    disabled ? disabledClasses : variantClasses[variant][color],
    className
  ]
    .filter(Boolean)
    .join(' ');

  const content = [
    'relative z-20 inline-flex items-center',
    s.contentGap,
    isIconOnly ? 'px-0' : s.contentPadding
  ]
    .filter(Boolean)
    .join(' ');

  return { container, content };
};
