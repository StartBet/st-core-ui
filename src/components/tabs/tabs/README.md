# StTabs, StTab e StTabPanel

Abas com navegacao por teclado no padrao ARIA. O `StTabs` guarda a aba ativa e distribui a configuracao; o `StTab` e cada aba; o `StTabPanel` e o conteudo ligado a ela.

## Import

```ts
import { StTab, StTabPanel, StTabs } from '@startbet/st-core-ui';
```

## Exemplo basico

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { StTab, StTabPanel, StTabs } from '@startbet/st-core-ui';

const aba = ref('aovivo');
</script>

<template>
  <StTabs v-model="aba">
    <template #tabs>
      <StTab value="aovivo" label="Ao vivo" />
      <StTab value="prejogo" label="Pre-jogo" />
    </template>

    <StTabPanel value="aovivo">12 partidas acontecendo agora.</StTabPanel>
    <StTabPanel value="prejogo">Rodada 24 do Brasileirao.</StTabPanel>
  </StTabs>
</template>
```

As abas vao no slot `tabs` e os paineis no slot padrao. Os paineis sao opcionais: da para usar o `StTabs` so como seletor e renderizar o conteudo por fora, pelo `v-model`.

## Props do StTabs

| Prop            | Tipo                       | Default     | Descricao                                             |
| --------------- | -------------------------- | ----------- | ----------------------------------------------------- |
| `modelValue`    | `string \| number`         | `undefined` | Aba ativa (`v-model`).                                |
| `variant`       | `underline \| pill`        | `underline` | Estilo da lista.                                      |
| `size`          | `small \| medium \| large` | `medium`    | Escala das abas.                                      |
| `color`         | `primary \| secondary`     | `primary`   | Cor de destaque da aba ativa.                         |
| `align`         | `start \| center \| end`   | `start`     | Alinhamento quando as abas nao ocupam a largura toda. |
| `fullWidth`     | `boolean`                  | `false`     | Distribui as abas igualmente na largura disponivel.   |
| `disabled`      | `boolean`                  | `false`     | Bloqueia todas as abas.                               |
| `ariaLabel`     | `string`                   | `Abas`      | Rotulo da lista.                                      |
| `className`     | `string`                   | `''`        | Classes extras no container.                          |
| `listClassName` | `string`                   | `''`        | Classes extras na lista.                              |

### Eventos

| Evento              | Payload            | Quando             |
| ------------------- | ------------------ | ------------------ |
| `update:modelValue` | `string \| number` | A aba ativa mudou. |
| `change`            | `string \| number` | A aba ativa mudou. |

## Props do StTab

| Prop        | Tipo               | Default     | Descricao                                   |
| ----------- | ------------------ | ----------- | ------------------------------------------- |
| `value`     | `string \| number` | —           | Identidade da aba; casa com o painel.       |
| `label`     | `string`           | `''`        | Texto da aba; o slot padrao tem prioridade. |
| `icon`      | `string`           | `undefined` | Icone opcional a esquerda do texto.         |
| `disabled`  | `boolean`          | `false`     | Bloqueia esta aba.                          |
| `className` | `string`           | `''`        | Classes extras na aba.                      |

O slot padrao substitui o `label` quando voce precisa de markup — um contador, um chip, um ponto de "ao vivo".

## Props do StTabPanel

| Prop        | Tipo               | Default | Descricao                                             |
| ----------- | ------------------ | ------- | ----------------------------------------------------- |
| `value`     | `string \| number` | —       | Identidade do painel; casa com a aba.                 |
| `keepAlive` | `boolean`          | `false` | Mantem o painel montado quando inativo, so escondido. |
| `className` | `string`           | `''`    | Classes extras no painel.                             |

Por padrao o painel inativo sai do DOM. Com `keepAlive` ele fica montado com `hidden` — util para preservar rolagem, formularios preenchidos ou evitar refazer uma requisicao a cada troca.

### Tamanhos disponiveis

| Tamanho  | Altura        | Fonte                 | Icone            |
| -------- | ------------- | --------------------- | ---------------- |
| `small`  | 32px (`st-4`) | `text-st-body-small`  | `st-sm` (14px)   |
| `medium` | 40px (`st-5`) | `text-st-body-medium` | `st-base` (16px) |
| `large`  | 48px (`st-6`) | `text-st-body-large`  | `st-md` (18px)   |

## Variantes

- `underline`: lista com trilho inferior em `st-border-2` e a aba ativa marcada por uma borda de 2px na cor de destaque. A borda existe em todas as abas, so muda de cor, entao trocar de aba nao desloca o layout.
- `pill`: barra arredondada em `st-surface-2` com a aba ativa preenchida — o formato de seletor segmentado.

## Muitas abas

A lista rola na horizontal quando as abas nao cabem, com a barra de rolagem escondida. Nao ha quebra de linha: em telas estreitas o usuario arrasta.

## Regras internas

- `resolveNextTabIndex` resolve a navegacao por teclado; a lista de abas e lida do DOM na hora, entao a ordem e sempre a ordem visual, mesmo com abas adicionadas ou removidas.
- `buildTabClasses` nunca emite o utilitario neutro junto do de destaque (`bg-transparent` com `bg-st-primary`, por exemplo): com os dois na mesma classe, quem decide e a ordem do CSS gerado, e o destaque do ativo se perde.
- Sem `modelValue` nenhuma aba fica ativa e nenhum painel e renderizado.
- `data-st-tabs`, `data-st-tabs-list`, `data-st-tab-value`, `data-st-tab-active` e `data-st-tab-panel-value` estao disponiveis para testes e QA.

## Acessibilidade

- A lista usa `role="tablist"` com `aria-label` e `aria-orientation="horizontal"`.
- Cada aba e um `button` com `role="tab"`, `aria-selected` e `aria-controls` apontando para o painel; o painel usa `role="tabpanel"` com `aria-labelledby` de volta.
- `tabindex` rotativo: so a aba ativa entra na ordem de tabulacao; as demais sao alcancadas pelas setas.
- Setas esquerda e direita circulam entre as abas habilitadas, `Home` e `End` vao para as pontas. A selecao acompanha o foco.
- Abas desabilitadas sao puladas pela navegacao por teclado.

## Observacoes

- Icones informados em `icon` precisam ser registrados na `library` do Font Awesome pelo projeto consumidor.
- No tema escuro, a pilula ativa em `color="primary"` tem pouca separacao do proprio trilho (contraste medido de 2.04), porque o roxo do `st-primary` fica no meio da rampa de superficies. O texto continua legivel (8.12) e o estado tambem e comunicado por `aria-selected`, mas para um destaque mais forte use `color="secondary"`, que mede 9.7 contra o trilho.
