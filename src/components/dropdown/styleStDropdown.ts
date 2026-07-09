import { sizeWidthClasses } from '../../utils/spacingShorthand';
import type {
  DropdownClassProps,
  StDropdownPlacement
} from './StDropdown.interface';

export type DropdownPosition = { top: number; left: number };

const VIEWPORT_PADDING = 8;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const buildDropdownClasses = (props: DropdownClassProps) => {
  const { className, panelClassName, width = 'auto' } = props;

  const root = ['inline-block', className].filter(Boolean).join(' ');

  const panel = [
    'fixed z-[1200] m-0 rounded-st-1 border border-st-border-2 bg-st-surface-0 p-st-1 text-st-content-default shadow-st-paper-3',
    width === 'full' || width === 'auto' ? undefined : sizeWidthClasses[width],
    panelClassName
  ]
    .filter(Boolean)
    .join(' ');

  const trigger =
    'inline-flex cursor-pointer border-0 bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-st-focus focus-visible:ring-offset-2 focus-visible:ring-offset-st-surface-0';

  return { root, panel, trigger };
};

export const resolvePlacement = (
  preferred: StDropdownPlacement,
  triggerRect: DOMRect,
  panelRect: DOMRect
): Exclude<StDropdownPlacement, 'auto'> => {
  if (preferred !== 'auto') return preferred;

  const spaceBelow = window.innerHeight - triggerRect.bottom - VIEWPORT_PADDING;
  const spaceAbove = triggerRect.top - VIEWPORT_PADDING;

  if (spaceBelow >= panelRect.height || spaceBelow >= spaceAbove)
    return 'bottom';

  return 'top';
};

export const calculateDropdownPosition = (args: {
  placement: StDropdownPlacement;
  triggerRect: DOMRect;
  panelRect: DOMRect;
  offset: number;
}): DropdownPosition => {
  const { placement, triggerRect, panelRect, offset } = args;

  const finalPlacement = resolvePlacement(placement, triggerRect, panelRect);

  let top = triggerRect.bottom + offset;
  let left = triggerRect.left;

  if (finalPlacement === 'top') {
    top = triggerRect.top - panelRect.height - offset;
    left = triggerRect.left;
  }

  if (finalPlacement === 'left') {
    top = triggerRect.top;
    left = triggerRect.left - panelRect.width - offset;
  }

  if (finalPlacement === 'right') {
    top = triggerRect.top;
    left = triggerRect.right + offset;
  }

  const maxLeft = window.innerWidth - panelRect.width - VIEWPORT_PADDING;
  const maxTop = window.innerHeight - panelRect.height - VIEWPORT_PADDING;

  return {
    top: clamp(top, VIEWPORT_PADDING, Math.max(VIEWPORT_PADDING, maxTop)),
    left: clamp(left, VIEWPORT_PADDING, Math.max(VIEWPORT_PADDING, maxLeft))
  };
};
