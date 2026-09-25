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

const stateIconColor: Record<StFieldState, string> = {
  default: 'text-st-secondary',
  error: 'text-st-content-negative',
  success: 'text-st-content-positive',
  disabled: 'text-st-content-ghost'
};

export const buildFieldBareIconClasses = (state: StFieldState) =>
  [
    'pointer-events-none absolute left-st-xs top-1/2 flex -translate-y-1/2 items-center justify-center',
    stateIconColor[state]
  ].join(' ');

export const buildFieldMessageClasses = () => {
  const base = 'inline-flex items-center gap-st-1 text-st-xs';

  return {
    messageInfo: [base, 'text-st-content-info'].join(' '),
    messageDanger: [base, 'text-st-content-negative'].join(' '),
    messageSuccess: [base, 'text-st-content-positive'].join(' ')
  };
};
