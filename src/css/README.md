# CSS Da Biblioteca

Este diretório concentra os arquivos CSS publicados pela `@startbet/st-core-ui`.

## Arquivos

- `style.css`: entrada principal com Tailwind + tokens da biblioteca.
- `tokens.css`: variáveis CSS de cores, superfícies, estados e tema dark.
- `base-neue.css`: declarações de `@font-face` da família Base Neue.

## Como importar em um projeto Vue

### 1. Importação completa

Use quando quiser carregar a base visual da biblioteca, incluindo Tailwind, tokens e fontes.

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

### 2. Importar somente tokens

Use quando o projeto consumidor já possui seu próprio pipeline Tailwind e precisa apenas reutilizar as variáveis CSS da biblioteca.

```ts
import '@startbet/st-core-ui/tokens.css';
```

### 3. Importar somente fontes Base Neue

Use quando quiser disponibilizar a família tipográfica sem carregar os tokens completos.

```ts
import '@startbet/st-core-ui/base-neue.css';
```

## Recomendações

- Prefira `style.css` quando quiser a experiência completa da biblioteca.
- Prefira `tokens.css` quando o projeto já controla o Tailwind e só precisa das variáveis.
- Use `base-neue.css` apenas quando a necessidade for exclusivamente tipográfica.
