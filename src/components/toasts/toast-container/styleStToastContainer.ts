import type {
  StToastContainerGap,
  StToastPosition,
  ToastContainerClassProps
} from './StToastContainer.interface';

export const ST_TOAST_DEFAULT_POSITION: StToastPosition = 'top-right';

/** Nas posicoes de baixo a pilha cresce para cima, mantendo o novo na borda. */
export const isBottomPosition = (position: StToastPosition) =>
  position.startsWith('bottom');

const positionClasses: Record<StToastPosition, string> = {
  'top-left': 'top-st-2 left-st-2 items-start',
  'top-center': 'top-st-2 left-1/2 -translate-x-1/2 items-center',
  'top-right': 'top-st-2 right-st-2 items-end',
  'bottom-left': 'bottom-st-2 left-st-2 items-start',
  'bottom-center': 'bottom-st-2 left-1/2 -translate-x-1/2 items-center',
  'bottom-right': 'bottom-st-2 right-st-2 items-end'
};

const gapClasses: Record<StToastContainerGap, string> = {
  1: 'gap-st-1',
  2: 'gap-st-2',
  3: 'gap-st-3'
};

export const buildToastContainerClasses = (props: ToastContainerClassProps) => {
  const { position = ST_TOAST_DEFAULT_POSITION, gap = 1, className } = props;

  const bottom = isBottomPosition(position);

  /** `pointer-events-none` no container deixa a pagina clicavel ao redor. */
  const container = [
    'pointer-events-none fixed z-[9999] flex max-w-full',
    bottom ? 'flex-col-reverse' : 'flex-col',
    gapClasses[gap],
    positionClasses[position],
    className
  ]
    .filter(Boolean)
    .join(' ');

  const item = 'pointer-events-auto';

  const enterActive =
    'transition-all duration-300 ease-out motion-reduce:transition-none';

  const enterFrom = [
    'opacity-0',
    bottom ? 'translate-y-[12px]' : 'translate-y-[-12px]'
  ].join(' ');

  const leaveActive = [
    'transition-all duration-200 ease-in motion-reduce:transition-none',
    'absolute'
  ].join(' ');

  const leaveTo = 'opacity-0 scale-95';

  const move = 'transition-transform duration-300 ease-out';

  return {
    container,
    item,
    enterActive,
    enterFrom,
    leaveActive,
    leaveTo,
    move
  };
};
