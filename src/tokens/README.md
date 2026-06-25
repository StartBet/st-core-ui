# Tokens Tailwind

## Reutilizando o tema no Tailwind do projeto consumidor

Além dos arquivos CSS, a biblioteca exporta `stTailwindTheme` e `stTailwindPlugins` para reaproveitar os mesmos tokens no `tailwind.config.ts`.

Exemplo:

```ts
import type { Config } from 'tailwindcss';

import { stTailwindPlugins, stTailwindTheme } from '@startbet/st-core-ui';

export default {
  content: ['./src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: stTailwindTheme
  },
  plugins: stTailwindPlugins
} satisfies Config;
```
