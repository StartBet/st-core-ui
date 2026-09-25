import type { BannerClassProps, StBannerStatus } from './StBanner.interface';
import type { ButtonColor } from '../buttons/button/StButton.interface';

export const ST_BANNER_DEFAULT_STATUS: StBannerStatus = 'info';

type BannerStatusTokens = {
  surface: string;
  content: string;
  /** Circulo do icone, com as cores invertidas de novo: volta ao par do alerta. */
  iconBadge: string;
  action: ButtonColor;
};

/**
 * Cores invertidas em relacao ao `StAlert`: o fundo e o `content` do status e
 * a frase usa a `surface`, entao o banner chama mais atencao sem borda.
 *
 * `action` escolhe a cor do `StButton` que combina com o status. Os status sem
 * cor propria no botao (`info`, `system`, `warning`) usam o `primary`.
 */
const statusTokens: Record<StBannerStatus, BannerStatusTokens> = {
  info: {
    surface: 'bg-st-content-info',
    content: 'text-st-surface-info',
    iconBadge: 'bg-st-surface-info text-st-content-info',
    action: 'primary'
  },
  system: {
    surface: 'bg-st-content-system',
    content: 'text-st-surface-system',
    iconBadge: 'bg-st-surface-system text-st-content-system',
    action: 'primary'
  },
  warning: {
    surface: 'bg-st-content-warning',
    content: 'text-st-surface-warning',
    iconBadge: 'bg-st-surface-warning text-st-content-warning',
    action: 'primary'
  },
  positive: {
    surface: 'bg-st-content-positive',
    content: 'text-st-surface-positive',
    iconBadge: 'bg-st-surface-positive text-st-content-positive',
    action: 'positive'
  },
  negative: {
    surface: 'bg-st-content-negative',
    content: 'text-st-surface-negative',
    iconBadge: 'bg-st-surface-negative text-st-content-negative',
    action: 'negative'
  },
  primary: {
    surface: 'bg-st-content-primary',
    content: 'text-st-surface-primary',
    iconBadge: 'bg-st-surface-primary text-st-content-primary',
    action: 'primary'
  },
  secondary: {
    surface: 'bg-st-content-secondary',
    content: 'text-st-surface-secondary',
    iconBadge: 'bg-st-surface-secondary text-st-content-secondary',
    action: 'secondary'
  }
};

/** Cor do `StButton` de acao para o status. */
export const resolveBannerActionColor = (
  status: StBannerStatus = ST_BANNER_DEFAULT_STATUS
): ButtonColor => statusTokens[status].action;

/** Erros e avisos interrompem a leitura (`alert`); os demais sao `status`. */
export const resolveBannerRole = (
  status: StBannerStatus = ST_BANNER_DEFAULT_STATUS
): 'alert' | 'status' =>
  status === 'negative' || status === 'warning' ? 'alert' : 'status';

export const buildBannerClasses = (props: BannerClassProps) => {
  const {
    status = ST_BANNER_DEFAULT_STATUS,
    hasIcon = false,
    hasAction = false,
    closable = false,
    className
  } = props;

  const tokens = statusTokens[status];

  /**
   * Pill que cresce na horizontal com a frase (`w-fit`), ate a largura do
   * container (`max-w-full`). A altura minima de 40px acomoda o `StButton`
   * `small` (28px) com 6px de respiro; o lado que termina em botao ou icone
   * encolhe o padding para a borda da pill abracar o elemento.
   */
  const container = [
    'inline-flex w-fit max-w-full min-h-st-5 items-center gap-st-1 rounded-full',
    'py-[6px] font-st-body',
    hasIcon ? 'pl-[6px]' : 'pl-st-2',
    hasAction || closable ? 'pr-[6px]' : 'pr-st-2',
    tokens.surface,
    className
  ]
    .filter(Boolean)
    .join(' ');

  /** Circulo de 28px, a mesma altura do `StButton` `small` e do fechar. */
  const icon = [
    'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
    tokens.iconBadge
  ].join(' ');

  /** Uma frase, em uma linha: o que passar da largura vira reticencias. */
  const text = [
    'min-w-0 flex-1 truncate text-st-body-small font-semibold',
    tokens.content
  ].join(' ');

  /**
   * O `StButton` ja traz `rounded-st-1`; o `!` garante a pill sem depender da
   * ordem do CSS gerado entre os dois utilitarios de raio.
   */
  const action = 'shrink-0 !rounded-full';

  const close = [
    'inline-flex h-7 w-7 shrink-0 items-center justify-center cursor-pointer rounded-full border-0 bg-transparent p-0',
    'transition-opacity duration-200 ease-out hover:opacity-70',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-st-focus',
    tokens.content
  ].join(' ');

  return { container, icon, text, action, close };
};
