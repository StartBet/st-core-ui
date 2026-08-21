export type StProgressBarVariant =
  | 'primary'
  | 'secondary'
  | 'info'
  | 'system'
  | 'warning'
  | 'positive'
  | 'negative';

export type StProgressBarSize = 'small' | 'large';

export interface ProgressBarClassProps {
  variant?: StProgressBarVariant;
  size?: StProgressBarSize;
  className?: string;
}

export interface StProgressBarProps extends ProgressBarClassProps {
  percent?: number;
  text?: string;
}
