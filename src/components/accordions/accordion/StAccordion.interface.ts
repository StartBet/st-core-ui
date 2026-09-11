export type StAccordionSize = 'small' | 'medium' | 'large';

export type StAccordionSurface =
  | 'transparent'
  | 'surface-0'
  | 'surface-1'
  | 'surface-2'
  | 'surface-3'
  | 'surface-4'
  | 'surface-primary'
  | 'surface-secondary'
  | 'surface-info'
  | 'surface-system'
  | 'surface-warning'
  | 'surface-positive'
  | 'surface-negative';

export type StAccordionValue = string | number;

export interface AccordionClassProps {
  size?: StAccordionSize;
  headerSurface?: StAccordionSurface;
  contentSurface?: StAccordionSurface;
  open?: boolean;
  disabled?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export interface StAccordionProps {
  /** Titulo do cabecalho; o slot `title` tem prioridade. */
  title?: string;
  /** Icone opcional a esquerda do titulo (nome aceito pelo `StIcon`). */
  icon?: string;
  /** Identidade do item dentro de um `StAccordionGroup`. */
  value?: StAccordionValue;
  /** Estado aberto (`v-model`). Sem ele o item controla o proprio estado. */
  modelValue?: boolean;
  /** Abre o item na montagem quando nao ha `modelValue`. */
  defaultOpen?: boolean;
  /** Bloqueia a abertura e o fechamento. */
  disabled?: boolean;
  /** Escala do item; por padrao herda do grupo. */
  size?: StAccordionSize;
  /** Superficie do cabecalho; por padrao herda do grupo. */
  headerSurface?: StAccordionSurface;
  /** Superficie da area expansivel; por padrao herda do grupo. */
  contentSurface?: StAccordionSurface;
  /** Icone indicador de expansao. */
  expandIcon?: string;
  /** Remove o icone indicador de expansao. */
  hideExpandIcon?: boolean;
  /** Classes extras no container. */
  className?: string;
  /** Classes extras no cabecalho. */
  headerClassName?: string;
  /** Classes extras na area expansivel. */
  contentClassName?: string;
}

export interface StAccordionContext {
  multiple: boolean;
  size?: StAccordionSize;
  headerSurface?: StAccordionSurface;
  contentSurface?: StAccordionSurface;
  disabled: boolean;
  isOpen: (value: StAccordionValue) => boolean;
  toggle: (value: StAccordionValue) => void;
  requestDefaultOpen: (value: StAccordionValue) => void;
}
