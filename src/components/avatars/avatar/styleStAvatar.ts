import type {
  AvatarClassProps,
  StAvatarColor,
  StAvatarContent,
  StAvatarSize
} from './StAvatar.interface';
import type { StIconSize } from '../../icon/StIcon.interface';

export const ST_AVATAR_FALLBACK_COLOR: StAvatarColor = 'blue';

export const ST_AVATAR_PLACEHOLDER_ICON = 'user';

/**
 * Cor fixa por inicial: o mesmo nome sempre gera o mesmo avatar, em qualquer
 * sessao e em qualquer tela. Nao ha sorteio em tempo de execucao.
 */
export const stAvatarLetterColors: Record<string, StAvatarColor> = {
  A: 'blue',
  B: 'ocean',
  C: 'green',
  D: 'yellow',
  E: 'orange',
  F: 'red',
  G: 'pink',
  H: 'purple',
  I: 'blue',
  J: 'ocean',
  K: 'green',
  L: 'yellow',
  M: 'orange',
  N: 'red',
  O: 'pink',
  P: 'purple',
  Q: 'blue',
  R: 'ocean',
  S: 'green',
  T: 'yellow',
  U: 'orange',
  V: 'red',
  W: 'pink',
  X: 'purple',
  Y: 'blue',
  Z: 'ocean'
};

const stripDiacritics = (value: string) =>
  value.normalize('NFD').replace(/\p{M}/gu, '');

/**
 * Primeira letra do primeiro nome + primeira letra do ultimo nome.
 * `Uncle` -> `U`, `Arthur Morgan` -> `AM`, `Dutch van der Linde` -> `DL`.
 */
export const resolveAvatarInitials = (name?: string) => {
  const words = stripDiacritics(name ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return '';

  const first = words[0].charAt(0);
  const last = words.length > 1 ? words[words.length - 1].charAt(0) : '';

  return `${first}${last}`.toUpperCase();
};

/** Cor da paleta derivada da inicial do primeiro nome. */
export const resolveAvatarColor = (name?: string): StAvatarColor =>
  stAvatarLetterColors[resolveAvatarInitials(name).charAt(0)] ??
  ST_AVATAR_FALLBACK_COLOR;

/** Imagem quando existe e carrega; senao as iniciais; senao o icone neutro. */
export const resolveAvatarContent = (args: {
  src?: string;
  name?: string;
  hasImageError?: boolean;
}): StAvatarContent => {
  const { src, name, hasImageError = false } = args;

  if (src && !hasImageError) return 'image';
  if (resolveAvatarInitials(name)) return 'initials';

  return 'placeholder';
};

type AvatarSizeTokens = {
  container: string;
  text: string;
  icon: StIconSize;
  containPadding: string;
  overlap: string;
};

const sizeTokens: Record<StAvatarSize, AvatarSizeTokens> = {
  small: {
    container: 'h-st-4 w-st-4',
    text: 'text-st-xs',
    icon: 3,
    containPadding: 'p-[3px]',
    overlap: '-ml-[6px]'
  },
  medium: {
    container: 'h-st-5 w-st-5',
    text: 'text-st-base',
    icon: 5,
    containPadding: 'p-[5px]',
    overlap: '-ml-[8px]'
  },
  large: {
    container: 'h-st-7 w-st-7',
    text: 'text-st-lg',
    icon: 7,
    containPadding: 'p-[7px]',
    overlap: '-ml-[11px]'
  }
};

export const resolveAvatarSizeTokens = (
  size: StAvatarSize = 'medium'
): AvatarSizeTokens => sizeTokens[size];

/** Tamanho do `StIcon` usado no placeholder. */
export const resolveAvatarIconSize = (
  size: StAvatarSize = 'medium'
): StIconSize => sizeTokens[size].icon;

export const ST_AVATAR_BASE_CLASS = [
  'relative inline-flex shrink-0 select-none items-center justify-center',
  'overflow-hidden rounded-full align-middle font-st-body'
].join(' ');

/** Fundo denso da paleta com o texto em um tom mais claro da mesma cor. */
const colorClasses: Record<StAvatarColor, string> = {
  blue: 'bg-st-blue-700 text-st-blue-100',
  ocean: 'bg-st-ocean-700 text-st-ocean-100',
  green: 'bg-st-green-700 text-st-green-100',
  yellow: 'bg-st-yellow-700 text-st-yellow-100',
  orange: 'bg-st-orange-700 text-st-orange-100',
  red: 'bg-st-red-700 text-st-red-100',
  pink: 'bg-st-pink-700 text-st-pink-100',
  purple: 'bg-st-purple-700 text-st-purple-100'
};

export const buildAvatarClasses = (props: AvatarClassProps) => {
  const {
    size = 'medium',
    fit = 'cover',
    color = ST_AVATAR_FALLBACK_COLOR,
    content = 'placeholder',
    className
  } = props;

  const tokens = sizeTokens[size];
  const isContain = fit === 'contain';

  const surfaceClasses: Record<StAvatarContent, string> = {
    image: isContain
      ? 'border border-st-border-2 bg-st-surface-1'
      : 'bg-st-surface-2',
    initials: colorClasses[color],
    placeholder:
      'border border-st-border-2 bg-st-surface-2 text-st-content-ghost'
  };

  const container = [
    ST_AVATAR_BASE_CLASS,
    tokens.container,
    tokens.text,
    content === 'initials' ? 'font-bold' : undefined,
    surfaceClasses[content],
    content === 'image' && isContain ? tokens.containPadding : undefined,
    className
  ]
    .filter(Boolean)
    .join(' ');

  const image = [
    'h-full w-full',
    isContain ? 'object-contain' : 'object-cover'
  ].join(' ');

  const initials = 'leading-none';

  return { container, image, initials };
};
