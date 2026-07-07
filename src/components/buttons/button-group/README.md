# StButtonGroup

Componente de agrupamento de botoes da biblioteca para compor selecoes simples ou multiplas em cima do `StButton`, com suporte a orientacao horizontal ou vertical, estado controlado e navegacao por teclado.

## Import

```ts
import { StButton, StButtonGroup } from '@startbet/st-core-ui';
```

## Variantes disponiveis

- `solid`
- `outline`
- `text`

## Cores disponiveis

- `primary`
- `secondary`
- `positive`
- `negative`

## Tamanhos disponiveis

- `small`
- `medium`
- `large`

## Props principais

- `value`: controla o valor selecionado quando o grupo esta em modo controlado.
- `defaultValue`: define o valor inicial no modo nao controlado.
- `onValueChange`: callback disparado sempre que a selecao muda.
- `multiple`: permite selecionar mais de um botao. Default: `false`.
- `orientation`: define a direcao visual do grupo. Default: `horizontal`.
- `variant`: define a variante base aplicada aos botoes filhos. Default: `solid`.
- `size`: define o tamanho base aplicado aos botoes filhos. Default: `medium`.
- `color`: define a cor semantica base aplicada aos botoes filhos. Default: `primary`.
- `disabled`: desabilita todos os botoes do grupo. Default: `false`.
- `className`: injeta classes extras no container raiz.

## Exemplo basico

```vue
<script setup lang="ts">
import { StButton, StButtonGroup } from '@startbet/st-core-ui';
</script>

<template>
  <StButtonGroup defaultValue="sports">
    <StButton value="sports">Esportes</StButton>
    <StButton value="casino">Casino</StButton>
    <StButton value="live">Live</StButton>
  </StButtonGroup>
</template>
```

## Exemplo controlado

```vue
<script setup lang="ts">
import { ref } from 'vue';

import { StButton, StButtonGroup } from '@startbet/st-core-ui';

const selected = ref<string | string[]>('week');
</script>

<template>
  <StButtonGroup v-model:value="selected">
    <StButton value="day">Dia</StButton>
    <StButton value="week">Semana</StButton>
    <StButton value="month">Mes</StButton>
  </StButtonGroup>
</template>
```

## Exemplo com multiple

```vue
<script setup lang="ts">
import { ref } from 'vue';

import { StButton, StButtonGroup } from '@startbet/st-core-ui';

const filters = ref<string | string[]>(['pix']);
</script>

<template>
  <StButtonGroup
    v-model:value="filters"
    multiple
    color="positive"
    variant="outline"
  >
    <StButton value="pix">Pix</StButton>
    <StButton value="card">Cartao</StButton>
    <StButton value="wallet">Carteira</StButton>
  </StButtonGroup>
</template>
```

## Exemplo vertical

```vue
<template>
  <StButtonGroup orientation="vertical" size="small" color="secondary">
    <StButton value="all">Todos</StButton>
    <StButton value="open">Abertos</StButton>
    <StButton value="closed">Fechados</StButton>
  </StButtonGroup>
</template>
```

## Exemplo com icones

```vue
<template>
  <StButtonGroup defaultValue="instagram" color="secondary" variant="outline">
    <StButton value="facebook" iconLeft="fab:facebook-f">Facebook</StButton>
    <StButton value="instagram" iconLeft="fab:instagram">Instagram</StButton>
  </StButtonGroup>
</template>
```

## Regras internas

- O grupo aceita qualquer quantidade de `StButton` como filhos no slot `default`.
- Quando `multiple` for `false`, apenas um valor fica ativo por vez.
- Quando `multiple` for `true`, os cliques alternam inclusao e remocao do item selecionado.
- Para `primary` e `secondary`, o item ativo alterna para a cor oposta mantendo a variante.
- Para `positive` e `negative`, o item ativo mantem a cor e alterna entre `solid` e `outline`.
- O componente suporta navegacao por teclado com setas: `ArrowLeft` e `ArrowRight` no modo horizontal, `ArrowUp` e `ArrowDown` no modo vertical.
- Os botoes filhos continuam podendo usar `iconLeft` e `iconRight`, porque o grupo apenas orquestra e complementa o `StButton`.

## Observacoes

- O componente faz `v-bind="$attrs"` no container raiz, aceitando `id`, `data-*` e atributos nativos extras.
- Os botoes filhos recebem automaticamente as classes de colapso visual do grupo, com raio apenas nas extremidades.
- Quando os filhos usarem icones, a aplicacao consumidora precisa registrar os `IconDefinition` desejados no Font Awesome.
