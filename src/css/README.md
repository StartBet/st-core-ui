# CSS Da Biblioteca

Este diretório concentra os arquivos CSS publicados pela `@startbet/st-core-ui`.

## Arquivos

- `style.css`: entrada principal com Tailwind + tokens da biblioteca.
- `tokens.css`: variáveis CSS de cores, superfícies, estados e tema dark.
- `base-neue.css`: declarações de `@font-face` da família Base Neue.

## Como importar em um projeto Vue

### 1. Projeto novo ou simples

Use quando quiser carregar a base visual da biblioteca com a menor configuracao possivel, incluindo Tailwind, tokens e fontes.

```ts
import '@startbet/st-core-ui/style.css';
```

Exemplo em `src/main.ts`:

```ts
import { createApp } from 'vue';
import App from './App.vue';

import '@startbet/st-core-ui/style.css';

createApp(App).mount('#app');
```

### 2. Projeto existente com Tailwind proprio

Use quando o projeto consumidor ja possui seu proprio pipeline Tailwind e precisa apenas reutilizar as variaveis CSS da biblioteca sem substituir a configuracao local.

Nesse cenario, prefira importar `tokens.css` no CSS global principal que ja contem as diretivas `@tailwind`.

Exemplo em `app/assets/css/main.css` ou equivalente:

```css
@import '@startbet/st-core-ui/tokens.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Depois faca o merge de `stTailwindTheme` e `stTailwindPlugins` no `tailwind.config` existente do projeto consumidor.

```ts
import '@startbet/st-core-ui/tokens.css';
```

### 3. Importar somente fontes Base Neue

Use quando quiser disponibilizar a família tipográfica sem carregar os tokens completos.

```ts
import '@startbet/st-core-ui/base-neue.css';
```

## Recomendações

- Prefira `style.css` em projetos novos ou simples.
- Prefira `tokens.css` em projetos que ja possuem configuracao Tailwind propria.
- Nao substitua o `tailwind.config` do consumidor quando ele ja existir; faca apenas merge do tema e dos plugins exportados pela biblioteca.
- Use `base-neue.css` apenas quando a necessidade for exclusivamente tipografica.
