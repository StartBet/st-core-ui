import type {
  GameCardClassProps,
  StGameCardAspect,
  StGameCardProvider
} from './StGameCard.interface';
import { buildButtonClasses } from '../../components/buttons/button/styleStButton';

export const ST_GAME_CARD_PLAY_LABEL = 'Jogue';

export const ST_GAME_CARD_UNAVAILABLE_LABEL = 'Jogo indisponivel';

export const ST_GAME_CARD_FAVORITE_ICON_PATH =
  'M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z';

const aspectClasses: Record<StGameCardAspect, string> = {
  portrait: 'aspect-[10/13]',
  wide: 'aspect-video'
};

export const resolveGameCardProvider = (
  provider?: string | StGameCardProvider | null
): string => {
  if (!provider) return '';
  if (typeof provider === 'string') return provider;

  return provider.name ?? '';
};

export const resolveGameCardLinkLabel = (name?: string): string =>
  name ? `Jogar ${name}` : '';

export const resolveGameCardFavoriteLabel = (
  favorite = false,
  name = ''
): string => {
  const target = name ? ` o jogo ${name}` : '';

  return favorite
    ? `Remover dos favoritos${target}`
    : `Adicionar aos favoritos${target}`;
};

export const buildGameCardClasses = (props: GameCardClassProps) => {
  const {
    aspect = 'portrait',
    hasLink = false,
    favorite = false,
    className
  } = props;

  const shape = [
    'relative block w-full min-w-0 overflow-hidden rounded-st-1',
    aspectClasses[aspect]
  ].join(' ');

  const root = [
    shape,
    'group isolate bg-st-surface-1 font-st-body',
    hasLink ? 'cursor-pointer' : undefined,
    className
  ]
    .filter(Boolean)
    .join(' ');

  const skeleton = [shape, 'animate-pulse bg-st-surface-1', className]
    .filter(Boolean)
    .join(' ');

  const unavailable = [
    shape,
    'flex items-center justify-center p-st-1 text-center',
    'border border-st-border-2 bg-st-surface-1',
    'text-st-xs text-st-content-ghost',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const image = [
    'absolute inset-0 h-full w-full object-cover object-center',
    'transition-transform duration-300 ease-out motion-reduce:transition-none',
    hasLink ? 'md:[@media(hover:hover)]:group-hover:scale-110' : undefined
  ]
    .filter(Boolean)
    .join(' ');

  const fallback = [
    'absolute inset-0 flex items-center justify-center px-st-1 pb-st-4',
    'bg-[linear-gradient(160deg,var(--st-color-surface-2)_0%,var(--st-color-surface-0)_100%)]',
    'text-center font-st-heading text-st-lg uppercase leading-st-tight text-st-content-ghost'
  ].join(' ');

  const info = [
    'pointer-events-none absolute inset-x-0 bottom-0 z-[3] flex flex-col gap-[2px]',
    'p-st-1 backdrop-blur-md',
    'bg-[color-mix(in_srgb,color-mix(in_srgb,var(--st-color-primary)_60%,black)_72%,transparent)]'
  ].join(' ');

  const name =
    'truncate text-st-xs font-bold leading-st-snug text-st-content-bright sm:text-st-sm';

  const provider =
    'truncate text-st-xxs font-medium leading-st-snug text-st-content-bright opacity-80 sm:text-st-xs';

  const link = [
    'absolute inset-0 z-[2] rounded-st-1 no-underline outline-none',
    'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-st-focus'
  ].join(' ');

  const overlay = [
    'absolute inset-0 hidden items-center justify-center bg-st-surface-shadow-1 md:flex',
    'opacity-0 transition-opacity duration-200 ease-in-out motion-reduce:transition-none',
    '[@media(hover:hover)]:group-hover:opacity-100 group-focus-within:opacity-100'
  ].join(' ');

  const play = buildButtonClasses({
    variant: 'solid',
    size: 'small',
    color: 'secondary'
  });

  const top = [
    'pointer-events-none absolute inset-x-0 top-0 z-[4] flex items-start justify-between gap-st-1 p-[6px]',
    '[&>*]:pointer-events-auto'
  ].join(' ');

  const favoriteButton = [
    'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full outline-none',
    'transition-transform duration-200 ease-in-out hover:scale-110 active:scale-95 motion-reduce:transition-none',
    'focus-visible:ring-2 focus-visible:ring-st-focus'
  ].join(' ');

  const favoriteIcon = [
    'h-st-3 w-st-3 drop-shadow-[0_1px_2px_var(--st-color-shadow-1)]',
    'transition-colors duration-200 ease-in-out motion-reduce:transition-none',
    favorite
      ? 'fill-st-warning stroke-st-warning'
      : 'fill-st-surface-shadow-2 stroke-st-content-bright'
  ].join(' ');

  return {
    root,
    skeleton,
    unavailable,
    image,
    fallback,
    info,
    name,
    provider,
    link,
    overlay,
    play: play.container,
    playContent: play.content,
    top,
    favoriteButton,
    favoriteIcon
  };
};
