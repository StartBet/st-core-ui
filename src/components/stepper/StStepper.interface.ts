import type { StTooltipPlacement } from '../tooltip/StTooltip.interface';

export type StStepperOrientation = 'horizontal' | 'vertical';

export type StStepperSize = 'small' | 'medium';

export type StStepperVariant =
  | 'primary'
  | 'secondary'
  | 'info'
  | 'system'
  | 'warning'
  | 'positive'
  | 'negative';

export type StStepperState = 'completed' | 'active' | 'upcoming';

export type StStepperTone = 'variant' | 'muted' | 'idle';

export interface StStepperStep {
  /** Titulo exibido ao lado (vertical) ou abaixo (horizontal) do bullet. */
  title: string;
  /** Texto de apoio: tooltip na horizontal e texto corrido na vertical. */
  description?: string;
  /** Conteudo do bullet; sobrescreve a posicao numerica. */
  label?: string;
  /** Icone do bullet (nome aceito pelo `StIcon`); tem prioridade sobre `label`. */
  icon?: string;
  /** Cor de feedback exclusiva do passo (ex.: `negative` para erro). */
  variant?: StStepperVariant;
  /** Bloqueia a selecao do passo. */
  disabled?: boolean;
}

export interface StepperClassProps {
  orientation?: StStepperOrientation;
  className?: string;
}

export interface StepperStepClassProps {
  orientation?: StStepperOrientation;
  size?: StStepperSize;
  tone: StStepperTone;
  variant?: StStepperVariant;
  interactive?: boolean;
  disabled?: boolean;
  stepClassName?: string;
}

export interface StStepperProps extends StepperClassProps {
  /** Passos renderizados na ordem informada. */
  steps: StStepperStep[];
  /** Indice do passo ativo (`v-model`), iniciando em `0`. */
  modelValue?: number;
  /** Cor de feedback do passo ativo. */
  variant?: StStepperVariant;
  /** Orientacao do stepper. */
  orientation?: StStepperOrientation;
  /** Escala do bullet e das fontes. */
  size?: StStepperSize;
  /** `false` deixa o stepper apenas visual, sem navegacao nem status. */
  interactive?: boolean;
  /** Icone exibido nos passos concluidos; `''` mantem a posicao numerica. */
  completedIcon?: string;
  /** Posicao do tooltip de descricao na orientacao horizontal. */
  tooltipPlacement?: StTooltipPlacement;
  /** Rotulo do grupo de passos. */
  ariaLabel?: string;
  /** Classes extras em cada passo. */
  stepClassName?: string;
}

export interface StStepperBulletContent {
  icon?: string;
  label?: string;
}

export interface StStepperRenderStep extends StStepperStep {
  index: number;
  position: number;
  state: StStepperState;
  tone: StStepperTone;
  isCurrent: boolean;
  isFirst: boolean;
  isLast: boolean;
  isSelectable: boolean;
  hasTooltip: boolean;
  hasInlineDescription: boolean;
  bulletIcon?: string;
  bulletLabel?: string;
  leadingDone: boolean;
  trailingDone: boolean;
}
