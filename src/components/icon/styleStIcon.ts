import type { StIconSize } from './StIcon.interface';

const sizeClasses: Record<StIconSize, string> = {
  1: 'w-st-xs h-st-xs',
  2: 'w-st-sm h-st-sm',
  3: 'w-st-base h-st-base',
  4: 'w-st-md h-st-md',
  5: 'w-st-lg h-st-lg',
  6: 'w-st-xl h-st-xl',
  7: 'w-st-2xl h-st-2xl',
  8: 'w-st-3xl h-st-3xl',
  9: 'w-st-4xl h-st-4xl',
  10: 'w-st-5xl h-st-5xl',
  11: 'w-st-6xl h-st-6xl',
  12: 'w-st-7xl h-st-7xl'
};

export const buildIconClasses = (props: {
  size?: StIconSize;
  className?: string;
}) => {
  const { size, className } = props;

  const container = [
    'inline-flex shrink-0 items-center justify-center overflow-hidden leading-none',
    size ? sizeClasses[size] : 'w-st-base h-st-base',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const glyph = ['block text-current', 'h-[90%] w-[90%]'].join(' ');

  return { container, glyph };
};
