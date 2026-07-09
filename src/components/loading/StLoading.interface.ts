export type StLoadingVariant = 'primary' | 'secondary' | 'tertiary';

export type StLoadingType = 'arrow' | 'cyclical' | 'spinner';

type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

export type StLoadingValue = Enumerate<101>;

export type StLoadingSize = '3' | '4' | '6' | '8';

export interface StLoadingProps {
  type?: StLoadingType;
  variant?: StLoadingVariant;
  size?: StLoadingSize;
  value?: StLoadingValue;
  className?: string;
}
