# StIcon

Componente de icone da biblioteca baseado em Font Awesome, com suporte a bibliotecas `fa` e `fab`, controle de tamanho pela escala visual do design system e fallback seguro quando o icone nao existir.

## Import

```ts
import { StIcon } from '@startbet/st-core-ui';
```

## Bibliotecas disponiveis

- `fa`
- `fab`

## Tamanhos disponiveis

- `1`
- `2`
- `3`
- `4`
- `5`
- `6`
- `7`
- `8`
- `9`
- `10`
- `11`
- `12`

## Props principais

- `name`: nome do icone a ser resolvido. Aceita nome simples como `plus` ou prefixado como `fab:facebook-f`.
- `lib`: define a biblioteca usada como fallback quando `name` nao vier prefixado. Default: `fa`.
- `size`: define a escala visual do container do icone entre `1` e `12`.
- `ariaLabel`: aplica rotulo acessivel no container e no `svg`.
- `className`: injeta classes extras no elemento raiz.

## Exemplo basico

```vue
<script setup lang="ts">
import { StIcon } from '@startbet/st-core-ui';
</script>

<template>
  <div class="flex items-center gap-st-2">
    <StIcon name="plus" :size="2" aria-label="Adicionar" />
    <StIcon name="chevron-right" :size="2" aria-label="Avancar" />
  </div>
</template>
```

## Exemplo com brand

```vue
<template>
  <div class="flex items-center gap-st-2">
    <StIcon name="fab:facebook-f" :size="3" aria-label="Facebook" />
    <StIcon name="fab:instagram" :size="3" aria-label="Instagram" />
  </div>
</template>
```

## Regras internas

- O componente registra os packs `free-solid` e `free-brands` do Font Awesome.
- O `name` e normalizado para lowercase e troca `_` por `-` antes da busca.
- Quando `name` vier com prefixo, como `fab:facebook-f`, esse prefixo sobrescreve o `lib`.
- Quando o icone nao for encontrado, o componente mantem o `span` raiz e nao renderiza o `svg`.

## Observacoes

- O tamanho usa classes `w-st-*` e `h-st-*` derivadas da escala visual do projeto.
- O `svg` interno usa `w-[90%]` e `h-[90%]` para manter respiro dentro do container.
- O componente faz `v-bind="$attrs"` no elemento raiz, aceitando `id`, `data-*` e atributos extras.
