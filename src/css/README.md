# CSS Da Biblioteca

Este diretório concentra os arquivos CSS publicados pela `@startbet/st-core-ui`.

## Arquivos

- `style.css`: entrada principal com Tailwind + tokens da biblioteca.
- `tokens.css`: variáveis CSS de cores, superfícies, estados e temas claro/escuro.
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

## Estrutura de temas em `tokens.css`

O arquivo é dividido em três blocos, nessa ordem:

| Bloco       | Seletor                       | Conteúdo                                                                                                                 |
| ----------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Primitivas  | `:root`                       | paletas e escalas cruas (`--st-brand-primary-500`, `--st-shadow-scale-*`, ...). Nunca mudam com o tema.                  |
| Tema claro  | `:root, [data-theme='light']` | aliases semânticos (`--st-color-surface-*`, `--st-color-content-*`, `--st-color-border-*`, ...) + `color-scheme: light`. |
| Tema escuro | `[data-theme='dark']`         | os mesmos aliases semânticos em versão escura + `color-scheme: dark`.                                                    |

### Como aplicar

O tema é ativado pelo atributo `data-theme` em **qualquer** elemento, não apenas no `<html>`:

```html
<html data-theme="dark">
  <!-- tudo escuro -->
  <section data-theme="light">
    <!-- ilha clara dentro do app escuro -->
  </section>
</html>
```

Sem nenhum `data-theme` na página o tema claro vale por padrão, via `:root`.

### Regras de manutenção

- Os dois blocos de tema têm **a mesma especificidade** (`0,1,0`). O empate no elemento raiz é resolvido por ordem de origem — por isso o bloco escuro vem depois do claro. Não volte a usar `:root[data-theme='dark']`: a especificidade maior faria o tema do `<html>` vencer qualquer provider aninhado.
- Aliases novos precisam ser declarados **nos dois blocos de tema**, nunca só em um.
- Primitivas ficam apenas em `:root`. Redeclarar primitiva dentro de um bloco de tema aumenta o custo de recálculo e quebra a separação entre "valor cru" e "decisão de tema".
- `color-scheme` acompanha o atributo, então scrollbars, `<select>`, autofill e demais controles nativos seguem o tema da ilha automaticamente.
- A escolha entre claro e escuro é explícita — não há `@media (prefers-color-scheme)` no CSS. A preferência do sistema é resolvida em JS por quem controla o tema, mantendo um único ponto de decisão.
