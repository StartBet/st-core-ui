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
  'ds-xs': '0.75rem',
  'ds-sm': '0.875rem',
  'ds-base': '1rem',
  'ds-md': '1.125rem',
  'ds-lg': '1.25rem',
  'ds-xl': '1.5rem',
  'ds-2xl': '1.875rem',
  'ds-3xl': '2.25rem',
  'ds-4xl': '3rem',
  'ds-5xl': '3.75rem',
  'ds-6xl': '4.5rem',
  'ds-7xl': '5rem'
} as const;

const spacingScale = {
  ...sizeScale,
  'ds-1': '8px',
  'ds-2': '16px',
  'ds-3': '24px',
  'ds-4': '32px',
  'ds-5': '40px',
  'ds-6': '48px',
  'ds-7': '56px',
  'ds-8': '64px',
  'ds-9': '72px',
  'ds-10': '80px',
  'ds-11': '88px',
  'ds-12': '96px',
  'ds-15': '120px',
  'ds-16': '128px',
  'ds-20': '160px',
  'ds-24': '192px',
  'ds-30': '240px',
  'ds-32': '256px',
  'ds-40': '320px',
  'ds-48': '384px',
  'ds-56': '448px',
  'ds-64': '512px',
  'ds-72': '584px',
  'ds-80': '640px',
  'ds-96': '768px',
  'ds-128': '1024px',
  'ds-144': '1152px',
  'ds-160': '1280px',
  'ds-168': '1344px',
  'ds-240': '1920px'
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
    values.map((value) => [value, cssVar(`--${prefix}-${value}`)])
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
      brand: '--color-brand',
      primary: '--color-primary',
      secondary: '--color-secondary',
      info: '--color-info',
      system: '--color-system',
      warning: '--color-warning',
      positive: '--color-positive',
      negative: '--color-negative'
    }),
    surface: {
      ...tokenObject({
        0: '--color-surface-0',
        1: '--color-surface-1',
        2: '--color-surface-2',
        3: '--color-surface-3',
        4: '--color-surface-4',
        primary: '--color-surface-primary',
        secondary: '--color-surface-secondary',
        info: '--color-surface-info',
        system: '--color-surface-system',
        warning: '--color-surface-warning',
        positive: '--color-surface-positive',
        negative: '--color-surface-negative'
      }),
      shadow: tokenObject({
        0: '--color-surface-shadow-0',
        1: '--color-surface-shadow-1',
        2: '--color-surface-shadow-2',
        3: '--color-surface-shadow-3'
      })
    },
    content: tokenObject({
      default: '--color-content-default',
      disable: '--color-content-disable',
      ghost: '--color-content-ghost',
      bright: '--color-content-bright',
      din: '--color-content-din',
      primary: '--color-content-primary',
      secondary: '--color-content-secondary',
      info: '--color-content-info',
      system: '--color-content-system',
      warning: '--color-content-warning',
      positive: '--color-content-positive',
      negative: '--color-content-negative'
    }),
    border: tokenObject({
      1: '--color-border-1',
      2: '--color-border-2',
      3: '--color-border-3'
    }),
    ...tokenObject({
      focus: '--color-focus',
      pressed: '--color-pressed',
      hover: '--color-hover'
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
    heading: ['"Base Neue Condensed"', 'sans-serif'],
    highlight: ['"Base Neue Condensed"', 'sans-serif'],
    body: ['Montserrat', 'sans-serif']
  },
  fontSize: {
    ...sizeScale,
    'heading-1': textStyle('3rem', '1.1', '800'),
    'heading-2': textStyle('2.25rem', '1.1', '800'),
    'heading-3': textStyle('1.875rem', '1.25', '800'),
    'heading-4': textStyle('1.5rem', '1.25', '800'),
    'highlight-large': textStyle('1.5rem', '1.5', '600'),
    'highlight-medium': textStyle('1.125rem', '1.5', '600'),
    'body-large': textStyle('1.125rem', '1.75', '400'),
    'body-medium': textStyle('1rem', '1.75', '400'),
    'body-small': textStyle('0.875rem', '1.5', '400'),
    'hero-title': textStyle('3rem', '1.5', '800')
  },
  lineHeight: {
    'ds-tight': '1.1',
    'ds-snug': '1.25',
    'ds-normal': '1.5',
    'ds-relaxed': '1.75',
    'ds-loose': '2'
  },
  letterSpacing: {
    'ds-tight': '-0.025em',
    'ds-normal': '0',
    'ds-wide': '0.025em',
    'ds-wider': '0.05em'
  },
  borderRadius: {
    'ds-1': '8px',
    'ds-2': '16px'
  },
  boxShadow: {
    'paper-0': '0 0 0 0 transparent',
    'paper-1':
      '0 1px 3px 0 var(--color-shadow-0), 0 1px 2px 0 var(--color-shadow-1)',
    'paper-2':
      '0 4px 6px -1px var(--color-shadow-0), 0 2px 4px -1px var(--color-shadow-1)',
    'paper-3':
      '0 10px 15px -3px var(--color-shadow-0), 0 4px 6px -2px var(--color-shadow-1)',
    'paper-4':
      '0 20px 25px -5px var(--color-shadow-0), 0 10px 10px -5px var(--color-shadow-1)',
    'action-hover': '0 0 16px 2px var(--color-shadow-hover)',
    'action-pressed': '0 0 16px 4px var(--color-shadow-pressed)'
  },
  dropShadow: {
    'action-hover': [
      '0 0 8px var(--color-shadow-hover)',
      '0 0 16px var(--color-shadow-hover)'
    ],
    'action-pressed': [
      '0 0 16px var(--color-shadow-pressed)',
      '0 0 24px var(--color-shadow-pressed)'
    ]
  },
  spacing: spacingScale,
  textShadow: {
    'ds-small': '-1px 1px transparent, -2px 2px var(--shadow-scale-950)',
    'ds-medium': '-1px 1px transparent, -3px 3px var(--shadow-scale-950)',
    'ds-large': '-2px 2px transparent, -4px 4px var(--shadow-scale-950)',
    'action-hover': '0 0 16px var(--color-shadow-hover)',
    'action-pressed': '0 0 16px var(--color-shadow-pressed)'
  },
  keyframes: {
    'loading-arrow': {
      '0%': { transform: 'translateX(-200%)' },
      '33%': { transform: 'translateX(0%)' },
      '66%': { transform: 'translateX(0%)' },
      '100%': { transform: 'translateX(200%)' }
    },
    's10-1': {
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
    's10-2': {
      '0%': { transform: 'scaleY(1) rotate(0deg)' },
      '49.9%': { transform: 'scaleY(1) rotate(135deg)' },
      '50%': { transform: 'scaleY(-1) rotate(0deg)' },
      '100%': { transform: 'scaleY(-1) rotate(-135deg)' }
    }
  },
  animation: {
    'loading-arrow': 'loading-arrow 1.5s ease-in-out infinite',
    'spinner-infinite':
      's10-1 0.8s infinite linear alternate, s10-2 1.6s linear infinite'
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
