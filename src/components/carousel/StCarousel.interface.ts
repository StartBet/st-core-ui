import type { UsualSizeValue } from '../../types';

export type StCarouselNavigation = 'outside' | 'inside' | 'none';

export type StCarouselBulletsPosition = 'left' | 'center' | 'right';

export type StCarouselGap =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | '0'
  | UsualSizeValue;

export type StCarouselPeek =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6';

export type StCarouselSlideAlign = 'left' | 'center';

export interface CarouselClassProps {
  autoHeight?: boolean;
  peek?: boolean;
  slideAlign?: StCarouselSlideAlign;
  arrows?: StCarouselNavigation;
  bullets?: StCarouselNavigation;
  bulletsPosition?: StCarouselBulletsPosition;
  grab?: boolean;
  className?: string;
  viewportClassName?: string;
  trackClassName?: string;
  slideClassName?: string;
}

export interface StCarouselProps {
  autoplay?: boolean;
  autoplayTimeout?: number;
  autoplayHoverPause?: boolean;
  autoHeight?: boolean;
  infiniteLoop?: boolean;

  bullets?: StCarouselNavigation;
  smBullets?: StCarouselNavigation;
  mdBullets?: StCarouselNavigation;
  lgBullets?: StCarouselNavigation;
  bulletsPosition?: StCarouselBulletsPosition;

  arrows?: StCarouselNavigation;
  smArrows?: StCarouselNavigation;
  mdArrows?: StCarouselNavigation;
  lgArrows?: StCarouselNavigation;

  slidePerPage?: number;
  smSlidePerPage?: number;
  mdSlidePerPage?: number;
  lgSlidePerPage?: number;

  peek?: StCarouselPeek;
  smPeek?: StCarouselPeek;
  mdPeek?: StCarouselPeek;
  lgPeek?: StCarouselPeek;

  slideAlign?: StCarouselSlideAlign;
  smSlideAlign?: StCarouselSlideAlign;
  mdSlideAlign?: StCarouselSlideAlign;
  lgSlideAlign?: StCarouselSlideAlign;

  gap?: StCarouselGap;
  smGap?: StCarouselGap;
  mdGap?: StCarouselGap;
  lgGap?: StCarouselGap;

  grab?: boolean;
  smGrab?: boolean;
  mdGrab?: boolean;
  lgGrab?: boolean;

  highlight?: boolean;
  smHighlight?: boolean;
  mdHighlight?: boolean;
  lgHighlight?: boolean;

  modelValue?: number;
  transitionDuration?: number;

  ariaLabel?: string;
  className?: string;
  viewportClassName?: string;
  trackClassName?: string;
  slideClassName?: string;
}

export interface StCarouselSlideDescriptor {
  key: string;
  logicalIndex: number;
  isClone: boolean;
}
