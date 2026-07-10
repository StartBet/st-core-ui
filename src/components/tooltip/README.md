# StTooltip

Componente de tooltip da biblioteca para exibir conteúdo contextual flutuante a partir de hover, foco ou controle externo.

## Import

```ts
import { StTooltip } from '@startbet/st-core-ui';
```

## Slots

- `trigger`: conteúdo que recebe a interação do tooltip.
- `default`: conteúdo exibido no painel do tooltip.

## Props principais

- `placement`: define a posição do painel. Aceita `top`, `bottom`, `left` ou `right`. Default: `top`.
- `offset`: define a distância entre trigger e painel. Default: `8`.
- `open`: controla o estado aberto de forma externa.
- `defaultOpen`: define o estado inicial no modo não controlado. Default: `false`.
- `onOpenChange`: callback disparado quando o estado aberto muda.
- `disabled`: impede abertura por hover, foco ou interação de teclado. Default: `false`.
- `triggerProps`: permite encaminhar atributos e handlers extras para o wrapper do trigger.
- `className`: injeta classes extras no container raiz.
- `panelClassName`: injeta classes extras no painel flutuante.

## Eventos

- `update:open`: emitido quando o estado aberto muda.
- `open-change`: emitido junto com a mudança de estado.

## Exemplo básico

```vue
<template>
  <StTooltip>
    <template #trigger>
      <button
        type="button"
        class="rounded-st-1 border border-st-border-2 px-st-2 py-st-1"
      >
        Passe o mouse
      </button>
    </template>

    Conteúdo do tooltip
  </StTooltip>
</template>
```

## Exemplo controlado

```vue
<script setup lang="ts">
import { ref } from 'vue';

const open = ref(false);
</script>

<template>
  <StTooltip :open="open" @update:open="open = $event">
    <template #trigger>
      <button
        type="button"
        class="rounded-st-1 border border-st-border-2 px-st-2 py-st-1"
      >
        Tooltip controlado
      </button>
    </template>

    Tooltip aberto por estado externo
  </StTooltip>
</template>
```

## Exemplo com `triggerProps`

```vue
<template>
  <StTooltip
    :trigger-props="{
      title: 'Ajuda contextual',
      className: 'rounded-st-1 outline outline-1 outline-st-border-2'
    }"
  >
    <template #trigger>
      <span tabindex="0" class="inline-flex px-st-2 py-st-1">Foque aqui</span>
    </template>

    Tooltip com atributos adicionais no trigger
  </StTooltip>
</template>
```

## Regras internas

- O painel usa `role="tooltip"` e associa o trigger com `aria-describedby` quando aberto.
- O posicionamento usa `position: fixed` com atualização em `resize`, `scroll` e `ResizeObserver`.
- O tooltip fecha com `Escape`, `mouseleave` e `blur`.
