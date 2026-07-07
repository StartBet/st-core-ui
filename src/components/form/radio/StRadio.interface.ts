export type StRadioProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  label?: string;
  className?: string;
};

export type RadioClassProps = Pick<StRadioProps, 'disabled' | 'className'>;
