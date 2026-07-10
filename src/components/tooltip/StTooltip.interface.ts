export type StTooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export type StTooltipTriggerProps = {
  className?: string;
  onMouseenter?: (event: MouseEvent) => void;
  onMouseleave?: (event: MouseEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  onKeydown?: (event: KeyboardEvent) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
} & Record<string, unknown>;

export type StTooltipProps = {
  className?: string;
  panelClassName?: string;
  placement?: StTooltipPlacement;
  offset?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  triggerProps?: StTooltipTriggerProps;
};
