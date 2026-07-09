import type { StDropdownPlacement } from '../../dropdown/StDropdown.interface';

export type StSelectValue = string | number;

export type StSelectOptionItem = {
  name: string;
  value: StSelectValue;
};

export type StSelectRef = {
  focus: () => void;
  blur: () => void;
  clear: () => void;
  setInvalidity: () => void;
  setValidity: () => void;
  reportValidity: () => void;
};

export type StSelectProps = {
  value?: StSelectValue;
  defaultValue?: StSelectValue;
  onValueChange?: (value: StSelectValue) => void;
  options?: StSelectOptionItem[];
  icon?: string;
  label?: string;
  placeholder?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  messageInfo?: string;
  messageDanger?: string;
  messageSuccess?: string;
  className?: string;
  panelClassName?: string;
  placement?: StDropdownPlacement;
  offset?: number;
  closeOnSelect?: boolean;
};

export type SelectClassProps = Pick<
  StSelectProps,
  'className' | 'panelClassName' | 'required' | 'disabled' | 'readOnly'
> & {
  hasIcon: boolean;
  isOpen: boolean;
  isValid: boolean;
  hasValue: boolean;
};
