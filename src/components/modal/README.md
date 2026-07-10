# StModal

Componente de modal da biblioteca para exibir conteúdo sobreposto ao viewport, com `Teleport`, fechamento por `Escape` e reaproveitamento da API visual do `StPaper`.

## Import

```ts
import { StModal } from '@startbet/st-core-ui';
```

## Slots

- `default`: conteúdo renderizado dentro do modal.

## Props principais

- `open`: controla a visibilidade do modal. Default: `false`.
- `showCloseButton`: exibe o botão de fechar no canto superior. Default: `false`.
- `closeOnOutsideClick`: fecha ao clicar no overlay. Default: `false`.
- `variant`: controla a superfície visual do container.
- `border`: define a borda aplicada ao `StPaper`.
- `borderRadius`: define o raio do container. Default: `1`.
- `elevation`: define a sombra do container. Default: `2`.
- `interactive`: reaproveita o comportamento visual interativo do `StPaper`.
- `bgImage`: aplica imagem de fundo ao container.
- `width` / `height`: controlam dimensões do container.
- `padding`, `paddingSm`, `paddingMd`, `paddingLg`: controlam o espaçamento interno.
- `margin`, `marginSm`, `marginMd`, `marginLg`: controlam o espaçamento externo.
- `className`: injeta classes extras no container do modal.

## Eventos

- `update:open`: retorna `false` quando o modal é fechado por ação interna.
- `close`: emitido junto com o fechamento do modal.

## Exemplo básico

```vue
<script setup lang="ts">
import { ref } from 'vue';

import { StButton, StModal, StTypography } from '@startbet/st-core-ui';

const open = ref(false);
</script>

<template>
  <StButton @click="open = true">Abrir modal</StButton>

  <StModal :open="open" width="64" padding="4" @update:open="open = $event">
    <div class="flex flex-col gap-st-3">
      <StTypography as="h2" variant="heading-3">Título do modal</StTypography>
      <StTypography as="p" variant="body-medium">
        Conteúdo principal do modal.
      </StTypography>
      <StButton @click="open = false">Fechar</StButton>
    </div>
  </StModal>
</template>
```

## Exemplo com botão de fechar

```vue
<StModal
  :open="open"
  show-close-button
  close-on-outside-click
  width="64"
  padding="4"
  @update:open="open = $event"
>
  <div class="flex flex-col gap-st-3">
    <p class="m-0">Este modal pode ser fechado pelo botão, clique fora ou Escape.</p>
  </div>
</StModal>
```

## Regras internas

- O componente usa `Teleport` para `body`.
- O conteúdo central é renderizado com `StPaper`, então o modal reaproveita toda a API visual desse componente.
- O fechamento por `Escape` só fica ativo enquanto o modal está aberto.
