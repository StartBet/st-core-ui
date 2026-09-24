import type { Component } from 'vue';

import type {
  ButtonColor,
  ButtonSize,
  ButtonVariant
} from '../../components/buttons/button/StButton.interface';

export type StPromotionCardImageLoading = 'lazy' | 'eager';

export interface PromotionCardClassProps {
  hasLink?: boolean;
  className?: string;
}

export interface StPromotionCardImageSlotProps {
  class: string;
  alt: string;
  onError: () => void;
}

export interface StPromotionCardSlots {
  image?: (props: StPromotionCardImageSlotProps) => unknown;
  'top-start'?: () => unknown;
}

export interface StPromotionCardProps extends PromotionCardClassProps {
  name?: string;
  description?: string;
  image?: string | null;
  imageLoading?: StPromotionCardImageLoading;
  href?: string;
  linkAs?: string | Component;
  linkAriaLabel?: string;
  ctaLabel?: string;
  showCta?: boolean;
  ctaVariant?: ButtonVariant;
  ctaColor?: ButtonColor;
  ctaSize?: ButtonSize;
  loading?: boolean;
  ariaLabel?: string;
}
