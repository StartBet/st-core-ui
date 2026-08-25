import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBan,
  faCheck,
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faXmark
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faBan,
  faCheck,
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faXmark
);

export type StFieldState = 'default' | 'error' | 'success' | 'disabled';

const stateIcon: Record<StFieldState, string | undefined> = {
  default: undefined,
  error: 'xmark',
  success: 'check',
  disabled: 'ban'
};

const stateBorder: Record<StFieldState, string> = {
  default: 'border-st-border-2',
  error: 'border-st-negative',
  success: 'border-st-positive',
  disabled: 'border-st-border-2'
};

const stateIconContainer: Record<StFieldState, string> = {
  default: 'bg-st-primary text-st-secondary',
  error: 'bg-st-surface-negative text-st-content-negative',
  success: 'bg-st-surface-positive text-st-content-positive',
  disabled: 'bg-st-surface-1 text-st-content-ghost'
};

export const fieldMessageIcon = {
  info: 'circle-info',
  danger: 'circle-exclamation',
  success: 'circle-check'
} as const;

export const resolveFieldState = (props: {
  disabled?: boolean;
  isValid?: boolean;
  hasSuccess?: boolean;
}): StFieldState => {
  if (props.disabled) return 'disabled';
  if (props.isValid === false) return 'error';
  if (props.hasSuccess) return 'success';
  return 'default';
};

export const resolveFieldIcon = (state: StFieldState, icon?: string) =>
  stateIcon[state] ?? icon;

export const getFieldBorderClass = (state: StFieldState) => stateBorder[state];

export const buildFieldIconClasses = (state: StFieldState) =>
  [
    'absolute inset-st-1 flex w-st-4 items-center justify-center rounded-full',
    stateIconContainer[state]
  ].join(' ');

export const buildFieldMessageClasses = () => {
  const base = 'inline-flex items-center gap-st-1 text-st-xs';

  return {
    messageInfo: [base, 'text-st-content-info'].join(' '),
    messageDanger: [base, 'text-st-content-negative'].join(' '),
    messageSuccess: [base, 'text-st-content-positive'].join(' ')
  };
};
