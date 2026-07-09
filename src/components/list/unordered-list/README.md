# StUnorderedList

Lista não ordenada da biblioteca baseada em `<ul>`, usada para menus, agrupamentos e estruturas de navegacao compostas com `StListItem`.

## Import

```ts
import { StUnorderedList } from '@startbet/st-core-ui';
```

## Props principais

- `orientation`: controla a orientacao da lista entre `vertical` e `horizontal`. Default: `vertical`.
- `dense`: reduz ou remove o gap entre os itens.
- `className`: injeta classes extras no container raiz.

## Exemplo básico

```vue
<script setup lang="ts">
import { StListItem, StUnorderedList } from '@startbet/st-core-ui';
</script>

<template>
  <StUnorderedList>
    <StListItem clickable>Painel</StListItem>
    <StListItem clickable>Bilhetes</StListItem>
    <StListItem clickable>Carteira</StListItem>
  </StUnorderedList>
</template>
```

## Exemplo horizontal

```vue
<script setup lang="ts">
import { StListItem, StUnorderedList } from '@startbet/st-core-ui';
</script>

<template>
  <StUnorderedList orientation="horizontal">
    <StListItem clickable>Início</StListItem>
    <StListItem clickable>Ao vivo</StListItem>
    <StListItem clickable>Promoções</StListItem>
  </StUnorderedList>
</template>
```

## Regras internas

- Quando renderizada dentro de outra lista, a orientacao visual passa a ser vertical automaticamente.
- A `navOrientation` do contexto pai continua sendo propagada para controlar o comportamento de submenu em `StListItem`.
- No modo horizontal, a lista usa layout flexivel com quebra de linha e sem bullets nativos.
