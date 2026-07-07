export type StInputRef = {
  focus: () => void;
  blur: () => void;
  clear: () => void;
  setInvalidity: () => void;
  setValidity: () => void;
  reportValidity: () => void;
};

export type StInputType =
  | 'text'
  | 'password'
  | 'email'
  | 'search'
  | 'tel'
  | 'url'
  | 'number'
  | 'date'
  | 'datetime'
  | 'datetime-local'
  | 'month'
  | 'week'
  | 'time';

export type StInputMask = 'phone-br' | 'cpf';

export type StInputMode =
  | 'none'
  | 'text'
  | 'tel'
  | 'url'
  | 'email'
  | 'numeric'
  | 'decimal'
  | 'search';

export type StInputProps = {
  value?: string | number;
  defaultValue?: string | number;
  icon?: string;
  label?: string;
  type?: StInputType;
  mask?: StInputMask;
  messageInfo?: string;
  messageDanger?: string;
  messageSuccess?: string;
  name?: string;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  maxLength?: number;
  min?: string | number;
  max?: string | number;
  autoComplete?: string;
  required?: boolean;
  pattern?: string;
  inputMode?: StInputMode;
  className?: string;
};
