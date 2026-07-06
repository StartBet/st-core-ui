import type {
  FontFamily,
  FontSize,
  FontWeight,
  LetterSpacing,
  LineHeight,
  TextAlign,
  TypographyClassProps,
  TypographyVariant
} from './StTypography.interface';

const variantClasses: Record<TypographyVariant, string> = {
  'heading-1': 'font-st-heading text-st-heading-1 text-shadow-st-large italic',
  'heading-2': 'font-st-heading text-st-heading-2 text-shadow-st-medium italic',
  'heading-3': 'font-st-heading text-st-heading-3 text-shadow-st-small italic',
  'heading-4': 'font-st-heading text-st-heading-4 text-shadow-st-small italic',
  'highlight-large':
    'font-st-highlight text-st-highlight-large text-shadow-st-small',
  'highlight-medium':
    'font-st-highlight text-st-highlight-medium text-shadow-st-small',
  'body-large': 'font-st-body text-st-body-large',
  'body-medium': 'font-st-body text-st-body-medium',
  'body-small': 'font-st-body text-st-body-small',
  'hero-title':
    'font-st-highlight text-st-hero-title text-shadow-st-large italic'
};

const sizeClasses: Record<FontSize, string> = {
  1: 'text-st-xs',
  2: 'text-st-sm',
  3: 'text-st-base',
  4: 'text-st-md',
  5: 'text-st-lg',
  6: 'text-st-xl',
  7: 'text-st-2xl',
  8: 'text-st-3xl',
  9: 'text-st-4xl',
  10: 'text-st-5xl',
  11: 'text-st-6xl',
  12: 'text-st-7xl'
};

const weightClasses: Record<FontWeight, string> = {
  thin: 'font-thin',
  extralight: 'font-extralight',
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
  black: 'font-black'
};

const familyClasses: Record<FontFamily, string> = {
  body: 'font-st-body',
  heading: 'font-st-heading',
  highlight: 'font-st-highlight',
  display: 'font-st-highlight'
};

const lineHeightClasses: Record<LineHeight, string> = {
  tight: 'leading-st-tight',
  snug: 'leading-st-snug',
  normal: 'leading-st-normal',
  relaxed: 'leading-st-relaxed',
  loose: 'leading-st-loose'
};

const letterSpacingClasses: Record<LetterSpacing, string> = {
  tighter: 'tracking-st-tight',
  tight: 'tracking-st-tight',
  normal: 'tracking-st-normal',
  wide: 'tracking-st-wide',
  wider: 'tracking-st-wider',
  widest: 'tracking-st-wider'
};

const alignClasses: Record<TextAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify'
};

const clampClasses: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
  1: 'overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1] [line-clamp:1]',
  2: 'overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] [line-clamp:2]',
  3: 'overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] [line-clamp:3]',
  4: 'overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:4] [line-clamp:4]',
  5: 'overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:5] [line-clamp:5]',
  6: 'overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:6] [line-clamp:6]'
};

const normalizeClamp = (
  value: number | undefined
): 1 | 2 | 3 | 4 | 5 | 6 | undefined => {
  if (!value) return undefined;
  if (value <= 1) return 1;
  if (value === 2) return 2;
  if (value === 3) return 3;
  if (value === 4) return 4;
  if (value === 5) return 5;
  return 6;
};

export const buildTypographyClasses = (props: TypographyClassProps) => {
  const {
    variant = 'body-medium',
    size,
    weight,
    family,
    lineHeight,
    letterSpacing,
    align,
    italic = false,
    underline = false,
    strikethrough = false,
    uppercase = false,
    lowercase = false,
    capitalize = false,
    truncate = false,
    maxLines,
    className
  } = props;

  const clamp = normalizeClamp(maxLines);

  const heroTitleEffectClasses = [
    'text-st-content-secondary relative pr-1',
    '[text-shadow:none]',
    'bg-[linear-gradient(140deg,transparent_45%,var(--st-bright-scale-700)_45%,var(--st-bright-scale-700)_65%,transparent_65%),linear-gradient(0deg,var(--st-color-content-secondary)_0%,var(--st-color-content-secondary)_100%)]',
    'bg-clip-text text-transparent',
    'drop-shadow-[-4px_4px_0px_var(--st-shadow-scale-950)]'
  ]
    .filter(Boolean)
    .join(' ');

  const base = [
    'm-0 p-0 text-st-content-default',
    variantClasses[variant],
    size ? sizeClasses[size] : undefined,
    weight ? weightClasses[weight] : undefined,
    family ? familyClasses[family] : undefined,
    lineHeight ? lineHeightClasses[lineHeight] : undefined,
    letterSpacing ? letterSpacingClasses[letterSpacing] : undefined,
    align ? alignClasses[align] : undefined,
    italic ? 'italic' : undefined,
    underline ? 'underline' : undefined,
    strikethrough ? 'line-through' : undefined,
    uppercase ? 'uppercase' : undefined,
    lowercase ? 'lowercase' : undefined,
    capitalize ? 'capitalize' : undefined,
    truncate ? 'truncate' : undefined,
    clamp ? clampClasses[clamp] : undefined,
    className
  ]
    .filter(Boolean)
    .join(' ');

  return {
    base,
    heroTitleEffectClasses
  };
};
