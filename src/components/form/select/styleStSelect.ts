import { isVNode } from 'vue';

import type { SelectClassProps } from './StSelect.interface';

export const extractText = (node: unknown): string => {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('').trim();
  if (isVNode(node)) return extractText(node.children);
  if (node && typeof node === 'object') {
    const maybeChildren = (node as { children?: unknown }).children;
    if (maybeChildren !== undefined) return extractText(maybeChildren);
  }
  return '';
};

export const buildSelectClasses = (props: SelectClassProps) => {
  const {
    className,
    panelClassName,
    hasIcon,
    isOpen,
    isValid,
    disabled = false
  } = props;

  const wrapper = ['flex flex-col gap-st-1', className]
    .filter(Boolean)
    .join(' ');
  const label = [
    'font-st-body text-st-body-small',
    'text-st-content-default'
  ].join(' ');

  const dropdownRoot = 'block w-full';
  const dropdownPanel = [
    'w-full max-h-[280px] overflow-auto p-st-1',
    panelClassName
  ]
    .filter(Boolean)
    .join(' ');

  const trigger = [
    'relative flex h-st-6 w-full items-center gap-st-2 rounded-st-1 border bg-st-surface-0 px-st-2 text-left text-st-content-default outline-none',
    hasIcon ? 'pl-st-6' : undefined,
    'transition-[border-color,box-shadow] duration-200 ease-in-out',
    'focus-visible:border-st-content-primary focus-visible:ring-2 focus-visible:ring-st-focus focus-visible:ring-offset-2 focus-visible:ring-offset-st-surface-0',
    disabled
      ? 'cursor-not-allowed border-st-border-2 bg-st-surface-3 text-st-content-disable'
      : 'border-st-border-2',
    !disabled && isValid === false ? 'border-st-negative' : undefined
  ]
    .filter(Boolean)
    .join(' ');

  const iconContainer = [
    'absolute inset-st-1 flex w-st-4 items-center justify-center rounded-st-1',
    'bg-st-primary text-st-secondary'
  ].join(' ');

  const value =
    'flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap';
  const placeholder = 'text-st-content-ghost';

  const chevron = [
    'shrink-0 text-st-content-ghost transition-transform duration-200 ease-in-out',
    isOpen ? 'rotate-180' : 'rotate-0'
  ].join(' ');

  const options = 'grid';
  const optionActive = 'bg-st-surface-2';

  const messageBase = ['inline-flex items-center gap-st-1', 'text-st-xs'].join(
    ' '
  );
  const messageInfo = [messageBase, 'text-st-content-info'].join(' ');
  const messageDanger = [messageBase, 'text-st-content-negative'].join(' ');
  const messageSuccess = [messageBase, 'text-st-content-positive'].join(' ');

  return {
    wrapper,
    label,
    dropdownRoot,
    dropdownPanel,
    trigger,
    iconContainer,
    value,
    placeholder,
    chevron,
    options,
    optionActive,
    messageInfo,
    messageDanger,
    messageSuccess
  };
};
