import type { RadioClassProps } from './StRadio.interface';

export const buildRadioClasses = (props: RadioClassProps) => {
  const { disabled = false, className } = props;

  const wrapper = [
    'inline-flex items-center gap-st-1 select-none text-st-content-default',
    disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const input = 'pointer-events-none absolute m-0 h-px w-px opacity-0 peer';

  const control = [
    'inline-flex h-st-2 w-st-2 items-center justify-center rounded-full border border-st-border-2 bg-st-surface-0',
    'transition-[border-color,box-shadow,background-color] duration-200 ease-in-out',
    'peer-focus-visible:border-st-focus peer-focus-visible:ring-2 peer-focus-visible:ring-st-focus peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-st-surface-0',
    'peer-checked:[&>span]:scale-100'
  ].join(' ');

  const dot = [
    'h-st-1 w-st-1 scale-0 rounded-full bg-st-content-primary',
    'transition-transform duration-150 ease-in-out'
  ].join(' ');

  const label = 'font-st-body text-st-body-small';

  return { wrapper, input, control, dot, label };
};
