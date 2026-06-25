import type { Config } from 'tailwindcss';

import { stTailwindPlugins, stTailwindTheme } from './src/tokens';

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,tsx}',
    './.storybook/**/*.{js,ts,vue}'
  ],
  theme: {
    extend: stTailwindTheme
  },
  plugins: stTailwindPlugins
} satisfies Config;
