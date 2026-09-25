import type { StAlertStatus } from '../alert/StAlert.interface';

/** Status do `StAlert` mais as cores de marca. */
export type StBannerStatus = StAlertStatus | 'primary' | 'secondary';

export interface BannerClassProps {
  status?: StBannerStatus;
  hasIcon?: boolean;
  hasAction?: boolean;
  closable?: boolean;
  className?: string;
}

export interface StBannerProps {
  /** Frase do banner; o slot padrao tem prioridade. */
  text?: string;
  /** Status do banner, na paleta semantica da lib. */
  status?: StBannerStatus;
  /** Icone opcional a esquerda da frase. Sem a prop, nao ha icone. */
  icon?: string;
  /** Rotulo do botao de acao; o slot `action` tem prioridade. */
  actionLabel?: string;
  /** Renderiza o botao de fechar. */
  closable?: boolean;
  /** Rotulo do botao de fechar. */
  closeAriaLabel?: string;
  /**
   * Visibilidade (`v-model:open`). Sem a prop, o banner controla o proprio
   * estado e some ao ser fechado.
   */
  open?: boolean;
  /** Classes extras no container. */
  className?: string;
}
