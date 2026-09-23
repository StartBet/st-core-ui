import type { Component } from 'vue';

export type StGameCardAspect = 'portrait' | 'wide';

export type StGameCardImageLoading = 'lazy' | 'eager';

export interface StGameCardProvider {
  name?: string;
}

export interface GameCardClassProps {
  aspect?: StGameCardAspect;
  hasLink?: boolean;
  favorite?: boolean;
  className?: string;
}

export interface StGameCardImageSlotProps {
  class: string;
  alt: string;
  onError: () => void;
}

export interface StGameCardSlots {
  image?: (props: StGameCardImageSlotProps) => unknown;
  'top-start'?: () => unknown;
}

export interface StGameCardEmits {
  'update:favorite': [value: boolean];
}

export interface StGameCardProps extends GameCardClassProps {
  name?: string;
  provider?: string | StGameCardProvider | null;
  image?: string | null;
  imageLoading?: StGameCardImageLoading;
  showName?: boolean;
  href?: string;
  linkAs?: string | Component;
  linkAriaLabel?: string;
  playLabel?: string;
  favorite?: boolean;
  showFavorite?: boolean;
  favoriteAriaLabel?: string;
  loading?: boolean;
  unavailableLabel?: string;
  ariaLabel?: string;
}
