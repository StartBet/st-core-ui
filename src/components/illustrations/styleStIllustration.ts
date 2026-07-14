import type { SizeValue } from '../../types';
import {
  sizeHeightClasses,
  sizeWidthClasses
} from '../../utils/spacingShorthand';

export const ST_ILLUSTRATION_CDN_BASE_URL =
  'https://cdn.start.bet.br/illustrations';

export const normalizeIllustrationName = (name: string) =>
  name.replace(/^\/+/, '').replace(/\.svg$/i, '');

export const buildIllustrationSrc = (name: string) =>
  `${ST_ILLUSTRATION_CDN_BASE_URL}/${normalizeIllustrationName(name)}.svg`;

export const buildIllustrationSizeClasses = (
  width?: SizeValue,
  height?: SizeValue
) =>
  [
    width ? sizeWidthClasses[width] : undefined,
    height ? sizeHeightClasses[height] : undefined
  ].filter(Boolean);
