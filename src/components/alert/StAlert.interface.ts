import type { SizeValue } from '../../types';
import type { StToastStatus } from '../toasts/toast/StToast.interface';

/** Mesmos status semanticos do `StToast`. */
export type StAlertStatus = StToastStatus;

export interface AlertClassProps {
  status?: StAlertStatus;
  width?: SizeValue;
  hasTitle?: boolean;
  className?: string;
}

export interface StAlertProps {
  /** Titulo do alerta. */
  title?: string;
  /** Texto de apoio; o alerta cresce em altura conforme o conteudo. */
  description?: string;
  /** Status do alerta, na paleta semantica da lib. */
  status?: StAlertStatus;
  /** Sobrescreve o icone padrao do status. */
  icon?: string;
  /** Remove o icone do status. */
  hideIcon?: boolean;
  /** Renderiza o botao de fechar. */
  closable?: boolean;
  /** Rotulo do botao de fechar. */
  closeAriaLabel?: string;
  /**
   * Visibilidade (`v-model:open`). Sem a prop, o alerta controla o proprio
   * estado e some ao ser fechado.
   */
  open?: boolean;
  /** Largura do alerta, na mesma escala do `StPaper`. */
  width?: SizeValue;
  /** Classes extras no container. */
  className?: string;
}
