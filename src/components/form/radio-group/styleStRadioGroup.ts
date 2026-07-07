import type { InjectionKey } from 'vue';

import type {
  StRadioGroupContext,
  StRadioGroupOrientation,
  StRadioGroupProps
} from './StRadioGroup.interface';

export const radioGroupContextKey: InjectionKey<StRadioGroupContext> =
  Symbol('StRadioGroup');

export const buildRadioGroupClasses = (
  props: Pick<StRadioGroupProps, 'orientation' | 'dense' | 'className'>
) => {
  const { orientation = 'vertical', dense = false, className } = props;

  const base = 'flex';
  const orientationClasses: Record<StRadioGroupOrientation, string> = {
    vertical: 'flex-col items-start gap-st-2',
    horizontal: 'flex-row flex-wrap items-center gap-st-3'
  };

  return [
    base,
    orientationClasses[orientation],
    dense ? 'gap-st-1' : undefined,
    className
  ]
    .filter(Boolean)
    .join(' ');
};
