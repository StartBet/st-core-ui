# StChip

Componente de chip da biblioteca para exibir estados semânticos compactos, com suporte a modo clicável, fechamento opcional e integração com `StIcon`.

## Import

```ts
import { StChip } from '@startbet/st-core-ui';
```

## Variantes disponíveis

- `primary`
- `secondary`
- `info`
- `system`
- `warning`
- `positive`
- `negative`

## Props principais

- `variant`: define a cor semântica do chip. Default: `primary`.
- `clickable`: habilita interação por mouse e teclado. Default: `false`.
- `closable`: renderiza o botão interno de fechar. Default: `false`.
- `onClose`: callback disparado ao clicar no botão de fechar.
- `className`: injeta classes extras no container.

## Exemplo básico

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

## Exemplo clicável

```vue
<script setup lang="ts">
const handleClick = () => console.log('chip click');
</script>

<template>
  <StChip clickable @click="handleClick">Clicável</StChip>
</template>
```

## Exemplo fechável

```vue
<script setup lang="ts">
const handleClose = () => console.log('chip close');
</script>

<template>
  <StChip closable :on-close="handleClose">Fechável</StChip>
</template>
```

## Regras internas

- Quando `clickable=true`, o chip recebe `role="button"` e `tabindex="0"`.
- `Enter` e `Space` disparam o mesmo evento de `click` do container.
- Quando `closable=true`, o botão interno usa `@click.stop` para não propagar o click do chip.
- O botão de close renderiza `StIcon` com `xmark`.

## Observações

- O componente faz `v-bind="$attrs"` no container, mas filtra `onClick`, `onKeydown` e `onKeyDown` para manter a regra de interação baseada em `clickable`.
- O `xmark` usado no close é registrado internamente pelo próprio componente.
