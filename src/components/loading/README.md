# StLoading

Componente de carregamento da biblioteca para indicar processamento assíncrono com três variações visuais: `arrow`, `spinner` e `cyclical`.

## Import

```ts
import { StLoading } from '@startbet/st-core-ui';
```

## Props principais

- `type`: define o tipo visual do loading. Aceita `arrow`, `spinner` ou `cyclical`.
- `variant`: controla a paleta aplicada ao indicador. Aceita `primary`, `secondary` ou `tertiary`.
- `size`: define o tamanho do container. Aceita `3`, `4`, `6` ou `8`.
- `value`: controla o progresso do modo `cyclical`, com valores de `0` a `100`.
- `className`: permite complementar as classes do container raiz.

## Exemplo básico

```vue
<template>
  <StLoading />
</template>
```

## Exemplo com spinner

```vue
<template>
  <StLoading type="spinner" variant="secondary" size="6" />
</template>
```

## Exemplo com progresso

```vue
<script setup lang="ts">
import { ref } from 'vue';

const progress = ref(72);
</script>

<template>
  <StLoading type="cyclical" :value="progress" size="8" />
</template>
```

## Regras internas

- O componente expõe `role="status"` com `aria-live="polite"` para anunciar o estado de carregamento.
- A prop `value` só afeta a variação `cyclical`.
- Em tamanhos menores, a seta interna é simplificada para preservar legibilidade.
