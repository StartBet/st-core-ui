# StBadge

Componente de badge da biblioteca para exibir contagens, estados pontuais e indicadores semanticos com suporte a `dot`, valor formatado e animacao de pulse.

## Import

```ts
import { StBadge } from '@startbet/st-core-ui';
```

## Variantes disponiveis

- `info`
- `system`
- `warning`
- `positive`
- `negative`

## Tamanhos disponiveis

- `small`
- `medium`

## Props principais

- `variant`: define a cor semantica do badge. Default: `info`.
- `size`: define a escala visual do badge. Default: `small`.
- `value`: renderiza um valor numerico ou textual. Sem valor, o componente vira um `dot`.
- `pulse`: aplica `animate-ping` no ring do badge.
- `className`: injeta classes extras no container.

## Exemplo basico

```vue
<script setup lang="ts">
import { StBadge } from '@startbet/st-core-ui';
</script>

<template>
  <StBadge />
  <StBadge :value="7" />
</template>
```

## Exemplo com variantes

```vue
<template>
  <div class="flex items-center gap-st-2">
    <StBadge variant="info" :value="12" />
    <StBadge variant="negative" :value="120" />
    <StBadge variant="warning" size="medium" pulse />
  </div>
</template>
```

## Regras internas

- Sem `value`, o componente renderiza como `dot`.
- `number > 99` vira `99+`.
- `string` com mais de `4` caracteres e truncada para `4` caracteres com `…`.
- O ring sempre e renderizado como elemento interno com `border` da variante.

## Observacoes

- O badge usa os tokens semanticos de cor da biblioteca (`st-info`, `st-system`, `st-warning`, `st-positive`, `st-negative`).
- O tamanho `small` usa `text-st-xs` quando renderiza valor.
- O tamanho `medium` usa `text-st-sm` quando renderiza valor.
