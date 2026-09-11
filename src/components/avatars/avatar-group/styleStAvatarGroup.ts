import type { AvatarGroupClassProps } from './StAvatarGroup.interface';
import {
  resolveAvatarSizeTokens,
  ST_AVATAR_BASE_CLASS
} from '../avatar/styleStAvatar';

export const ST_AVATAR_GROUP_DEFAULT_MAX = 5;

/** Garante pelo menos um avatar visivel antes do contador. */
export const clampAvatarGroupMax = (max: number | undefined) => {
  if (typeof max !== 'number' || Number.isNaN(max)) {
    return ST_AVATAR_GROUP_DEFAULT_MAX;
  }

  const rounded = Math.trunc(max);

  return rounded < 1 ? 1 : rounded;
};

/** Quantos usuarios ficaram de fora da lista visivel. */
export const resolveAvatarGroupOverflow = (total: number, max: number) =>
  total > max ? total - max : 0;

export const buildAvatarGroupClasses = (props: AvatarGroupClassProps) => {
  const { size = 'medium', className } = props;

  const tokens = resolveAvatarSizeTokens(size);

  const container = ['inline-flex items-center', className]
    .filter(Boolean)
    .join(' ');

  /** Anel na cor da superficie base para separar avatares sobrepostos. */
  const ring = 'ring-2 ring-st-surface-0';

  const item = ring;

  const overlap = tokens.overlap;

  const overflow = [
    ST_AVATAR_BASE_CLASS,
    tokens.container,
    tokens.text,
    'border border-st-border-2 bg-st-surface-3 font-bold text-st-content-default',
    ring,
    overlap
  ].join(' ');

  return { container, item, overlap, overflow };
};
