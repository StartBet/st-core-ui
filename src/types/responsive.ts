export type StBreakpoint = 'sm' | 'md' | 'lg';

export type ResponsiveValue<T> = {
  base: T;
} & Partial<Record<StBreakpoint, T>>;

export type ActiveBreakpoints = Record<StBreakpoint, boolean>;
