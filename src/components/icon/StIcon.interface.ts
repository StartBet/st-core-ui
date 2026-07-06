export type StIconLibrary = 'fa' | 'fab';

export type StIconSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface IconClassProps {
  name: string;
  lib?: StIconLibrary;
  size?: StIconSize;
  ariaLabel?: string;
  className?: string;
}
