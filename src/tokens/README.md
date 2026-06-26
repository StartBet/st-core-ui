# Tokens Tailwind

## Reutilizando o tema no Tailwind do projeto consumidor

Além dos arquivos CSS, a biblioteca exporta `stTailwindTheme` e `stTailwindPlugins` para reaproveitar os mesmos tokens no `tailwind.config.ts`.

Ao usar esse tema no projeto consumidor, importe tambem `@startbet/st-core-ui/tokens.css` na entrada da aplicacao para disponibilizar as variaveis CSS consumidas pelo tema.

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

```ts
import { createApp } from 'vue';
import App from './App.vue';

import '@startbet/st-core-ui/tokens.css';

createApp(App).mount('#app');
```
