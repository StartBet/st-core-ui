# StPaper

Componente de superficie da biblioteca para compor containers com controle de background, borda, raio, sombra, dimensoes e espacamento usando os tokens `st-*` do projeto.

## Import

```ts
import { StPaper } from '@startbet/st-core-ui';
```

## Variantes disponiveis

- `surface-0`
- `surface-1`
- `surface-2`
- `surface-3`
- `surface-4`
- `surface-info`
- `surface-system`
- `surface-warning`
- `surface-positive`
- `surface-negative`
- `surface-primary`
- `surface-secondary`

## Props principais

- `variant`: define o background semantico da superficie. Default: `surface-1`.
- `border`: controla a borda do container. Default: `none`.
- `borderRadius`: controla o raio do container. Default: `1`.
- `elevation`: controla a sombra base entre `0` e `4`. Default: `1`.
- `interactive`: aplica estados de interacao com `cursor`, `active` e aumento de sombra no hover.
- `bgImage`: aplica uma imagem de fundo via `background-image`.
- `width` e `height`: aplicam classes semanticas de dimensao com a escala `st-*`.
- `padding`, `paddingSm`, `paddingMd`, `paddingLg`: aplicam shorthand de espacamento para padding.
- `margin`, `marginSm`, `marginMd`, `marginLg`: aplicam shorthand de espacamento para margin.
- `as`: permite trocar a tag HTML renderizada. Default: `div`.
- `className`: injeta classes extras no elemento raiz.

## Exemplo basico

```vue
<script setup lang="ts">
import { StPaper, StTypography } from '@startbet/st-core-ui';
</script>

<template>
  <StPaper variant="surface-2" padding="3" borderRadius="2">
    <StTypography as="h3" variant="heading-4"> Titulo do card </StTypography>
  </StPaper>
</template>
```

## Exemplo com interacao

```vue
<StPaper
  as="button"
  variant="surface-primary"
  border="1"
  elevation="2"
  interactive
  padding="2 3"
>
  Acao destacada
</StPaper>
```

## Shorthand de espacamento

O shorthand segue o padrao do CSS:

- `1 valor`: todos os lados
- `2 valores`: `vertical horizontal`
- `3 valores`: `top horizontal bottom`
- `4 valores`: `top right bottom left`

Exemplos:

- `padding="2"` -> `p-st-2`
- `padding="2 4"` -> `py-st-2 px-st-4`
- `margin="4 auto"` -> `my-st-4 mx-auto`
- `paddingMd="3 6"` -> `md:py-st-3 md:px-st-6`

## Observacoes

- O componente usa os tokens de `surface`, `border` e `shadow` ja publicados no tema Tailwind da biblioteca.
- Quando `interactive` esta ativo e `elevation` for menor que `4`, o componente sobe a sombra no hover automaticamente.
- `bgImage` adiciona tambem `bg-cover`, `bg-center` e `bg-no-repeat`.
