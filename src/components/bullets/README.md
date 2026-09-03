# StBullets

Componente de navegacao por bullets no estilo linha: o item ativo fica mais largo e os demais menores. Usado pelo [`StCarousel`](../carousel/README.md) e disponivel de forma independente para qualquer navegacao paginada.

## Import

```ts
import { StBullets } from '@startbet/st-core-ui';
```

## Props

| Prop            | Tipo                                          | Default               | Descricao                                         |
| --------------- | --------------------------------------------- | --------------------- | ------------------------------------------------- |
| `total`         | `number`                                      | `0`                   | Quantidade de bullets renderizados.               |
| `modelValue`    | `number`                                      | `0`                   | Indice ativo (`v-model`).                         |
| `size`          | `small \| medium \| large`                    | `medium`              | Tamanho da barra.                                 |
| `align`         | `left \| center \| right`                     | `center`              | Alinhamento horizontal.                           |
| `interactive`   | `boolean`                                     | `true`                | Renderiza botoes clicaveis ou apenas indicadores. |
| `ariaLabel`     | `string`                                      | `Navegacao de slides` | Rotulo do grupo.                                  |
| `itemAriaLabel` | `(position: number, total: number) => string` | `undefined`           | Rotulo de cada bullet (posicao inicia em 1).      |
| `className`     | `string`                                      | `''`                  | Classes extras no container.                      |

Eventos: `update:modelValue` e `select`, ambos com o indice selecionado.

## Uso independente

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { StBullets } from '@startbet/st-core-ui';

const current = ref(0);
</script>

<template>
  <StBullets v-model="current" :total="5" size="large" align="left" />
</template>
```

## Uso dentro do StCarousel

O carousel apenas habilita o componente pela view (`bullets="outside" | "inside" | "none"`) e repassa a quantidade de paginas, o indice ativo e o alinhamento definido em `bulletsPosition`. Nao existe prop refletida a configurar no carousel.

## Indicador decorativo

Com `interactive` como `false`, os bullets viram `span` com `aria-hidden`, sem cursor nem hover — util quando a navegacao acontece por outro controle.

## Acessibilidade

- Container com `role="group"` e `aria-label`.
- Cada bullet interativo e um `button` com `aria-label` descritivo e `aria-current` no ativo.
- Atributo `data-st-bullet-active` disponivel para testes e QA.
