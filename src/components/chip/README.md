# StChip

Componente de chip da biblioteca para exibir estados semanticos compactos, com suporte a modo clicavel, fechamento opcional e integracao com `StIcon`.

## Import

```ts
import { StChip } from '@startbet/st-core-ui';
```

## Variantes disponiveis

- `primary`
- `secondary`
- `info`
- `system`
- `warning`
- `positive`
- `negative`

## Props principais

- `variant`: define a cor semantica do chip. Default: `primary`.
- `clickable`: habilita interacao por mouse e teclado. Default: `false`.
- `closable`: renderiza o botao interno de fechar. Default: `false`.
- `onClose`: callback disparado ao clicar no botao de fechar.
- `className`: injeta classes extras no container.

## Exemplo basico

```vue
<script setup lang="ts">
import { StChip } from '@startbet/st-core-ui';
</script>

<template>
  <div class="flex flex-wrap gap-st-2">
    <StChip>Default</StChip>
    <StChip variant="warning">Warning</StChip>
  </div>
</template>
```

## Exemplo clicavel

```vue
<script setup lang="ts">
const handleClick = () => console.log('chip click');
</script>

<template>
  <StChip clickable @click="handleClick">Clicavel</StChip>
</template>
```

## Exemplo fechavel

```vue
<script setup lang="ts">
const handleClose = () => console.log('chip close');
</script>

<template>
  <StChip closable :on-close="handleClose">Fechavel</StChip>
</template>
```

## Regras internas

- Quando `clickable=true`, o chip recebe `role="button"` e `tabindex="0"`.
- `Enter` e `Space` disparam o mesmo evento de `click` do container.
- Quando `closable=true`, o botao interno usa `@click.stop` para nao propagar o click do chip.
- O botao de close renderiza `StIcon` com `xmark`.

## Observacoes

- O componente faz `v-bind="$attrs"` no container, mas filtra `onClick`, `onKeydown` e `onKeyDown` para manter a regra de interacao baseada em `clickable`.
- O `xmark` usado no close e registrado internamente pelo proprio componente.
