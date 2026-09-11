import type { InjectionKey } from 'vue';

import type {
  AccordionClassProps,
  StAccordionContext,
  StAccordionSize,
  StAccordionSurface
} from './StAccordion.interface';
import type { StIconSize } from '../../icon/StIcon.interface';

export const stAccordionContextKey: InjectionKey<StAccordionContext> = Symbol(
  'st-accordion-context'
);

export const ST_ACCORDION_EXPAND_ICON = 'chevron-down';

export const ST_ACCORDION_DEFAULT_HEADER_SURFACE: StAccordionSurface =
  'surface-1';

export const ST_ACCORDION_DEFAULT_CONTENT_SURFACE: StAccordionSurface =
  'surface-0';

type AccordionSizeTokens = {
  header: string;
  content: string;
  gap: string;
  text: string;
  icon: StIconSize;
};

const sizeTokens: Record<StAccordionSize, AccordionSizeTokens> = {
  small: {
    header: 'px-st-2 py-st-1',
    content: 'px-st-2 py-st-1',
    gap: 'gap-st-1',
    text: 'text-st-body-small',
    icon: 2
  },
  medium: {
    header: 'px-st-2 py-st-2',
    content: 'px-st-2 py-st-2',
    gap: 'gap-st-2',
    text: 'text-st-body-medium',
    icon: 3
  },
  large: {
    header: 'px-st-3 py-st-3',
    content: 'px-st-3 py-st-3',
    gap: 'gap-st-2',
    text: 'text-st-body-large',
    icon: 4
  }
};

/** Tamanho do `StIcon` usado no cabecalho. */
export const resolveAccordionIconSize = (
  size: StAccordionSize = 'medium'
): StIconSize => sizeTokens[size].icon;

const surfaceClasses: Record<StAccordionSurface, string> = {
  transparent: 'bg-transparent',
  'surface-0': 'bg-st-surface-0',
  'surface-1': 'bg-st-surface-1',
  'surface-2': 'bg-st-surface-2',
  'surface-3': 'bg-st-surface-3',
  'surface-4': 'bg-st-surface-4',
  'surface-primary': 'bg-st-surface-primary',
  'surface-secondary': 'bg-st-surface-secondary',
  'surface-info': 'bg-st-surface-info',
  'surface-system': 'bg-st-surface-system',
  'surface-warning': 'bg-st-surface-warning',
  'surface-positive': 'bg-st-surface-positive',
  'surface-negative': 'bg-st-surface-negative'
};

export const buildAccordionClasses = (props: AccordionClassProps) => {
  const {
    size = 'medium',
    headerSurface = ST_ACCORDION_DEFAULT_HEADER_SURFACE,
    contentSurface = ST_ACCORDION_DEFAULT_CONTENT_SURFACE,
    open = false,
    disabled = false,
    className,
    headerClassName,
    contentClassName
  } = props;

  const tokens = sizeTokens[size];

  const root = ['w-full overflow-hidden rounded-st-1 font-st-body', className]
    .filter(Boolean)
    .join(' ');

  /**
   * A linha do cabecalho carrega o padding e a ordem visual; o gatilho e uma
   * camada sobre ela. Assim o chevron fecha a linha, o `endAdornment` aparece
   * antes dele e continua fora do botao — sem botao dentro de botao.
   */
  const header = [
    'relative flex w-full items-center',
    tokens.header,
    tokens.gap,
    surfaceClasses[headerSurface],
    disabled ? 'opacity-60' : undefined,
    headerClassName
  ]
    .filter(Boolean)
    .join(' ');

  const trigger = [
    'absolute inset-0 m-0 border-0 bg-transparent p-0',
    'transition-colors duration-200 ease-out',
    disabled
      ? 'cursor-not-allowed'
      : 'cursor-pointer hover:bg-st-hover/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-st-focus'
  ].join(' ');

  const icon = 'shrink-0 text-st-content-default';

  const title = [
    'min-w-0 flex-1 text-left font-semibold text-st-content-default',
    tokens.text
  ].join(' ');

  /**
   * `pointer-events-none` e obrigatorio: o `rotate-*` cria um stacking context
   * que pintaria o icone acima da camada do gatilho e engoliria o clique.
   */
  const expandIcon = [
    'pointer-events-none shrink-0 text-st-content-ghost',
    'transition-transform duration-300 ease-out motion-reduce:transition-none',
    open ? 'rotate-180' : 'rotate-0'
  ].join(' ');

  /** Acima da camada do gatilho: elementos interativos seguem clicaveis. */
  const adornment = 'relative z-[1] flex shrink-0 items-center';

  /**
   * `grid-template-rows` de `0fr` para `1fr` anima ate a altura automatica do
   * conteudo, sem medir nada em JavaScript e sem altura fixa.
   */
  const region = [
    'grid transition-[grid-template-rows] duration-300 ease-out',
    'motion-reduce:transition-none',
    open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
    surfaceClasses[contentSurface]
  ].join(' ');

  const regionInner = 'overflow-hidden';

  const content = [
    tokens.content,
    tokens.text,
    'text-st-content-default',
    contentClassName
  ]
    .filter(Boolean)
    .join(' ');

  return {
    root,
    header,
    trigger,
    icon,
    title,
    expandIcon,
    adornment,
    region,
    regionInner,
    content
  };
};
