import type { AlertClassProps, StAlertStatus } from './StAlert.interface';
import { sizeWidthClasses } from '../../utils/spacingShorthand';

export const ST_ALERT_DEFAULT_STATUS: StAlertStatus = 'info';

type AlertStatusTokens = {
  surface: string;
  border: string;
  content: string;
  icon: string;
};

const statusTokens: Record<StAlertStatus, AlertStatusTokens> = {
  info: {
    surface: 'bg-st-surface-info',
    border: 'border-st-content-info',
    content: 'text-st-content-info',
    icon: 'circle-info'
  },
  system: {
    surface: 'bg-st-surface-system',
    border: 'border-st-content-system',
    content: 'text-st-content-system',
    icon: 'gear'
  },
  warning: {
    surface: 'bg-st-surface-warning',
    border: 'border-st-content-warning',
    content: 'text-st-content-warning',
    icon: 'triangle-exclamation'
  },
  positive: {
    surface: 'bg-st-surface-positive',
    border: 'border-st-content-positive',
    content: 'text-st-content-positive',
    icon: 'circle-check'
  },
  negative: {
    surface: 'bg-st-surface-negative',
    border: 'border-st-content-negative',
    content: 'text-st-content-negative',
    icon: 'circle-xmark'
  }
};

/** Icone padrao de cada status. */
export const resolveAlertIcon = (
  status: StAlertStatus = ST_ALERT_DEFAULT_STATUS
) => statusTokens[status].icon;

/**
 * Erros e avisos interrompem a leitura (`alert`); os demais ficam como
 * informacao da pagina (`status`), sem roubar a vez do leitor de tela.
 */
export const resolveAlertRole = (
  status: StAlertStatus = ST_ALERT_DEFAULT_STATUS
): 'alert' | 'status' =>
  status === 'negative' || status === 'warning' ? 'alert' : 'status';

export const buildAlertClasses = (props: AlertClassProps) => {
  const {
    status = ST_ALERT_DEFAULT_STATUS,
    width = 'full',
    hasTitle = true,
    className
  } = props;

  const tokens = statusTokens[status];

  /**
   * Alerta fica no fluxo da pagina, entao nao tem sombra: a separacao vem da
   * superficie e da borda de 1px do status.
   */
  const container = [
    'flex max-w-full items-start gap-st-1 rounded-st-1 p-st-2',
    'border border-solid font-st-body',
    sizeWidthClasses[width],
    tokens.surface,
    tokens.border,
    className
  ]
    .filter(Boolean)
    .join(' ');

  /**
   * Icone e botao de fechar tem 16px e sao centralizados na primeira linha do
   * texto. Com titulo, a linha mede 28px (`text-st-body-medium`, leading 1.75):
   * (28 - 16) / 2 = 6px. So com descricao, 21px (`text-st-body-small`,
   * leading 1.5): (21 - 16) / 2 = 2.5px, arredondado para 3px.
   */
  const iconOffset = hasTitle ? 'mt-[6px]' : 'mt-[3px]';

  const icon = [iconOffset, 'shrink-0', tokens.content].join(' ');

  const texts = 'flex min-w-0 flex-1 flex-col gap-[2px]';

  const title = [
    'block break-words text-st-body-medium font-bold',
    tokens.content
  ].join(' ');

  const description =
    'block break-words text-st-body-small text-st-content-default';

  const close = [
    iconOffset,
    'inline-flex shrink-0 items-center cursor-pointer rounded-st-1 border-0 bg-transparent p-0',
    'transition-opacity duration-200 ease-out hover:opacity-70',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-st-focus',
    tokens.content
  ].join(' ');

  return { container, icon, texts, title, description, close };
};
