# StAccordionGroup

Coordena varios [`StAccordion`](../accordion/README.md): define o estado colapsado do conjunto, se os itens abrem em grupo ou um de cada vez, e distribui tamanho e superficies para todos.

## Import

```ts
import { StAccordionGroup } from '@startbet/st-core-ui';
```

## Props

| Prop             | Tipo                                | Default     | Descricao                                                   |
| ---------------- | ----------------------------------- | ----------- | ----------------------------------------------------------- |
| `multiple`       | `boolean`                           | `false`     | `true` permite varios abertos; `false` abre um de cada vez. |
| `modelValue`     | `string \| number \| Array \| null` | `undefined` | Itens abertos (`v-model`). `null` ou `[]` colapsa tudo.     |
| `size`           | `small \| medium \| large`          | `medium`    | Escala herdada por todos os itens.                          |
| `headerSurface`  | `StAccordionSurface`                | `surface-1` | Superficie do cabecalho herdada pelos itens.                |
| `contentSurface` | `StAccordionSurface`                | `surface-0` | Superficie expansivel herdada pelos itens.                  |
| `disabled`       | `boolean`                           | `false`     | Bloqueia todos os itens.                                    |
| `gap`            | `0 \| 1 \| 2 \| 3`                  | `1`         | Espaco entre os itens, na escala `st-*`.                    |
| `ariaLabel`      | `string`                            | `undefined` | Rotulo do grupo; quando informado aplica `role="group"`.    |
| `className`      | `string`                            | `''`        | Classes extras no container.                                |

## Eventos

| Evento              | Payload                             | Quando                    |
| ------------------- | ----------------------------------- | ------------------------- |
| `update:modelValue` | `string \| number \| Array \| null` | Os itens abertos mudaram. |
| `change`            | `string \| number \| Array \| null` | Os itens abertos mudaram. |

O formato do payload acompanha o modo: com `multiple` sempre um array; sem ele, o valor do item aberto ou `null` quando tudo esta colapsado.

## Metodos expostos

| Membro        | Tipo                   | Descricao                          |
| ------------- | ---------------------- | ---------------------------------- |
| `openValues`  | `(string \| number)[]` | Itens abertos no momento.          |
| `isOpen`      | `(value) => boolean`   | Se um item especifico esta aberto. |
| `toggle`      | `(value) => void`      | Abre ou fecha um item.             |
| `collapseAll` | `() => void`           | Colapsa tudo.                      |

## Exemplo basico

```vue
<script setup lang="ts">
import { StAccordion, StAccordionGroup } from '@startbet/st-core-ui';
</script>

<template>
  <StAccordionGroup>
    <StAccordion value="resultado" title="Resultado final">
      <p>Vitoria do mandante, empate ou vitoria do visitante.</p>
    </StAccordion>
    <StAccordion value="gols" title="Total de gols">
      <p>Acima ou abaixo de 2.5 gols no tempo regulamentar.</p>
    </StAccordion>
  </StAccordionGroup>
</template>
```

## Um de cada vez ou multiplos

Por padrao o grupo abre **um item de cada vez**: abrir o proximo fecha o anterior, e clicar no item aberto fecha tudo.

```vue
<template>
  <StAccordionGroup multiple>
    <!-- cada item abre e fecha de forma independente -->
  </StAccordionGroup>
</template>
```

Ao sair do modo `multiple` com varios itens abertos, o grupo mantem apenas o primeiro.

## Estado colapsado

Tres formas, da mais simples a mais controlada:

```vue
<!-- 1. tudo colapsado (padrao) -->
<StAccordionGroup>...</StAccordionGroup>

<!-- 2. um item nasce aberto, sem precisar controlar o grupo -->
<StAccordionGroup>
  <StAccordion value="gols" title="Total de gols" default-open>...</StAccordion>
</StAccordionGroup>

<!-- 3. o grupo dita o estado, e o dev recebe as mudancas -->
<StAccordionGroup v-model="aberto">...</StAccordionGroup>
```

Com `v-model`, `aberto = null` colapsa tudo e `aberto = 'gols'` abre aquele item. No modo `multiple` use um array: `['resultado', 'gols']`.

O `defaultOpen` dos itens so vale quando o grupo **nao** esta controlado — com `modelValue` definido, quem manda e o grupo. No modo de um de cada vez, se mais de um item trouxer `defaultOpen`, vence o primeiro na ordem do template.

## Tamanho e superficie pelo grupo

```vue
<template>
  <StAccordionGroup
    size="large"
    header-surface="surface-3"
    content-surface="surface-1"
    :gap="2"
  >
    <!-- todos os itens herdam -->
  </StAccordionGroup>
</template>
```

Qualquer prop informada no item vence a do grupo, entao da para destoar um item especifico sem abrir mao da configuracao comum.

## Regras internas

- `normalizeOpenValues` converte o `modelValue` na lista interna; fora do modo `multiple`, um array recebido e reduzido ao primeiro item.
- `toggleOpenValue` aplica a regra do modo; `toModelValue` devolve o payload no formato certo.
- A coordenacao acontece por `provide`/`inject`: os itens sao filhos livres do slot, entao qualquer markup pode ficar entre eles.
- Itens sem `value` recebem um id gerado. Informe `value` sempre que quiser controlar o grupo por `modelValue`.
- Com `disabled`, nem o clique nem o `defaultOpen` abrem os itens.

## Acessibilidade

- Sem `ariaLabel` o container e um `div` neutro, e cada item ja carrega a propria semantica de cabecalho e regiao.
- Com `ariaLabel` o container vira `role="group"` com o rotulo informado.
