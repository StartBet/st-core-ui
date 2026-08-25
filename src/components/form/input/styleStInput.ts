import {
  buildFieldIconClasses,
  buildFieldMessageClasses,
  getFieldBorderClass,
  resolveFieldState
} from '../fieldState';
import type { StInputProps } from './StInput.interface';

export const buildInputClasses = (props: {
  disabled?: boolean;
  isValid?: boolean;
  hasIcon?: boolean;
  hasCounter?: boolean;
  hasSuccess?: boolean;
  className?: string;
}) => {
  const {
    disabled = false,
    isValid = true,
    hasIcon = false,
    hasCounter = false,
    hasSuccess = false,
    className
  } = props;

  const state = resolveFieldState({ disabled, isValid, hasSuccess });

  const wrapper = 'flex flex-col gap-st-1';

  const label = [
    'font-st-body text-st-body-small',
    'text-st-content-default'
  ].join(' ');

  const inputContainer = 'relative';

  const iconContainer = buildFieldIconClasses(state);

  const inputBase = [
    'h-st-6 w-full rounded-full border bg-st-surface-0 px-st-2 text-st-content-default',
    hasIcon ? 'pl-st-6' : undefined,
    hasCounter ? 'pr-st-5' : undefined,
    'outline-none transition-[border-color,box-shadow] duration-200 ease-in-out',
    'placeholder:text-st-content-ghost',
    'focus:border-st-content-primary focus:ring-2 focus:ring-st-focus focus:ring-offset-2 focus:ring-offset-st-surface-0',
    disabled
      ? 'cursor-not-allowed bg-st-surface-3 text-st-content-disable'
      : undefined,
    getFieldBorderClass(state),
    className
  ]
    .filter(Boolean)
    .join(' ');

  const { messageInfo, messageDanger, messageSuccess } =
    buildFieldMessageClasses();

  const counterBase = [
    'pointer-events-none absolute right-st-2 top-1/2 -translate-y-1/2',
    'text-st-xs text-st-content-ghost'
  ].join(' ');

  const counterWarn = [counterBase, 'text-st-content-warning'].join(' ');
  const counterNegative = [counterBase, 'text-st-content-negative'].join(' ');

  return {
    state,
    wrapper,
    label,
    inputContainer,
    iconContainer,
    input: inputBase,
    messageInfo,
    messageDanger,
    messageSuccess,
    counterBase,
    counterWarn,
    counterNegative
  };
};

export const getCounterClassName = (
  maxLength: number,
  charCount: number,
  classes: ReturnType<typeof buildInputClasses>
) => {
  const remaining = Math.max(0, maxLength - charCount);
  if (remaining === 0) return classes.counterNegative;
  if (remaining <= 3) return classes.counterWarn;
  return classes.counterBase;
};

export const resolveInputType = (type: StInputProps['type']) =>
  type === 'datetime' ? 'datetime-local' : (type ?? 'text');
