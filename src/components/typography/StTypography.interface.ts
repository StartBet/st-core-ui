export type TypographyVariant =
  | 'heading-1'
  | 'heading-2'
  | 'heading-3'
  | 'heading-4'
  | 'highlight-large'
  | 'highlight-medium'
  | 'body-large'
  | 'body-medium'
  | 'body-small'
  | 'hero-title';

export type FontSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type FontWeight =
  | 'thin'
  | 'extralight'
  | 'light'
  | 'normal'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold'
  | 'black';

export type FontFamily = 'body' | 'heading' | 'highlight' | 'display';

export type LineHeight = 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';

export type LetterSpacing =
  | 'tighter'
  | 'tight'
  | 'normal'
  | 'wide'
  | 'wider'
  | 'widest';

export type TextAlign = 'left' | 'center' | 'right' | 'justify';

export type TypographyElement =
  | 'p'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'span'
  | 'div';

export interface TypographyClassProps {
  variant?: TypographyVariant;
  as?: TypographyElement;
  lines?: number;
  size?: FontSize;
  weight?: FontWeight;
  family?: FontFamily;
  lineHeight?: LineHeight;
  letterSpacing?: LetterSpacing;
  align?: TextAlign;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  uppercase?: boolean;
  lowercase?: boolean;
  capitalize?: boolean;
  truncate?: boolean;
  maxLines?: number;
  className?: string;
}
