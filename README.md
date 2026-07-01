# @startbet/st-core-ui

Biblioteca de componentes Vue 3 com Vite, Tailwind CSS e Storybook.

O pacote foi pensado para ser consumido em projetos Vue/Nuxt e tambem expõe tokens de design, estilos CSS e configuracao Tailwind reutilizavel.

## Recursos

- Componentes Vue 3 empacotados para consumo externo.
- Tokens CSS publicados para reutilizacao em outros projetos.
- Fontes locais `Base Neue` e `Montserrat`.
- Tema Tailwind exportavel com `stTailwindTheme` e `stTailwindPlugins`.
- Storybook para documentacao e desenvolvimento visual.
- Testes com Vitest e `@vue/test-utils`.
- Release automatizada com `semantic-release`.

## Instalacao

```bash
npm install @startbet/st-core-ui
```

## Uso

### Cenario 1: projeto novo ou simples

Use esse fluxo quando o projeto consumidor ainda nao possui uma configuracao Tailwind propria relevante e voce quer carregar rapidamente a base visual da biblioteca.

```ts
import { createApp } from 'vue';
import App from './App.vue';

import '@startbet/st-core-ui/style.css';

createApp(App).mount('#app');
```

```vue
<script setup lang="ts">
import { StExampleButton } from '@startbet/st-core-ui';
</script>

<template>
  <StExampleButton label="Acao principal" />
</template>
```

### Cenario 2: projeto existente com Tailwind proprio

Use esse fluxo quando o projeto consumidor ja controla o proprio `tailwind.config` e voce nao quer sobrescrever a configuracao local.

Nesse caso:

- mantenha a configuracao atual do projeto consumidor
- faca merge de `stTailwindTheme` em `theme.extend`
- adicione `stTailwindPlugins` junto com os plugins locais
- carregue `tokens.css` no CSS global principal do projeto
- nao use `style.css` como entrada principal nesse cenario

Exemplo de merge em um `tailwind.config.js` existente:

```ts
import { stTailwindPlugins, stTailwindTheme } from '@startbet/st-core-ui';

export default {
  content: ['./app/**/*.{vue,js,ts}', './components/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        ...stTailwindTheme.colors
      },
      fontFamily: {
        ...stTailwindTheme.fontFamily
      },
      fontSize: {
        ...stTailwindTheme.fontSize
      },
      lineHeight: {
        ...stTailwindTheme.lineHeight
      },
      letterSpacing: {
        ...stTailwindTheme.letterSpacing
      },
      borderRadius: {
        ...stTailwindTheme.borderRadius
      },
      boxShadow: {
        ...stTailwindTheme.boxShadow
      },
      dropShadow: {
        ...stTailwindTheme.dropShadow
      },
      spacing: {
        ...stTailwindTheme.spacing
      },
      textShadow: {
        ...stTailwindTheme.textShadow
      },
      keyframes: {
        ...stTailwindTheme.keyframes
      },
      animation: {
        ...stTailwindTheme.animation
      }
    }
  },
  plugins: [...stTailwindPlugins]
};
```

Exemplo de import dos tokens no CSS global principal:

```css
@import '@startbet/st-core-ui/tokens.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Fontes

Use quando quiser disponibilizar apenas a familia Base Neue.

```ts
import '@startbet/st-core-ui/base-neue.css';
```

## Integracao Com Tailwind

O pacote exporta `stTailwindTheme` e `stTailwindPlugins` para reutilizacao no `tailwind.config.ts`.

Para projetos novos ou simples, um exemplo minimo seria:

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

Para projetos existentes, prefira fazer merge em vez de substituir a configuracao local:

```ts
import { stTailwindPlugins, stTailwindTheme } from '@startbet/st-core-ui';

export default {
  theme: {
    extend: {
      ...stTailwindTheme
    }
  },
  plugins: [...stTailwindPlugins]
};
```

Ao usar essa integracao, carregue tambem os tokens CSS no CSS global principal da aplicacao:

```css
@import '@startbet/st-core-ui/tokens.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Exports Publicos

- `@startbet/st-core-ui`
- `@startbet/st-core-ui/style.css`
- `@startbet/st-core-ui/tokens.css`
- `@startbet/st-core-ui/base-neue.css`
- `@startbet/st-core-ui/tailwind.config`

## Scripts Do Projeto

```bash
npm run storybook
npm run build-storybook
npm run lint
npm run test:run
npm run test:coverage
npm run build
```

## Release

O projeto usa `semantic-release` com Conventional Commits.

Exemplos validos:

```bash
feat(button): adicionar nova variante
fix(tokens): corrigir token de hover
refactor(theme): reorganizar tema tailwind
```

Branches configuradas:

- `main`: release de producao.
- `develop`: prerelease beta.

## Estrutura

```text
src/
  components/   componentes Vue
  css/          entradas CSS publicadas
  tokens/       tema e plugins Tailwind exportados
  assets/fonts/ fontes locais publicadas
```

## Desenvolvimento Local

```bash
npm install
npm run storybook
```

Para validar antes de subir alteracoes:

```bash
npm run lint
npm run test:run
npm run build
```
