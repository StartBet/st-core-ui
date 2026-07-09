# StList

Conjunto de componentes de lista da biblioteca para compor navegacao, menus e agrupamentos de itens com suporte a orientacao horizontal ou vertical, densidade reduzida e sub-listas aninhadas.

## Import

```ts
import {
  StListItem,
  StOrderedList,
  StUnorderedList
} from '@startbet/st-core-ui';
```

## Componentes disponíveis

- `StListItem`: item base da lista, com suporte a slots, estados e submenu.
- `StOrderedList`: container baseado em `<ol>`.
- `StUnorderedList`: container baseado em `<ul>`.

## Exemplo básico

```vue
<script setup lang="ts">
import { StListItem, StUnorderedList } from '@startbet/st-core-ui';
</script>

<template>
  <StUnorderedList>
    <StListItem clickable>Painel</StListItem>
    <StListItem clickable>Apostas</StListItem>
    <StListItem clickable>Promoções</StListItem>
  </StUnorderedList>
</template>
```

## Exemplo com submenu

```vue
<script setup lang="ts">
import { StListItem, StUnorderedList } from '@startbet/st-core-ui';
</script>

<template>
  <StUnorderedList orientation="horizontal">
    <StListItem clickable>Início</StListItem>
    <StListItem clickable>
      Produtos

      <StUnorderedList>
        <StListItem clickable>Esportes</StListItem>
        <StListItem clickable>Cassino</StListItem>
      </StUnorderedList>
    </StListItem>
  </StUnorderedList>
</template>
```

## Regras internas

- Sub-listas sempre renderizam visualmente em orientacao vertical, mesmo quando a lista pai e horizontal.
- Quando a navegacao principal e horizontal, o `StListItem` abre a primeira sub-lista encontrada via `StDropdown`.
- Quando a navegacao principal e vertical, o `StListItem` expande ou recolhe a sub-lista inline.
- O primeiro `StOrderedList` ou `StUnorderedList` encontrado dentro do slot default de `StListItem` e tratado como submenu.

## Observações

- Os stories do conjunto ficam centralizados em `src/components/list/StList.stories.ts`.
- O submenu usa `StButton`, `StDropdown` e `StIcon`, então os ícones usados no contexto da aplicacao precisam estar registrados.
