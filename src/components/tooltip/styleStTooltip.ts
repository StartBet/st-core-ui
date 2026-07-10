import type { StTooltipPlacement, StTooltipProps } from './StTooltip.interface';

export type TooltipPosition = { top: number; left: number };

const VIEWPORT_PADDING = 8;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const buildTooltipClasses = (
  props: Pick<StTooltipProps, 'className' | 'panelClassName' | 'placement'>
) => {
  const { className, panelClassName, placement = 'top' } = props;

  const root = ['inline-flex', className].filter(Boolean).join(' ');
  const trigger = 'inline-flex';

  const panelBase = [
    'fixed z-[1200]',
    'rounded-st-1 bg-st-content-din p-st-1 text-st-body-small text-st-content-bright shadow-st-paper-3',
    'pointer-events-auto',
    "before:absolute before:content-['']",
    'before:border-[4px] before:border-solid before:border-transparent',
    panelClassName
  ]
    .filter(Boolean)
    .join(' ');

  const placementClass: Record<StTooltipPlacement, string> = {
    top: [
      'before:bottom-[-8px]',
      'before:left-1/2 before:-translate-x-1/2',
      'before:border-t-st-content-din'
    ].join(' '),
    bottom: [
      'before:top-[-8px]',
      'before:left-1/2 before:-translate-x-1/2',
      'before:border-b-st-content-din'
    ].join(' '),
    left: [
      'before:right-[-8px]',
      'before:top-1/2 before:-translate-y-1/2',
      'before:border-l-st-content-din'
    ].join(' '),
    right: [
      'before:left-[-8px]',
      'before:top-1/2 before:-translate-y-1/2',
      'before:border-r-st-content-din'
    ].join(' ')
  };

  const panel = [panelBase, placementClass[placement]]
    .filter(Boolean)
    .join(' ');

  return { root, trigger, panel };
};

export const calculateTooltipPosition = (args: {
  placement: StTooltipPlacement;
  triggerRect: DOMRect;
  panelRect: DOMRect;
  offset: number;
}): TooltipPosition => {
  const { placement, triggerRect, panelRect, offset } = args;

  const triggerCenterX = triggerRect.left + triggerRect.width / 2;
  const triggerCenterY = triggerRect.top + triggerRect.height / 2;

  let top = triggerRect.bottom + offset;
  let left = triggerCenterX - panelRect.width / 2;

  if (placement === 'top') {
    top = triggerRect.top - panelRect.height - offset;
    left = triggerCenterX - panelRect.width / 2;
  }

  if (placement === 'left') {
    top = triggerCenterY - panelRect.height / 2;
    left = triggerRect.left - panelRect.width - offset;
  }

  if (placement === 'right') {
    top = triggerCenterY - panelRect.height / 2;
    left = triggerRect.right + offset;
  }

  if (placement === 'bottom') {
    top = triggerRect.bottom + offset;
    left = triggerCenterX - panelRect.width / 2;
  }

  const maxLeft =
    globalThis.window.innerWidth - panelRect.width - VIEWPORT_PADDING;
  const maxTop =
    globalThis.window.innerHeight - panelRect.height - VIEWPORT_PADDING;

  return {
    top: clamp(top, VIEWPORT_PADDING, Math.max(VIEWPORT_PADDING, maxTop)),
    left: clamp(left, VIEWPORT_PADDING, Math.max(VIEWPORT_PADDING, maxLeft))
  };
};
