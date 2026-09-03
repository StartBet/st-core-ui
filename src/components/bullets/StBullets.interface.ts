export type StBulletsSize = 'small' | 'medium' | 'large';

export type StBulletsAlign = 'left' | 'center' | 'right';

export interface BulletsClassProps {
  size?: StBulletsSize;
  align?: StBulletsAlign;
  interactive?: boolean;
  className?: string;
}

export interface StBulletsProps extends BulletsClassProps {
  /** Quantidade de bullets renderizados. */
  total: number;
  /** Indice ativo (`v-model`). */
  modelValue?: number;
  /** Rotulo do grupo de navegacao. */
  ariaLabel?: string;
  /** Rotulo de cada bullet; recebe o indice iniciado em 1. */
  itemAriaLabel?: (position: number, total: number) => string;
}
