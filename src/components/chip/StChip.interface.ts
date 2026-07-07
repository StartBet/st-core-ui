export type StChipVariant =
  | 'primary'
  | 'secondary'
  | 'info'
  | 'system'
  | 'warning'
  | 'positive'
  | 'negative';

export interface ChipClassProps {
  variant?: StChipVariant;
  clickable?: boolean;
  className?: string;
}
