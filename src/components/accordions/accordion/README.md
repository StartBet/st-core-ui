# StAccordion

Item expansivel com cabecalho clicavel e uma area que anima ate a altura automatica do proprio conteudo. Funciona sozinho ou dentro de um [`StAccordionGroup`](../accordion-group/README.md), que coordena quais itens ficam abertos.

## Import

```ts
import { StAccordion } from '@startbet/st-core-ui';
```

## Props

| Prop               | Tipo                       | Default        | Descricao                                           |
| ------------------ | -------------------------- | -------------- | --------------------------------------------------- |
| `title`            | `string`                   | `''`           | Titulo do cabecalho; o slot `title` tem prioridade. |
| `icon`             | `string`                   | `undefined`    | Icone opcional a esquerda do titulo.                |
| `value`            | `string \| number`         | `undefined`    | Identidade do item dentro de um grupo.              |
| `modelValue`       | `boolean`                  | `undefined`    | Estado aberto (`v-model`).                          |
| `defaultOpen`      | `boolean`                  | `false`        | Abre o item na montagem.                            |
| `disabled`         | `boolean`                  | `false`        | Bloqueia a abertura e o fechamento.                 |
| `size`             | `small \| medium \| large` | herda do grupo | Escala do item.                                     |
| `headerSurface`    | `StAccordionSurface`       | `surface-1`    | Superficie do cabecalho.                            |
| `contentSurface`   | `StAccordionSurface`       | `surface-0`    | Superficie da area expansivel.                      |
| `expandIcon`       | `string`                   | `chevron-down` | Icone indicador de expansao.                        |
| `hideExpandIcon`   | `boolean`                  | `false`        | Remove o icone indicador.                           |
| `className`        | `string`                   | `''`           | Classes extras no container.                        |
| `headerClassName`  | `string`                   | `''`           | Classes extras no cabecalho.                        |
| `contentClassName` | `string`                   | `''`           | Classes extras na area expansivel.                  |

## Slots

| Slot           | Descricao                                                                 |
| -------------- | ------------------------------------------------------------------------- |
| `default`      | Conteudo da area expansivel.                                              |
| `title`        | Substitui o texto do cabecalho por markup livre.                          |
| `icon`         | Substitui o icone do cabecalho por qualquer elemento.                     |
| `endAdornment` | Area livre no cabecalho, entre o titulo e o chevron (aceita interativos). |

## Eventos

| Evento              | Payload         | Quando                  |
| ------------------- | --------------- | ----------------------- |
| `update:modelValue` | `open: boolean` | O item abriu ou fechou. |
| `toggle`            | `open: boolean` | O item abriu ou fechou. |

### Tamanhos disponiveis

| Tamanho  | Cabecalho e conteudo | Titulo e conteudo     | Icone            |
| -------- | -------------------- | --------------------- | ---------------- |
| `small`  | `px-st-2 py-st-1`    | `text-st-body-small`  | `st-sm` (14px)   |
| `medium` | `px-st-2 py-st-2`    | `text-st-body-medium` | `st-base` (16px) |
| `large`  | `px-st-3 py-st-3`    | `text-st-body-large`  | `st-md` (18px)   |

### Superficies disponiveis

`transparent`, `surface-0` a `surface-4`, `surface-primary`, `surface-secondary`, `surface-info`, `surface-system`, `surface-warning`, `surface-positive` e `surface-negative` — as mesmas superficies do [`StPaper`](../../paper/README.md), aplicaveis de forma independente ao cabecalho e a area expansivel.

## Exemplo basico

```vue
<script setup lang="ts">
import { StAccordion } from '@startbet/st-core-ui';
</script>

<template>
  <StAccordion title="Regras do bonus" icon="circle-question">
    <p>A area expande ate a altura do conteudo, qualquer que seja ele.</p>
  </StAccordion>
</template>
```

## Area livre no cabecalho

O `endAdornment` aparece entre o titulo e o icone indicador, e fica **fora** do botao do cabecalho. Com isso aceita elementos interativos sem gerar botao dentro de botao e sem disparar o toggle ao ser clicado:

```vue
<template>
  <StAccordion title="Brasileirao Serie A">
    <template #endAdornment>
      <StChip>12 jogos</StChip>
    </template>
    <p>Rodada 24, com jogos de sexta a domingo.</p>
  </StAccordion>
</template>
```

## Controlado

```vue
<script setup lang="ts">
import { ref } from 'vue';

const aberto = ref(false);
</script>

<template>
  <StAccordion v-model="aberto" title="Metodos de pagamento">
    <p>Pix, cartao de credito e transferencia bancaria.</p>
  </StAccordion>
</template>
```

Sem `modelValue` o item controla o proprio estado; use `defaultOpen` para nascer aberto.

## Animacao

A area expansivel e um grid cuja unica linha anima de `0fr` para `1fr`, com o conteudo dentro de um filho com `overflow-hidden`:

- expande ate a altura real do conteudo, sem altura fixa e sem medir nada em JavaScript;
- acompanha conteudo dinamico (texto que cresce, listas que mudam) sem recalculo manual;
- `defaultOpen` ja renderiza aberto, sem piscar fechado nem animar na montagem;
- respeita `prefers-reduced-motion` e nao anima quando o usuario pede menos movimento.

Como a area usa `overflow-hidden`, conteudo que precisa transbordar (um dropdown aberto, por exemplo) fica recortado enquanto estiver dentro do accordion.

## Estrutura do cabecalho

A linha do cabecalho carrega o padding e a ordem visual — `[icone] Titulo ... [endAdornment] [chevron]` — e o gatilho e um `button` em camada sobre ela (`absolute inset-0`). Com isso:

- a linha inteira e clicavel, incluindo o chevron;
- o `endAdornment` fica acima da camada e permanece clicavel por conta propria;
- nao existe botao dentro de botao, entao o HTML segue valido.

## Regras internas

- `buildAccordionClasses` resolve as classes; `resolveAccordionIconSize` traduz a escala para o tamanho do `StIcon`.
- O icone indicador usa `pointer-events-none`: o `rotate-*` cria um stacking context que, sem isso, pintaria o icone acima da camada do gatilho e engoliria o clique.
- Dentro de um grupo, o item herda `size`, `headerSurface`, `contentSurface` e `disabled` — e qualquer prop informada no proprio item vence a do grupo.
- `disabled` do grupo e do item se somam: basta um dos dois para bloquear.
- `data-st-accordion-open`, `data-st-accordion-header`, `data-st-accordion-region` e `data-st-accordion-expand-icon` estao disponiveis para testes e QA.

## Acessibilidade

- O gatilho e um `button` com `aria-expanded`, `aria-controls` apontando para a regiao e `aria-labelledby` apontando para o titulo, que e quem da o nome acessivel.
- A regiao usa `role="region"` com `aria-labelledby` apontando para o cabecalho.
- Enquanto fechada, a regiao recebe `inert`: o conteudo recortado nao recebe foco nem e lido por leitores de tela.
- O icone indicador e o icone do cabecalho sao `aria-hidden`; descreva o item pelo `title`.

## Observacoes

- O icone `chevron-down` ja vem registrado no componente. Icones informados em `icon` ou `expandIcon` precisam ser registrados na `library` do Font Awesome pelo projeto consumidor.
- Para coordenar varios itens, use o [`StAccordionGroup`](../accordion-group/README.md).
