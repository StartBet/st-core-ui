const cssVar = (token: string) => `var(${token})`;

type TailwindPluginApi = {
  addUtilities: (utilities: Record<string, Record<string, string>>[]) => void;
  theme: (path: string) => unknown;
};

const scale = (
  prefix: string,
  values: readonly (
    | 0
    | 100
    | 200
    | 300
    | 400
    | 500
    | 600
    | 700
    | 800
    | 900
    | 950
  )[]
) =>
  Object.fromEntries(
    values.map((value) => [value, cssVar(`--${prefix}-${value}`)])
  );

const shadowScale = scale(
  'shadow-scale',
  [100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
);
const lightScale = scale(
  'light-scale',
  [100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
);

export const stTailwindTheme = {
  colors: {
    brand: cssVar('--color-brand'),
    primary: cssVar('--color-primary'),
    secondary: cssVar('--color-secondary'),
    info: cssVar('--color-info'),
    system: cssVar('--color-system'),
    warning: cssVar('--color-warning'),
    positive: cssVar('--color-positive'),
    negative: cssVar('--color-negative'),
    surface: {
      0: cssVar('--color-surface-0'),
      1: cssVar('--color-surface-1'),
      2: cssVar('--color-surface-2'),
      3: cssVar('--color-surface-3'),
      4: cssVar('--color-surface-4'),
      shadow: {
        0: cssVar('--color-surface-shadow-0'),
        1: cssVar('--color-surface-shadow-1'),
        2: cssVar('--color-surface-shadow-2'),
        3: cssVar('--color-surface-shadow-3')
      },
      primary: cssVar('--color-surface-primary'),
      secondary: cssVar('--color-surface-secondary'),
      info: cssVar('--color-surface-info'),
      system: cssVar('--color-surface-system'),
      warning: cssVar('--color-surface-warning'),
      positive: cssVar('--color-surface-positive'),
      negative: cssVar('--color-surface-negative')
    },
    content: {
      default: cssVar('--color-content-default'),
      disable: cssVar('--color-content-disable'),
      ghost: cssVar('--color-content-ghost'),
      bright: cssVar('--color-content-bright'),
      din: cssVar('--color-content-din'),
      primary: cssVar('--color-content-primary'),
      secondary: cssVar('--color-content-secondary'),
      info: cssVar('--color-content-info'),
      system: cssVar('--color-content-system'),
      warning: cssVar('--color-content-warning'),
      positive: cssVar('--color-content-positive'),
      negative: cssVar('--color-content-negative')
    },
    border: {
      1: cssVar('--color-border-1'),
      2: cssVar('--color-border-2'),
      3: cssVar('--color-border-3')
    },
    focus: cssVar('--color-focus'),
    pressed: cssVar('--color-pressed'),
    hover: cssVar('--color-hover'),
    st: {
      'brand-primary': scale(
        'brand-primary',
        [100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
      ),
      'brand-secondary': scale(
        'brand-secondary',
        [100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
      ),
      neutral: scale(
        'neutral-color',
        [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
      ),
      info: scale(
        'info-color',
        [100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
      ),
      system: scale(
        'system-color',
        [100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
      ),
      positive: scale(
        'positive-color',
        [100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
      ),
      attention: scale(
        'attention-color',
        [100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
      ),
      negative: scale(
        'negative-color',
        [100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
      ),
      blue: scale(
        'blue-color',
        [100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
      ),
      ocean: scale(
        'ocean-color',
        [100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
      ),
      green: scale(
        'green-color',
        [100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
      ),
      yellow: scale(
        'yellow-color',
        [100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
      ),
      orange: scale(
        'orange-color',
        [100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
      ),
      red: scale(
        'red-color',
        [100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
      ),
      pink: scale(
        'pink-color',
        [100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
      ),
      purple: scale(
        'purple-color',
        [100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
      ),
      'shadow-scale': shadowScale,
      'light-scale': lightScale
    }
  },
  fontFamily: {
    heading: ['"Base Neue Condensed"', 'sans-serif'],
    highlight: ['"Base Neue Condensed"', 'sans-serif'],
    body: ['Montserrat', 'sans-serif']
  },
  fontSize: {
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
    'ds-7xl': '5rem',
    'heading-1': [
      '3rem',
      { lineHeight: '1.1', letterSpacing: '0', fontWeight: '800' }
    ],
    'heading-2': [
      '2.25rem',
      { lineHeight: '1.1', letterSpacing: '0', fontWeight: '800' }
    ],
    'heading-3': [
      '1.875rem',
      { lineHeight: '1.25', letterSpacing: '0', fontWeight: '800' }
    ],
    'heading-4': [
      '1.5rem',
      { lineHeight: '1.25', letterSpacing: '0', fontWeight: '800' }
    ],
    'highlight-large': [
      '1.5rem',
      { lineHeight: '1.5', letterSpacing: '0', fontWeight: '600' }
    ],
    'highlight-medium': [
      '1.125rem',
      { lineHeight: '1.5', letterSpacing: '0', fontWeight: '600' }
    ],
    'body-large': [
      '1.125rem',
      { lineHeight: '1.75', letterSpacing: '0', fontWeight: '400' }
    ],
    'body-medium': [
      '1rem',
      { lineHeight: '1.75', letterSpacing: '0', fontWeight: '400' }
    ],
    'body-small': [
      '0.875rem',
      { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }
    ],
    'hero-title': [
      '3rem',
      { lineHeight: '1.5', letterSpacing: '0', fontWeight: '800' }
    ]
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
  spacing: {
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
    'ds-7xl': '5rem',
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
  },
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
    const shadows = theme('textShadow') as Record<string, string> | undefined;
    const utilities = Object.entries(shadows ?? {}).map(([key, value]) => ({
      [`.text-shadow-${key}`]: {
        textShadow: value
      }
    }));

    addUtilities(utilities);
  }
];

export const stCssTokenImport = '@startbet/st-core-ui/tokens.css';
