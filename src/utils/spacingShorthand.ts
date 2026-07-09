import type { SizeValue } from '../types';

type ResponsivePrefix = 'sm' | 'md' | 'lg';
type SpacingRule = 'p' | 'm';

const toValueSuffix = (value: string) => {
  const resolved = value.trim();

  if (resolved === '0') return '0';
  if (resolved === 'auto') return 'auto';

  return `st-${resolved}`;
};

export const sizeClassSuffixes: Record<SizeValue, string> = {
  auto: 'auto',
  full: 'full',
  'fit-content': 'fit',
  'min-content': 'min',
  'max-content': 'max',
  '1': 'st-1',
  '2': 'st-2',
  '3': 'st-3',
  '4': 'st-4',
  '5': 'st-5',
  '6': 'st-6',
  '7': 'st-7',
  '8': 'st-8',
  '9': 'st-9',
  '10': 'st-10',
  '11': 'st-11',
  '12': 'st-12',
  '16': 'st-16',
  '20': 'st-20',
  '24': 'st-24',
  '32': 'st-32',
  '40': 'st-40',
  '48': 'st-48',
  '56': 'st-56',
  '64': 'st-64',
  '72': 'st-72',
  '80': 'st-80',
  '96': 'st-96',
  '128': 'st-128',
  '144': 'st-144',
  '160': 'st-160',
  '168': 'st-168',
  '240': 'st-240'
};

export const createSizeClasses = (prefix: 'w' | 'h') =>
  Object.fromEntries(
    Object.entries(sizeClassSuffixes).map(([key, suffix]) => [
      key,
      `${prefix}-${suffix}`
    ])
  ) as Record<SizeValue, string>;

export const sizeWidthClasses = createSizeClasses('w');
export const sizeHeightClasses = createSizeClasses('h');

export const spacingShorthandToClasses = (
  value: string | undefined,
  rule: SpacingRule,
  responsivePrefix?: ResponsivePrefix
) => {
  if (!value) return [];

  const normalizedValue = value.trim();

  if (!normalizedValue) return [];

  const values = normalizedValue.split(/\s+/).map(toValueSuffix);
  const prefix = responsivePrefix ? `${responsivePrefix}:` : '';

  if (values.length === 1) return [`${prefix}${rule}-${values[0]}`];

  if (values.length === 2) {
    return [`${prefix}${rule}y-${values[0]}`, `${prefix}${rule}x-${values[1]}`];
  }

  if (values.length === 3) {
    return [
      `${prefix}${rule}t-${values[0]}`,
      `${prefix}${rule}x-${values[1]}`,
      `${prefix}${rule}b-${values[2]}`
    ];
  }

  return [
    `${prefix}${rule}t-${values[0]}`,
    `${prefix}${rule}r-${values[1]}`,
    `${prefix}${rule}b-${values[2]}`,
    `${prefix}${rule}l-${values[3]}`
  ];
};
