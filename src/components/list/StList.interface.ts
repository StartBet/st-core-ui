export type StListNavOrientation = 'vertical' | 'horizontal';

export type StListContextValue = {
  navOrientation: StListNavOrientation;
  level: number;
};

export type StListItemSize = 'small' | 'medium' | 'large';

export type StListItemProps = {
  className?: string;
  dense?: boolean;
  divider?: boolean;
  selected?: boolean;
  disabled?: boolean;
  clickable?: boolean;
  size?: StListItemSize;
  onClick?: (event: MouseEvent) => void;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
};

export type StOrderedListProps = {
  className?: string;
  dense?: boolean;
  orientation?: StListNavOrientation;
};

export type StUnorderedListProps = {
  className?: string;
  dense?: boolean;
  orientation?: StListNavOrientation;
};
