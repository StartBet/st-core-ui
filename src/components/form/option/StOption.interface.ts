export type StOptionProps = {
  value?: string | number;
  selected?: boolean;
  className?: string;
  onClick?: () => void;
};

export type OptionClassProps = Pick<StOptionProps, 'selected' | 'className'>;
