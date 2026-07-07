import type { OptionClassProps } from './StOption.interface';

export const buildOptionClasses = (props: OptionClassProps) => {
  const { selected = false, className } = props;

  const option = [
    'relative m-0 flex cursor-pointer appearance-none items-center justify-start gap-st-1 overflow-hidden rounded-st-2 border-0 p-st-1 text-left font-st-body text-st-body-small text-st-content-default select-none',
    'transition-colors duration-200 ease-in-out',
    selected
      ? 'bg-st-surface-3'
      : 'hover:bg-st-surface-2 active:bg-st-surface-3',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-st-focus focus-visible:ring-offset-2 focus-visible:ring-offset-st-surface-0',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const startAdornment = 'inline-flex shrink-0 text-st-content-primary';
  const content = 'min-w-0 flex-1';
  const endAdornment = 'inline-flex shrink-0 text-st-content-primary';

  return { option, startAdornment, content, endAdornment };
};
