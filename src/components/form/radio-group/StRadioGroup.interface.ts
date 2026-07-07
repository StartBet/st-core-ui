export type StRadioGroupOrientation = 'vertical' | 'horizontal';

export type StRadioGroupProps = {
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  dense?: boolean;
  orientation?: StRadioGroupOrientation;
  className?: string;
};

export type StRadioGroupContext = {
  name: { value: string };
  value: { value: string | undefined };
  disabled: { value: boolean };
};
