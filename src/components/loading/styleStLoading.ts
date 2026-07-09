import type {
  StLoadingSize,
  StLoadingType,
  StLoadingVariant
} from './StLoading.interface';

export const buildStLoadingClasses = (props: {
  type?: StLoadingType;
  variant?: StLoadingVariant;
  size?: StLoadingSize;
  className?: string;
}) => {
  const { type = 'arrow', size = '8', className } = props;

  const sizeBySize: Record<StLoadingSize, string> = {
    '3': 'h-st-3 w-st-3',
    '4': 'h-st-4 w-st-4',
    '6': 'h-st-6 w-st-6',
    '8': 'h-st-8 w-st-8'
  };

  const arrowSizeByContainer: Record<StLoadingSize, string> = {
    '3': 'h-st-1 w-st-1',
    '4': 'h-st-1 w-st-1',
    '6': 'h-st-2 w-st-2',
    '8': 'h-st-3 w-st-3'
  };

  const arrow = [
    'absolute inset-0 m-auto z-[2]',
    arrowSizeByContainer[size],
    type === 'arrow'
      ? 'animate-st-loading-arrow drop-shadow-[-2px_2px_0px_var(--st-shadow-scale-800)]'
      : undefined
  ]
    .filter(Boolean)
    .join(' ');

  const spinner = [
    'absolute inset-st-1 m-auto z-[2] aspect-square rounded-full border-[2px] border-solid border-current',
    'animate-st-spinner-infinite',
    'drop-shadow-[0px_0px_4px_var(--st-light-scale-950)]'
  ].join(' ');

  const cyclical = [
    'absolute inset-st-1 z-[2] -rotate-90',
    'drop-shadow-[0px_0px_4px_var(--st-light-scale-950)]'
  ].join(' ');

  const content = [
    'relative overflow-hidden rounded-full',
    sizeBySize[size],
    'before:absolute before:inset-0 before:z-[1] before:rounded-full before:mix-blend-luminosity',
    'before:bg-[linear-gradient(225deg,_var(--st-shadow-scale-800)_0%,_var(--st-light-scale-800)_100%)]',
    'after:absolute after:inset-[4px] after:z-[3] after:rounded-full after:mix-blend-plus-lighter',
    'after:bg-[linear-gradient(225deg,_var(--st-light-scale-800)_0%,_transparent_75%)]',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return { spinner, cyclical, content, arrow };
};
