import type {
  StepperClassProps,
  StepperStepClassProps,
  StStepperBulletContent,
  StStepperOrientation,
  StStepperSize,
  StStepperState,
  StStepperStep,
  StStepperTone,
  StStepperVariant
} from './StStepper.interface';
import type { StIconSize } from '../icon/StIcon.interface';

export const ST_STEPPER_FIRST_INDEX = 0;

export const ST_STEPPER_COMPLETED_ICON = 'check';

export const clampStepIndex = (index: number | undefined, total: number) => {
  if (total <= 0) return ST_STEPPER_FIRST_INDEX;

  if (typeof index !== 'number' || Number.isNaN(index)) {
    return ST_STEPPER_FIRST_INDEX;
  }

  const rounded = Math.trunc(index);

  if (rounded < ST_STEPPER_FIRST_INDEX) return ST_STEPPER_FIRST_INDEX;
  if (rounded > total - 1) return total - 1;

  return rounded;
};

export const resolveStepState = (
  index: number,
  activeIndex: number
): StStepperState => {
  if (index < activeIndex) return 'completed';
  if (index === activeIndex) return 'active';

  return 'upcoming';
};

export const resolveStepTone = (
  state: StStepperState,
  hasOwnVariant = false,
  interactive = true
): StStepperTone => {
  if (!interactive || hasOwnVariant || state === 'active') return 'variant';
  if (state === 'completed') return 'muted';

  return 'idle';
};

export const resolveStepBulletContent = (args: {
  step: StStepperStep;
  state: StStepperState;
  position: number;
  size?: StStepperSize;
  interactive?: boolean;
  completedIcon?: string;
}): StStepperBulletContent => {
  const {
    step,
    state,
    position,
    size = 'medium',
    interactive = true,
    completedIcon = ST_STEPPER_COMPLETED_ICON
  } = args;

  if (size === 'small') return {};

  if (step.icon) return { icon: step.icon };

  if (interactive && state === 'completed' && completedIcon) {
    return { icon: completedIcon };
  }

  if (step.label) return { label: step.label };

  return { label: String(position) };
};

type StepperSizeTokens = {
  bullet: string;
  icon: StIconSize;
  text: string;
  horizontalGap: string;
  verticalGap: string;
  verticalStepGap: string;
  verticalTextGap: string;
  verticalBulletOffset: string;
  verticalTextOffset: string;
  connectorHorizontal: string;
  connectorVertical: string;
};

const sizeTokens: Record<StStepperSize, StepperSizeTokens> = {
  small: {
    bullet: 'h-st-1 w-st-1',
    icon: 2,
    text: 'text-st-xs',
    horizontalGap: 'gap-[4px]',
    verticalGap: 'gap-st-1',
    verticalStepGap: 'pb-st-1',
    verticalTextGap: 'gap-[2px]',
    verticalBulletOffset: 'mt-[5px]',
    verticalTextOffset: 'pt-0',
    connectorHorizontal: 'top-[3px]',
    connectorVertical: 'bottom-[-5px] left-[3px] top-[13px]'
  },
  medium: {
    bullet: 'h-st-4 w-st-4',
    icon: 3,
    text: 'text-st-base',
    horizontalGap: 'gap-st-1',
    verticalGap: 'gap-st-2',
    verticalStepGap: 'pb-st-3',
    verticalTextGap: 'gap-[4px]',
    verticalBulletOffset: 'mt-0',
    verticalTextOffset: 'pt-[4px]',
    connectorHorizontal: 'top-[15px]',
    connectorVertical: 'bottom-0 left-[15px] top-st-4'
  }
};

export const resolveStepperIconSize = (
  size: StStepperSize = 'medium'
): StIconSize => sizeTokens[size].icon;

const bulletVariantClasses: Record<StStepperVariant, string> = {
  primary: 'bg-st-primary text-st-content-bright',
  secondary: 'bg-st-secondary text-st-content-din',
  info: 'bg-st-info text-st-content-bright',
  system: 'bg-st-system text-st-content-bright',
  warning: 'bg-st-warning text-st-content-din',
  positive: 'bg-st-positive text-st-content-din',
  negative: 'bg-st-negative text-st-content-bright'
};

const titleVariantClasses: Record<StStepperVariant, string> = {
  primary: 'text-st-content-primary',
  secondary: 'text-st-content-secondary',
  info: 'text-st-content-info',
  system: 'text-st-content-system',
  warning: 'text-st-content-warning',
  positive: 'text-st-content-positive',
  negative: 'text-st-content-negative'
};

const rootOrientationClasses: Record<StStepperOrientation, string> = {
  horizontal: 'flex-row items-start',
  vertical: 'flex-col'
};

export const buildStepperClasses = (props: StepperClassProps) => {
  const { orientation = 'horizontal', className } = props;

  const root = [
    '!m-0 flex w-full list-none p-0 font-st-body',
    rootOrientationClasses[orientation],
    className
  ]
    .filter(Boolean)
    .join(' ');

  return { root };
};

export const buildStepperStepClasses = (props: StepperStepClassProps) => {
  const {
    orientation = 'horizontal',
    size = 'medium',
    tone,
    variant = 'primary',
    interactive = true,
    disabled = false,
    stepClassName
  } = props;

  const isHorizontal = orientation === 'horizontal';
  const tokens = sizeTokens[size];

  const item = [
    'relative flex min-w-0',
    isHorizontal
      ? 'flex-1 flex-col items-center px-[2px]'
      : `flex-col last:pb-0 ${tokens.verticalStepGap}`,
    stepClassName
  ]
    .filter(Boolean)
    .join(' ');

  const tooltipRoot = ['w-full', isHorizontal ? 'justify-center' : undefined]
    .filter(Boolean)
    .join(' ');

  const trigger = 'w-full';

  const content = [
    'relative z-[1] m-0 flex w-full rounded-st-1 border-0 bg-transparent p-0',
    'transition-colors duration-200 ease-out',
    isHorizontal
      ? `flex-col items-center text-center ${tokens.horizontalGap}`
      : `flex-row items-start text-left ${tokens.verticalGap}`,
    interactive && !disabled
      ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-st-focus focus-visible:ring-offset-2 focus-visible:ring-offset-st-surface-0'
      : undefined,
    interactive && disabled ? 'cursor-not-allowed opacity-60' : undefined,
    interactive ? undefined : 'cursor-default'
  ]
    .filter(Boolean)
    .join(' ');

  const bulletToneClasses: Record<StStepperTone, string> = {
    variant: `border-transparent ${bulletVariantClasses[variant]}`,
    muted: 'border-transparent bg-st-content-disable text-st-surface-0',
    idle: 'border-st-border-2 bg-st-surface-2 text-st-content-ghost'
  };

  const bullet = [
    'relative z-[1] flex shrink-0 items-center justify-center rounded-full border',
    'font-bold leading-none transition-colors duration-200 ease-out',
    tokens.bullet,
    tokens.text,
    isHorizontal ? undefined : tokens.verticalBulletOffset,
    bulletToneClasses[tone]
  ]
    .filter(Boolean)
    .join(' ');

  const titleToneClasses: Record<StStepperTone, string> = {
    variant: `font-bold ${titleVariantClasses[variant]}`,
    muted: 'font-normal text-st-content-disable',
    idle: 'font-normal text-st-content-ghost'
  };

  const texts = [
    'flex min-w-0 flex-col',
    isHorizontal
      ? 'items-center gap-0'
      : `items-start ${tokens.verticalTextGap} ${tokens.verticalTextOffset}`
  ].join(' ');

  const title = [
    'block leading-st-normal transition-colors duration-200 ease-out',
    tokens.text,
    titleToneClasses[tone]
  ].join(' ');

  const descriptionToneClasses: Record<StStepperTone, string> = {
    variant: 'text-st-content-default',
    muted: 'text-st-content-disable',
    idle: 'text-st-content-ghost'
  };

  const description = [
    'block font-normal leading-st-normal',
    tokens.text,
    descriptionToneClasses[tone]
  ].join(' ');

  const connectorBase = [
    'absolute z-0 rounded-full transition-colors duration-200 ease-out',
    isHorizontal
      ? `h-[2px] w-1/2 ${tokens.connectorHorizontal}`
      : `w-[2px] ${tokens.connectorVertical}`
  ].join(' ');

  const connectorLeading = [connectorBase, isHorizontal ? 'left-0' : undefined]
    .filter(Boolean)
    .join(' ');

  const connectorTrailing = [
    connectorBase,
    isHorizontal ? 'right-0' : undefined
  ]
    .filter(Boolean)
    .join(' ');

  const connectorDone = 'bg-st-content-disable';
  const connectorPending = 'bg-st-border-2';

  const tooltipPanel = ['max-w-st-56 font-normal', tokens.text].join(' ');

  return {
    item,
    tooltipRoot,
    trigger,
    content,
    bullet,
    texts,
    title,
    description,
    connectorLeading,
    connectorTrailing,
    connectorDone,
    connectorPending,
    tooltipPanel
  };
};
