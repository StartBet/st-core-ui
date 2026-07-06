import type {
  ButtonColor,
  ButtonSize,
  ButtonVariant
} from '../button/StButton.interface';

export type StButtonGroupOrientation = 'horizontal' | 'vertical';

export type StButtonGroupValue = string | string[];

export interface ButtonGroupClassProps {
  className?: string;
  orientation?: StButtonGroupOrientation;
}

export interface ButtonGroupProps {
  value?: StButtonGroupValue;
  defaultValue?: StButtonGroupValue;
  onValueChange?: (value: StButtonGroupValue) => void;
  multiple?: boolean;
  orientation?: StButtonGroupOrientation;
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  disabled?: boolean;
  className?: string;
}
