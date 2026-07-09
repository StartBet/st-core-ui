# StListItem

Item de lista da biblioteca para composicao de navegacao e menus, com suporte a adornos, estados visuais e sub-listas aninhadas.

## Import

```ts
import { StListItem } from '@startbet/st-core-ui';
```

## Props principais

- `size`: controla o padding e a escala tipografica entre `small`, `medium` e `large`. Default: `medium`.
- `dense`: reduz o espacamento interno do item.
- `divider`: aplica divisor inferior e destaque visual na interacao.
- `selected`: aplica o estado selecionado do item.
- `disabled`: bloqueia a interacao do item e do submenu.
- `clickable`: renderiza a area principal como botao.
- `expanded`: controla externamente a abertura do submenu.
- `defaultExpanded`: define o estado inicial do submenu no modo nao controlado.
- `onExpandedChange`: callback executado ao alternar o submenu.
- `onClick`: callback executado ao clicar no item principal.
- `className`: injeta classes extras no elemento raiz.

## Slots

- `default`: conteudo principal do item.
- `startAdornment`: conteudo renderizado no inicio do item.
- `endAdornment`: conteudo renderizado no fim do item.

## Exemplo básico

```vue
<script setup lang="ts">
import { StListItem, StUnorderedList } from '@startbet/st-core-ui';
</script>

<template>
  <StUnorderedList>
    <StListItem clickable>
      <template #startAdornment>
        <span class="text-st-body-small text-st-content-default">D</span>
      </template>

      Dashboard

      <template #endAdornment>
        <span class="text-st-body-small text-st-content-ghost">12</span>
      </template>
    </StListItem>
  </StUnorderedList>
</template>
```

## Exemplo com submenu

```vue
<script setup lang="ts">
import { StListItem, StUnorderedList } from '@startbet/st-core-ui';
</script>

<template>
  <StUnorderedList>
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

- O primeiro `StOrderedList` ou `StUnorderedList` encontrado no slot default e tratado como submenu.
- Em listas verticais, o submenu abre inline.
- Em listas horizontais, o submenu abre via `StDropdown`.
- Quando `clickable=false`, o conteudo principal permanece estatico, mas o submenu continua disponivel quando existir.
