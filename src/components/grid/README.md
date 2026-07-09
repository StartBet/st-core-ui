# StGrid

Componente de layout da biblioteca para composicao de grades com controle de colunas, gaps, comportamento responsivo e shorthand de espacamento usando os tokens `st-*` do projeto.

## Import

```ts
import { StGrid } from '@startbet/st-core-ui';
```

## Props principais

- `cols`: define a quantidade base de colunas. Default: `1`.
- `gap`: aplica o gap geral entre linhas e colunas.
- `gapX`: aplica apenas o gap horizontal.
- `gapY`: aplica apenas o gap vertical.
- `smCols`, `mdCols`, `lgCols`: ajustam a quantidade de colunas por breakpoint.
- `padding`, `smPadding`, `mdPadding`, `lgPadding`: aplicam shorthand de espacamento para padding.
- `margin`, `smMargin`, `mdMargin`, `lgMargin`: aplicam shorthand de espacamento para margin.
- `className`: injeta classes extras no container raiz.

## Exemplo basico

```vue
<script setup lang="ts">
import { StGrid } from '@startbet/st-core-ui';
</script>

<template>
  <StGrid cols="2" gap="2">
    <div class="rounded-st-1 bg-st-surface-2 p-st-2">Item 1</div>
    <div class="rounded-st-1 bg-st-surface-2 p-st-2">Item 2</div>
    <div class="rounded-st-1 bg-st-surface-2 p-st-2">Item 3</div>
    <div class="rounded-st-1 bg-st-surface-2 p-st-2">Item 4</div>
  </StGrid>
</template>
```

## Exemplo responsivo

```vue
<script setup lang="ts">
import { StGrid } from '@startbet/st-core-ui';
</script>

<template>
  <StGrid cols="1" sm-cols="2" md-cols="3" lg-cols="4" gap="3">
    <div
      v-for="item in 8"
      :key="item"
      class="rounded-st-1 bg-st-surface-1 p-st-2 text-st-content-default"
    >
      Card {{ item }}
    </div>
  </StGrid>
</template>
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
- `mdPadding="3 6"` -> `md:py-st-3 md:px-st-6`

## Observacoes

- O componente renderiza um `div` com a classe base `grid`.
- As props responsivas controlam apenas as colunas; os gaps seguem o valor informado nas props base.
- `className` pode ser usado para complementar alinhamento, largura ou outras utilidades de layout no container.
