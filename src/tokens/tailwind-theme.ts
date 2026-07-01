const cssVar = (token: string) => `var(${token})`;

type TailwindPluginApi = {
  addUtilities: (utilities: Record<string, Record<string, string>>[]) => void;
  theme: (path: string) => unknown;
};

type ScaleValue = 0 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

const toneScaleValues = [
  100, 200, 300, 400, 500, 600, 700, 800, 900, 950
] as const;
const neutralScaleValues = [0, ...toneScaleValues] as const;

const sizeScale = {
  'st-xs': '0.75rem',
  'st-sm': '0.875rem',
  'st-base': '1rem',
  'st-md': '1.125rem',
  'st-lg': '1.25rem',
  'st-xl': '1.5rem',
  'st-2xl': '1.875rem',
  'st-3xl': '2.25rem',
  'st-4xl': '3rem',
  'st-5xl': '3.75rem',
  'st-6xl': '4.5rem',
  'st-7xl': '5rem'
} as const;

const spacingScale = {
  ...sizeScale,
  'st-1': '8px',
  'st-2': '16px',
  'st-3': '24px',
  'st-4': '32px',
  'st-5': '40px',
  'st-6': '48px',
  'st-7': '56px',
  'st-8': '64px',
  'st-9': '72px',
  'st-10': '80px',
  'st-11': '88px',
  'st-12': '96px',
  'st-15': '120px',
  'st-16': '128px',
  'st-20': '160px',
  'st-24': '192px',
  'st-30': '240px',
  'st-32': '256px',
  'st-40': '320px',
  'st-48': '384px',
  'st-56': '448px',
  'st-64': '512px',
  'st-72': '584px',
  'st-80': '640px',
  'st-96': '768px',
  'st-128': '1024px',
  'st-144': '1152px',
  'st-160': '1280px',
  'st-168': '1344px',
  'st-240': '1920px'
} as const;

const colorScalePrefixes = {
  'brand-primary': 'brand-primary',
  'brand-secondary': 'brand-secondary',
  info: 'info-color',
  system: 'system-color',
  positive: 'positive-color',
  attention: 'attention-color',
  negative: 'negative-color',
  blue: 'blue-color',
  ocean: 'ocean-color',
  green: 'green-color',
  yellow: 'yellow-color',
  orange: 'orange-color',
  red: 'red-color',
  pink: 'pink-color',
  purple: 'purple-color'
} as const;

const tokenObject = <const T extends Record<string, string>>(
  tokens: T
): { [K in keyof T]: string } =>
  Object.fromEntries(
    Object.entries(tokens).map(([key, token]) => [key, cssVar(token)])
  ) as { [K in keyof T]: string };

const scale = <const T extends readonly ScaleValue[]>(
  prefix: string,
  values: T
): { [K in T[number]]: string } =>
  Object.fromEntries(
    values.map((value) => [value, cssVar(`--st-${prefix}-${value}`)])
  ) as { [K in T[number]]: string };

const createScaleGroup = <
  const TPrefixes extends Record<string, string>,
  const TValues extends readonly ScaleValue[] = typeof toneScaleValues
>(
  prefixes: TPrefixes,
  values?: TValues
): { [K in keyof TPrefixes]: { [V in TValues[number]]: string } } => {
  const resolvedValues = (values ?? toneScaleValues) as TValues;

  return Object.fromEntries(
    Object.entries(prefixes).map(([key, prefix]) => [
      key,
      scale(prefix, resolvedValues)
    ])
  ) as { [K in keyof TPrefixes]: { [V in TValues[number]]: string } };
};

const textStyle = (
  fontSize: string,
  lineHeight: string,
  fontWeight: string,
  letterSpacing = '0'
) => [fontSize, { lineHeight, letterSpacing, fontWeight }] as const;

const createTextShadowUtilities = (shadows?: Record<string, string>) =>
  Object.entries(shadows ?? {}).map(([key, value]) => ({
    [`.text-shadow-${key}`]: {
      textShadow: value
    }
  }));

export const stTailwindTheme = {
  colors: {
    ...tokenObject({
      'st-brand': '--st-color-brand',
      'st-primary': '--st-color-primary',
      'st-secondary': '--st-color-secondary',
      'st-info': '--st-color-info',
      'st-system': '--st-color-system',
      'st-warning': '--st-color-warning',
      'st-positive': '--st-color-positive',
      'st-negative': '--st-color-negative'
    }),
    'st-surface': {
      ...tokenObject({
        0: '--st-color-surface-0',
        1: '--st-color-surface-1',
        2: '--st-color-surface-2',
        3: '--st-color-surface-3',
        4: '--st-color-surface-4',
        primary: '--st-color-surface-primary',
        secondary: '--st-color-surface-secondary',
        info: '--st-color-surface-info',
        system: '--st-color-surface-system',
        warning: '--st-color-surface-warning',
        positive: '--st-color-surface-positive',
        negative: '--st-color-surface-negative'
      }),
      shadow: tokenObject({
        0: '--st-color-surface-shadow-0',
        1: '--st-color-surface-shadow-1',
        2: '--st-color-surface-shadow-2',
        3: '--st-color-surface-shadow-3'
      })
    },
    'st-content': tokenObject({
      default: '--st-color-content-default',
      disable: '--st-color-content-disable',
      ghost: '--st-color-content-ghost',
      bright: '--st-color-content-bright',
      din: '--st-color-content-din',
      primary: '--st-color-content-primary',
      secondary: '--st-color-content-secondary',
      info: '--st-color-content-info',
      system: '--st-color-content-system',
      warning: '--st-color-content-warning',
      positive: '--st-color-content-positive',
      negative: '--st-color-content-negative'
    }),
    'st-border': tokenObject({
      1: '--st-color-border-1',
      2: '--st-color-border-2',
      3: '--st-color-border-3'
    }),
    ...tokenObject({
      'st-focus': '--st-color-focus',
      'st-pressed': '--st-color-pressed',
      'st-hover': '--st-color-hover'
    }),
    st: {
      ...createScaleGroup(colorScalePrefixes),
      neutral: scale('neutral-color', neutralScaleValues),
      ...createScaleGroup({
        'shadow-scale': 'shadow-scale',
        'light-scale': 'light-scale'
      })
    }
  },
  fontFamily: {
    'st-heading': ['"Base Neue Condensed"', 'sans-serif'],
    'st-highlight': ['"Base Neue Condensed"', 'sans-serif'],
    'st-body': ['Montserrat', 'sans-serif']
  },
  fontSize: {
    ...sizeScale,
    'st-heading-1': textStyle('3rem', '1.1', '800'),
    'st-heading-2': textStyle('2.25rem', '1.1', '800'),
    'st-heading-3': textStyle('1.875rem', '1.25', '800'),
    'st-heading-4': textStyle('1.5rem', '1.25', '800'),
    'st-highlight-large': textStyle('1.5rem', '1.5', '600'),
    'st-highlight-medium': textStyle('1.125rem', '1.5', '600'),
    'st-body-large': textStyle('1.125rem', '1.75', '400'),
    'st-body-medium': textStyle('1rem', '1.75', '400'),
    'st-body-small': textStyle('0.875rem', '1.5', '400'),
    'st-hero-title': textStyle('3rem', '1.5', '800')
  },
  lineHeight: {
    'st-tight': '1.1',
    'st-snug': '1.25',
    'st-normal': '1.5',
    'st-relaxed': '1.75',
    'st-loose': '2'
  },
  letterSpacing: {
    'st-tight': '-0.025em',
    'st-normal': '0',
    'st-wide': '0.025em',
    'st-wider': '0.05em'
  },
  borderRadius: {
    'st-1': '8px',
    'st-2': '16px'
  },
  boxShadow: {
    'st-paper-0': '0 0 0 0 transparent',
    'st-paper-1':
      '0 1px 3px 0 var(--st-color-shadow-0), 0 1px 2px 0 var(--st-color-shadow-1)',
    'st-paper-2':
      '0 4px 6px -1px var(--st-color-shadow-0), 0 2px 4px -1px var(--st-color-shadow-1)',
    'st-paper-3':
      '0 10px 15px -3px var(--st-color-shadow-0), 0 4px 6px -2px var(--st-color-shadow-1)',
    'st-paper-4':
      '0 20px 25px -5px var(--st-color-shadow-0), 0 10px 10px -5px var(--st-color-shadow-1)',
    'st-action-hover': '0 0 16px 2px var(--st-color-shadow-hover)',
    'st-action-pressed': '0 0 16px 4px var(--st-color-shadow-pressed)'
  },
  dropShadow: {
    'st-action-hover': [
      '0 0 8px var(--st-color-shadow-hover)',
      '0 0 16px var(--st-color-shadow-hover)'
    ],
    'st-action-pressed': [
      '0 0 16px var(--st-color-shadow-pressed)',
      '0 0 24px var(--st-color-shadow-pressed)'
    ]
  },
  spacing: spacingScale,
  textShadow: {
    'st-small': '-1px 1px transparent, -2px 2px var(--st-shadow-scale-950)',
    'st-medium': '-1px 1px transparent, -3px 3px var(--st-shadow-scale-950)',
    'st-large': '-2px 2px transparent, -4px 4px var(--st-shadow-scale-950)',
    'st-action-hover': '0 0 16px var(--st-color-shadow-hover)',
    'st-action-pressed': '0 0 16px var(--st-color-shadow-pressed)'
  },
  keyframes: {
    'st-loading-arrow': {
      '0%': { transform: 'translateX(-200%)' },
      '33%': { transform: 'translateX(0%)' },
      '66%': { transform: 'translateX(0%)' },
      '100%': { transform: 'translateX(200%)' }
    },
    'st-s10-1': {
      '0%': {
        clipPath: 'polygon(50% 50%,0 0,50% 0%,50% 0%,50% 0%,50% 0%,50% 0%)'
      },
      '12.5%': {
        clipPath: 'polygon(50% 50%,0 0,50% 0%,100% 0%,100% 0%,100% 0%,100% 0%)'
      },
      '25%': {
        clipPath:
          'polygon(50% 50%,0 0,50% 0%,100% 0%,100% 100%,100% 100%,100% 100%)'
      },
      '50%': {
        clipPath:
          'polygon(50% 50%,0 0,50% 0%,100% 0%,100% 100%,50% 100%,0% 100%)'
      },
      '62.5%': {
        clipPath:
          'polygon(50% 50%,100% 0,100% 0%,100% 0%,100% 100%,50% 100%,0% 100%)'
      },
      '75%': {
        clipPath:
          'polygon(50% 50%,100% 100%,100% 100%,100% 100%,100% 100%,50% 100%,0% 100%)'
      },
      '100%': {
        clipPath:
          'polygon(50% 50%,50% 100%,50% 100%,50% 100%,50% 100%,50% 100%,0% 100%)'
      }
    },
    'st-s10-2': {
      '0%': { transform: 'scaleY(1) rotate(0deg)' },
      '49.9%': { transform: 'scaleY(1) rotate(135deg)' },
      '50%': { transform: 'scaleY(-1) rotate(0deg)' },
      '100%': { transform: 'scaleY(-1) rotate(-135deg)' }
    }
  },
  animation: {
    'st-loading-arrow': 'st-loading-arrow 1.5s ease-in-out infinite',
    'st-spinner-infinite':
      'st-s10-1 0.8s infinite linear alternate, st-s10-2 1.6s linear infinite'
  }
} as const;

export const stTailwindPlugins = [
  function ({ addUtilities, theme }: TailwindPluginApi) {
    addUtilities(
      createTextShadowUtilities(
        theme('textShadow') as Record<string, string> | undefined
      )
    );
  }
];

export const stCssTokenImport = '@startbet/st-core-ui/tokens.css';
