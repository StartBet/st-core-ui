import type {
  StAccordionSize,
  StAccordionSurface,
  StAccordionValue
} from '../accordion/StAccordion.interface';

export type StAccordionGroupModelValue =
  | StAccordionValue
  | StAccordionValue[]
  | null;

export type StAccordionGroupGap = 0 | 1 | 2 | 3;

export interface AccordionGroupClassProps {
  gap?: StAccordionGroupGap;
  className?: string;
}

export interface StAccordionGroupProps extends AccordionGroupClassProps {
  /** `true` permite varios itens abertos; `false` abre um de cada vez. */
  multiple?: boolean;
  /**
   * Itens abertos (`v-model`). `null` ou `[]` deixa tudo colapsado.
   * Com `multiple` o payload e um array; sem ele, um valor unico ou `null`.
   */
  modelValue?: StAccordionGroupModelValue;
  /** Escala herdada por todos os itens. */
  size?: StAccordionSize;
  /** Superficie do cabecalho herdada por todos os itens. */
  headerSurface?: StAccordionSurface;
  /** Superficie da area expansivel herdada por todos os itens. */
  contentSurface?: StAccordionSurface;
  /** Bloqueia todos os itens do grupo. */
  disabled?: boolean;
  /** Espaco entre os itens, na escala `st-*`. */
  gap?: StAccordionGroupGap;
  /** Rotulo do grupo. */
  ariaLabel?: string;
  /** Classes extras no container. */
  className?: string;
}
