import type {
  BulletsClassProps,
  StBulletsAlign,
  StBulletsSize
} from './StBullets.interface';

type BulletSizeTokens = {
  height: string;
  idleWidth: string;
  activeWidth: string;
};

const sizeTokens: Record<StBulletsSize, BulletSizeTokens> = {
  small: {
    height: 'h-[3px]',
    idleWidth: 'w-[6px]',
    activeWidth: 'w-[18px]'
  },
  medium: {
    height: 'h-[4px]',
    idleWidth: 'w-[8px]',
    activeWidth: 'w-[24px]'
  },
  large: {
    height: 'h-[6px]',
    idleWidth: 'w-[10px]',
    activeWidth: 'w-[32px]'
  }
};

const alignClasses: Record<StBulletsAlign, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end'
};

const gapClasses: Record<StBulletsSize, string> = {
  small: 'gap-[4px]',
  medium: 'gap-[6px]',
  large: 'gap-[8px]'
};

export const buildBulletsClasses = (props: BulletsClassProps) => {
  const {
    size = 'medium',
    align = 'center',
    interactive = true,
    className
  } = props;

  const tokens = sizeTokens[size];

  const container = [
    'flex w-full items-center',
    gapClasses[size],
    alignClasses[align],
    className
  ]
    .filter(Boolean)
    .join(' ');

  const bulletBase = [
    'block shrink-0 rounded-full border-0 p-0',
    tokens.height,
    'transition-[width,background-color] duration-200 ease-out',
    interactive
      ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-st-focus focus-visible:ring-offset-2 focus-visible:ring-offset-st-surface-0'
      : undefined
  ]
    .filter(Boolean)
    .join(' ');

  const bulletActive = [tokens.activeWidth, 'bg-st-secondary'].join(' ');

  const bulletIdle = [
    tokens.idleWidth,
    'bg-st-primary',
    interactive ? 'hover:bg-st-secondary' : undefined
  ]
    .filter(Boolean)
    .join(' ');

  return { container, bulletBase, bulletActive, bulletIdle };
};

export const resolveBulletState = (index: number, activeIndex: number) =>
  index === activeIndex ? 'active' : 'idle';
