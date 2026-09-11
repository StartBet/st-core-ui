import type {
  StSuperOddsSelection,
  SuperOddsCardClassProps
} from './StSuperOddsCard.interface';
import type { StStepperStep } from '../../components/stepper/StStepper.interface';

export const ST_SUPER_ODDS_TYPE_ICON = 'bolt';

export const ST_SUPER_ODDS_HIGHLIGHT_ICON = 'fire';

export const ST_SUPER_ODDS_BOOST_ICON = 'angles-right';

export const ST_SUPER_ODDS_ACTIVE_LABEL = 'No bilhete';

/**
 * Fora do bilhete o botao e um convite (`primary` contornado); dentro dele
 * vira confirmacao preenchida (`secondary` solido), que e o estado de mais
 * peso visual na fileira.
 */
export const resolveSuperOddsAction = (active = false) =>
  active
    ? { variant: 'solid' as const, color: 'secondary' as const }
    : { variant: 'ghost' as const, color: 'primary' as const };

/**
 * Mesmo formato usado na plataforma: `10/09 • 22:00`. Datas vazias, invalidas
 * ou zeradas viram string vazia, e o cabecalho simplesmente nao mostra a data.
 */
export const formatSuperOddsDate = (iso?: string): string => {
  if (!iso || typeof iso !== 'string' || iso.startsWith('0001')) return '';

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) return '';

  return date
    .toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
    .replace(',', ' •');
};

/** Odds sempre com duas casas; strings ja formatadas passam direto. */
export const formatSuperOddsOdd = (value?: number | string): string => {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value === 'string') return value;
  if (Number.isNaN(value)) return '';

  return value.toFixed(2);
};

/** Converte as selecoes da aposta nos passos do `StStepper`. */
export const resolveSuperOddsSteps = (
  selections: StSuperOddsSelection[] = []
): StStepperStep[] =>
  selections
    .filter((item) => item?.selection || item?.market)
    .map((item) => ({
      title: item.selection ?? '',
      description: item.market
    }));

export const buildSuperOddsCardClasses = (props: SuperOddsCardClassProps) => {
  const { disabled = false, className } = props;

  /**
   * Sem `h-full` de proposito: em flexbox o `align-items: stretch` so
   * estica itens com altura `auto`, entao declarar `height` aqui faria o
   * card sair do stretch e voltar a ter a altura do proprio conteudo.
   * Quem estica e o container; o card so precisa saber distribuir a
   * altura que recebe.
   */
  const root = [
    'flex w-full min-w-0 flex-col overflow-hidden rounded-st-2 font-st-body',
    'border border-st-border-2 bg-st-surface-0',
    disabled ? 'opacity-60' : undefined,
    className
  ]
    .filter(Boolean)
    .join(' ');

  const header =
    'flex w-full items-center justify-between gap-st-2 bg-st-surface-primary pr-st-2';

  /**
   * O corte diagonal do selo e feito por `clip-path` com recuo fixo, e nao por
   * porcentagem: o tipo e texto livre, entao a largura do selo varia.
   */
  const typeBadge = [
    'flex items-center gap-[6px] bg-st-primary py-st-1 pl-st-2 pr-st-3',
    'text-st-xs font-bold uppercase leading-none text-st-content-bright',
    '[clip-path:polygon(0_0,100%_0,calc(100%_-_14px)_100%,0_100%)]'
  ].join(' ');

  const headerEnd = 'flex shrink-0 items-center gap-[6px]';

  const date = 'text-st-xs font-bold text-st-content-primary';

  const highlightIcon = 'shrink-0 text-st-content-warning';

  const body = 'flex w-full min-w-0 flex-1 flex-col gap-st-2 p-st-2';

  const competition = 'block text-center text-st-xs text-st-content-primary';

  /**
   * Gap apertado e nomes com `flex-1`: os dois lados ficam com a mesma
   * largura, o que mantem os escudos e o "X" centrados no card, e sobra
   * espaco para nomes longos antes de truncar.
   */
  const teams = 'flex min-w-0 items-center justify-center gap-[4px]';

  const teamName =
    'min-w-0 flex-1 truncate text-st-body-small font-bold text-st-content-default';

  const teamNameHome = [teamName, 'text-right'].join(' ');

  const teamNameAway = [teamName, 'text-left'].join(' ');

  const versus = 'shrink-0 text-st-body-small font-bold text-st-content-ghost';

  const divider = 'h-px w-full shrink-0 bg-st-border-2';

  /**
   * O divisor final carrega o `mt-auto`: a sobra de altura fica entre as
   * selecoes e o rodape, entao o botao encosta na base mesmo quando o
   * card tem menos selecoes que os vizinhos.
   */
  const footerDivider = [divider, 'mt-auto'].join(' ');

  const action = 'flex items-center justify-center gap-st-1';

  const oldOdd = 'text-st-body-small line-through opacity-70';

  const boostIcon = 'shrink-0';

  const newOdd = 'text-st-body-large font-extrabold';

  const eventName =
    'block truncate text-center text-st-body-small font-bold text-st-content-default';

  return {
    root,
    header,
    typeBadge,
    headerEnd,
    date,
    highlightIcon,
    body,
    competition,
    teams,
    teamNameHome,
    teamNameAway,
    versus,
    divider,
    footerDivider,
    action,
    oldOdd,
    boostIcon,
    newOdd,
    eventName
  };
};
