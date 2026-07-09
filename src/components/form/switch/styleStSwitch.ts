import type { StSwitchProps } from './StSwitch.interface';

export const buildSwitchClasses = (props: StSwitchProps) => {
  const { disabled = false, className } = props;

  const wrapper = [
    'relative inline-flex items-center gap-st-1 select-none text-st-content-default',
    disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const input = 'pointer-events-none absolute m-0 h-px w-px opacity-0 peer';

  const track = [
    'relative inline-flex h-[32px] w-[56px] shrink-0 items-center justify-start rounded-full bg-st-surface-3 p-[3px]',
    'transition-[background-color,border-color,box-shadow] duration-200 ease-in-out',
    'peer-checked:border-st-secondary peer-checked:bg-st-secondary',
    'peer-checked:[&_[data-switch-thumb]]:translate-x-[24px]',
    'peer-checked:[&_[data-switch-icon-off]]:text-st-primary',
    'peer-checked:[&_[data-switch-icon-on]]:text-st-surface-0',
    'peer-focus-visible:border-st-focus peer-focus-visible:bg-st-content-primary',
    'peer-focus-visible:ring-2 peer-focus-visible:ring-st-focus peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-st-surface-0'
  ].join(' ');

  const thumb = [
    'absolute left-[4px] top-1/2 h-[24px] w-[24px] -translate-y-1/2 rounded-full bg-st-content-primary shadow-sm',
    'transition-transform duration-200 ease-in-out'
  ].join(' ');

  const iconBase = [
    'absolute top-1/2 z-[2] inline-flex -translate-y-1/2 items-center justify-center',
    'pointer-events-none transition-[opacity,transform,color] duration-200 ease-in-out'
  ].join(' ');

  const iconOff = [iconBase, 'left-[9px] text-st-surface-0'].join(' ');
  const iconOn = [iconBase, 'right-[9px] text-st-content-primary'].join(' ');

  const label = 'font-st-body text-st-body-small';

  return { wrapper, input, track, thumb, iconOff, iconOn, label };
};
