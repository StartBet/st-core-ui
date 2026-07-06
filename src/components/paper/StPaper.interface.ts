export type SizeValue =
  | 'auto'
  | 'full'
  | 'fit-content'
  | 'min-content'
  | 'max-content'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '16'
  | '20'
  | '24'
  | '32'
  | '40'
  | '48'
  | '56'
  | '64'
  | '72'
  | '80'
  | '96'
  | '128'
  | '144'
  | '160'
  | '168'
  | '240';

export type PaperVariant =
  | 'surface-0'
  | 'surface-1'
  | 'surface-2'
  | 'surface-3'
  | 'surface-4'
  | 'surface-info'
  | 'surface-system'
  | 'surface-warning'
  | 'surface-positive'
  | 'surface-negative'
  | 'surface-primary'
  | 'surface-secondary'
  | 'surface-shadow-0'
  | 'surface-shadow-1'
  | 'surface-shadow-2'
  | 'surface-shadow-3';

export type PaperBorder =
  | 'none'
  | '1'
  | '2'
  | '3'
  | 'primary'
  | 'secondary'
  | 'info'
  | 'system'
  | 'warning'
  | 'positive'
  | 'negative';

export type PaperBorderRadius = 'none' | '1' | '2';

export type PaperElevation = 0 | 1 | 2 | 3 | 4;

export interface PaperClassProps {
  variant?: PaperVariant;
  border?: PaperBorder;
  borderRadius?: PaperBorderRadius;
  elevation?: PaperElevation;
  interactive?: boolean;
  bgImage?: string;
  width?: SizeValue;
  height?: SizeValue;
  padding?: string;
  paddingSm?: string;
  paddingMd?: string;
  paddingLg?: string;
  margin?: string;
  marginSm?: string;
  marginMd?: string;
  marginLg?: string;
  className?: string;
}
