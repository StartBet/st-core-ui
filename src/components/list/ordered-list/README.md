# StOrderedList

Lista ordenada da biblioteca baseada em `<ol>`, pensada para sequencias numeradas e navegacoes que precisam manter contexto hierarquico com `StListItem`.

## Import

```ts
import { StOrderedList } from '@startbet/st-core-ui';
```

## Props principais

- `orientation`: controla a orientacao da lista entre `vertical` e `horizontal`. Default: `vertical`.
- `dense`: reduz ou remove o gap entre os itens.
- `className`: injeta classes extras no container raiz.

## Exemplo básico

```vue
<script setup lang="ts">
import { StListItem, StOrderedList } from '@startbet/st-core-ui';
</script>

<template>
  <StOrderedList>
    <StListItem clickable>Passo 1</StListItem>
    <StListItem clickable>Passo 2</StListItem>
    <StListItem clickable>Passo 3</StListItem>
  </StOrderedList>
</template>
```

## Exemplo horizontal

```vue
<script setup lang="ts">
import { StListItem, StOrderedList } from '@startbet/st-core-ui';
</script>

<template>
  <StOrderedList orientation="horizontal">
    <StListItem clickable>Início</StListItem>
    <StListItem clickable>Conferência</StListItem>
    <StListItem clickable>Resumo</StListItem>
  </StOrderedList>
</template>
```

## Regras internas

- Quando renderizada dentro de outra lista, a orientacao visual passa a ser vertical automaticamente.
- O contexto interno continua propagando a `navOrientation` da lista pai para o comportamento de submenu do `StListItem`.
- No modo horizontal, a lista remove a numeracao nativa e usa layout flexivel em linha.
