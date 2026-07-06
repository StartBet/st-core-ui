export type StBadgeVariant =
  | 'info'
  | 'system'
  | 'warning'
  | 'positive'
  | 'negative';

export type StBadgeSize = 'small' | 'medium';

export interface BadgeClassProps {
  variant?: StBadgeVariant;
  size?: StBadgeSize;
  value?: number | string;
  pulse?: boolean;
  className?: string;
}
