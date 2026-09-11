import type { InjectionKey } from 'vue';

import type {
  StTabsAlign,
  StTabsColor,
  StTabsContext,
  StTabsSize,
  StTabsVariant,
  TabClassProps,
  TabsClassProps
} from './StTabs.interface';
import type { StIconSize } from '../../icon/StIcon.interface';

export const stTabsContextKey: InjectionKey<StTabsContext> =
  Symbol('st-tabs-context');

export const ST_TABS_DEFAULT_VARIANT: StTabsVariant = 'underline';

export const ST_TABS_DEFAULT_SIZE: StTabsSize = 'medium';

export const ST_TABS_DEFAULT_COLOR: StTabsColor = 'primary';

/** Teclas que movem o foco dentro da lista, no padrao ARIA de tabs. */
export const ST_TABS_NAV_KEYS = [
  'ArrowRight',
  'ArrowLeft',
  'Home',
  'End'
] as const;

/** Proximo indice habilitado, circulando nas pontas. */
export const resolveNextTabIndex = (
  current: number,
  total: number,
  key: string
) => {
  if (total <= 0) return -1;
  if (key === 'Home') return 0;
  if (key === 'End') return total - 1;

  const step = key === 'ArrowLeft' ? -1 : 1;
  const base = current < 0 ? 0 : current;

  return (base + step + total) % total;
};

type TabsSizeTokens = {
  tab: string;
  text: string;
  icon: StIconSize;
  gap: string;
};

const sizeTokens: Record<StTabsSize, TabsSizeTokens> = {
  small: {
    tab: 'h-st-4 px-st-2',
    text: 'text-st-body-small',
    icon: 2,
    gap: 'gap-[6px]'
  },
  medium: {
    tab: 'h-st-5 px-st-2',
    text: 'text-st-body-medium',
    icon: 3,
    gap: 'gap-st-1'
  },
  large: {
    tab: 'h-st-6 px-st-3',
    text: 'text-st-body-large',
    icon: 4,
    gap: 'gap-st-1'
  }
};

export const resolveTabIconSize = (
  size: StTabsSize = ST_TABS_DEFAULT_SIZE
): StIconSize => sizeTokens[size].icon;

const alignClasses: Record<StTabsAlign, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end'
};

/**
 * Cada variante declara a forma e os dois estados sem repetir o mesmo
 * utilitario: `bg-transparent` e `border-b-transparent` so aparecem no estado
 * que precisa deles. Emitir os dois na mesma classe deixaria a decisao para a
 * ordem do CSS gerado, e o destaque do ativo se perderia.
 */
const variantClasses: Record<
  StTabsVariant,
  { shape: string; active: Record<StTabsColor, string>; idle: string }
> = {
  underline: {
    shape: 'border-b-2 border-solid bg-transparent -mb-px',
    active: {
      primary: 'border-b-st-primary text-st-content-primary',
      secondary: 'border-b-st-secondary text-st-content-secondary'
    },
    idle: 'border-b-transparent text-st-content-ghost'
  },
  pill: {
    shape: 'rounded-full',
    active: {
      primary: 'bg-st-primary text-st-content-bright',
      secondary: 'bg-st-secondary text-st-content-din'
    },
    idle: 'bg-transparent text-st-content-ghost'
  }
};

export const buildTabsClasses = (props: TabsClassProps) => {
  const {
    variant = ST_TABS_DEFAULT_VARIANT,
    align = 'start',
    fullWidth = false,
    className,
    listClassName
  } = props;

  const root = ['flex w-full flex-col font-st-body', className]
    .filter(Boolean)
    .join(' ');

  /**
   * A lista rola na horizontal quando as abas nao cabem, entao muitas abas em
   * tela estreita nao quebram o layout.
   */
  const listBase = [
    'flex w-full items-center overflow-x-auto',
    '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    fullWidth ? 'justify-stretch' : alignClasses[align]
  ].join(' ');

  /**
   * Trilho da pill em `surface-2`, e nao `surface-1`: no tema escuro e o tom
   * que mais separa a pilula ativa do fundo sem escurecer demais a barra.
   */
  const listVariant =
    variant === 'underline'
      ? 'border-b border-st-border-2'
      : 'gap-[4px] rounded-full bg-st-surface-2 p-[4px]';

  const list = [listBase, listVariant, listClassName].filter(Boolean).join(' ');

  return { root, list };
};

export const buildTabClasses = (props: TabClassProps) => {
  const {
    variant = ST_TABS_DEFAULT_VARIANT,
    size = ST_TABS_DEFAULT_SIZE,
    color = ST_TABS_DEFAULT_COLOR,
    active = false,
    disabled = false,
    fullWidth = false,
    className
  } = props;

  const tokens = sizeTokens[size];

  const tokensVariant = variantClasses[variant];

  const base = [
    'relative inline-flex shrink-0 items-center justify-center whitespace-nowrap',
    'm-0 font-semibold',
    'transition-colors duration-200 ease-out',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-st-focus focus-visible:ring-offset-2 focus-visible:ring-offset-st-surface-0',
    tokens.tab,
    tokens.text,
    tokens.gap,
    fullWidth ? 'flex-1' : undefined,
    disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
  ]
    .filter(Boolean)
    .join(' ');

  const idleHover = disabled
    ? undefined
    : variant === 'underline'
      ? 'hover:text-st-content-default'
      : 'hover:bg-st-surface-2 hover:text-st-content-default';

  const state = active
    ? tokensVariant.active[color]
    : [tokensVariant.idle, idleHover].filter(Boolean).join(' ');

  const tab = [base, tokensVariant.shape, state, className]
    .filter(Boolean)
    .join(' ');

  return { tab };
};

export const buildTabPanelClasses = (props: { className?: string }) =>
  ({
    panel: [
      'w-full pt-st-2 font-st-body text-st-content-default',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-st-focus',
      props.className
    ]
      .filter(Boolean)
      .join(' ')
  }) as const;
