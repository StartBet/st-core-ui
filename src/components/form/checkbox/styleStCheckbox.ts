import type { StCheckboxProps } from './StCheckbox.interface';

export const buildCheckboxClasses = (props: StCheckboxProps) => {
  const { disabled = false, className } = props;

  const wrapper = [
    'relative inline-flex items-center gap-st-1 select-none text-st-content-default',
    disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const input = 'pointer-events-none absolute m-0 h-px w-px opacity-0 peer';

  const control = [
    'inline-flex h-st-2 w-st-2 shrink-0 items-center justify-center rounded-[4px] border border-st-border-1 bg-st-surface-0',
    'transition-[border-color,box-shadow,background-color] duration-200 ease-in-out',
    'peer-focus-visible:border-st-focus peer-focus-visible:ring-2 peer-focus-visible:ring-st-focus peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-st-surface-0',
    'peer-checked:[&>span]:scale-100'
  ].join(' ');

  const mark = [
    'h-[8px] w-[5px] -translate-x-px -translate-y-px rotate-45 scale-0 border-b-[3px] border-r-[3px] border-current border-solid',
    'text-st-content-primary transition-transform duration-150 ease-in-out'
  ].join(' ');

  const label = 'font-st-body text-st-body-small';

  return { wrapper, input, control, mark, label };
};
