import type { StToastStatus, ToastClassProps } from './StToast.interface';

export const ST_TOAST_DEFAULT_STATUS: StToastStatus = 'info';

type ToastStatusTokens = {
  surface: string;
  accent: string;
  content: string;
  icon: string;
};

const statusTokens: Record<StToastStatus, ToastStatusTokens> = {
  info: {
    surface: 'bg-st-surface-info',
    accent: 'border-l-st-content-info',
    content: 'text-st-content-info',
    icon: 'circle-info'
  },
  system: {
    surface: 'bg-st-surface-system',
    accent: 'border-l-st-content-system',
    content: 'text-st-content-system',
    icon: 'gear'
  },
  warning: {
    surface: 'bg-st-surface-warning',
    accent: 'border-l-st-content-warning',
    content: 'text-st-content-warning',
    icon: 'triangle-exclamation'
  },
  positive: {
    surface: 'bg-st-surface-positive',
    accent: 'border-l-st-content-positive',
    content: 'text-st-content-positive',
    icon: 'circle-check'
  },
  negative: {
    surface: 'bg-st-surface-negative',
    accent: 'border-l-st-content-negative',
    content: 'text-st-content-negative',
    icon: 'circle-xmark'
  }
};

/** Icone padrao de cada status. */
export const resolveToastIcon = (
  status: StToastStatus = ST_TOAST_DEFAULT_STATUS
) => statusTokens[status].icon;

/**
 * Erros e avisos interrompem a leitura (`alert`/`assertive`); os demais
 * esperam uma pausa natural do leitor de tela (`status`/`polite`).
 */
export const resolveToastRole = (
  status: StToastStatus = ST_TOAST_DEFAULT_STATUS
): { role: 'alert' | 'status'; ariaLive: 'assertive' | 'polite' } => {
  const assertive = status === 'negative' || status === 'warning';

  return {
    role: assertive ? 'alert' : 'status',
    ariaLive: assertive ? 'assertive' : 'polite'
  };
};

export const buildToastClasses = (props: ToastClassProps) => {
  const { status = ST_TOAST_DEFAULT_STATUS, className } = props;

  const tokens = statusTokens[status];

  /** Largura fixa de `st-48` (384px); a altura acompanha o conteudo. */
  const container = [
    'flex w-st-48 max-w-full items-start gap-st-1 rounded-st-1 p-st-2',
    'border-l-[4px] font-st-body shadow-st-paper-3',
    tokens.surface,
    tokens.accent,
    className
  ]
    .filter(Boolean)
    .join(' ');

  /**
   * Icone e botao de fechar tem 16px e sao centralizados na primeira linha do
   * titulo, que mede 28px (`text-st-body-medium` em `leading 1.75`):
   * (28 - 16) / 2 = 6px.
   */
  const iconOffset = 'mt-[6px]';

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
    // `inline-flex` faz o botao ter a altura exata do icone, e nao a da linha.
    'inline-flex shrink-0 items-center cursor-pointer rounded-st-1 border-0 bg-transparent p-0',
    'transition-opacity duration-200 ease-out hover:opacity-70',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-st-focus',
    tokens.content
  ].join(' ');

  return { container, icon, texts, title, description, close };
};
