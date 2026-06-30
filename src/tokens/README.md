# Tokens Tailwind

## Reutilizando o tema no Tailwind do projeto consumidor

Além dos arquivos CSS, a biblioteca exporta `stTailwindTheme` e `stTailwindPlugins` para reaproveitar os mesmos tokens no `tailwind.config.ts`.

## Cenario 1: projeto novo ou simples

Se o projeto consumidor ainda nao possui uma configuracao Tailwind relevante, voce pode usar um exemplo minimo:

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

```css
@import '@startbet/st-core-ui/tokens.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Cenario 2: projeto existente com Tailwind proprio

Se o consumidor ja possui `tailwind.config` e plugins locais, nao substitua essa configuracao. Faca somente merge do que a biblioteca exporta.

Exemplo:

```ts
import { stTailwindPlugins, stTailwindTheme } from '@startbet/st-core-ui';

export default {
  theme: {
    extend: {
      ...stTailwindTheme,
      spacing: {
        header: '72px'
      }
    }
  },
  plugins: [...stTailwindPlugins]
};
```

No CSS global principal do projeto, importe os tokens antes das diretivas Tailwind:

```css
@import '@startbet/st-core-ui/tokens.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Recomendacoes

- Use `stTailwindTheme` dentro de `theme.extend` em projetos existentes.
- Adicione `stTailwindPlugins` junto dos plugins ja usados pelo consumidor.
- Nao importe `tokens.css` em `main.ts` ou `app.vue` quando o projeto consumidor ja processa Tailwind em um arquivo CSS global; prefira o CSS global principal.
