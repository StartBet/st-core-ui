export type ButtonVariant = 'solid' | 'outline' | 'text' | 'ghost';

export type ButtonSize = 'small' | 'medium' | 'large';

export type ButtonColor = 'primary' | 'secondary' | 'positive' | 'negative';

export interface ButtonClassProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  isIconOnly?: boolean;
  /** Ha slot `startAdornment` ou `endAdornment` preenchido. */
  hasSideAdornment?: boolean;
}
