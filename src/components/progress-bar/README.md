# StProgressBar

Componente de barra de progresso horizontal da biblioteca para representar a evolução de uma tarefa de `0` a `100`, com suporte a variantes semânticas, dois tamanhos e texto de apoio abaixo da barra.

## Import

```ts
import { StProgressBar } from '@startbet/st-core-ui';
```

## Variantes disponiveis

- `primary`
- `secondary`
- `info`
- `system`
- `warning`
- `positive`
- `negative`

## Tamanhos disponiveis

- `small`
- `large`

## Props principais

- `variant`: define a cor semântica do preenchimento da barra. Default: `primary`.
- `size`: define a espessura da barra e a escala do texto. Default: `small`.
- `percent`: valor numérico de `0` a `100` que alimenta o preenchimento. Default: `0`.
- `text`: texto exibido abaixo da barra. Pode vir vazio. Default: `''`.
- `className`: injeta classes extras no container.

## Exemplo basico

```vue
<script setup lang="ts">
import { StProgressBar } from '@startbet/st-core-ui';
</script>

<template>
  <StProgressBar :percent="40" />
</template>
```

## Exemplo com variantes e texto

```vue
<template>
  <div class="flex w-full flex-col gap-st-3">
    <StProgressBar variant="info" :percent="25" text="Enviando arquivos" />
    <StProgressBar
      variant="positive"
      size="large"
      :percent="100"
      text="Concluido"
    />
    <StProgressBar
      variant="negative"
      :percent="70"
      text="Limite quase atingido"
    />
  </div>
</template>
```

## Regras internas

- `percent` é normalizado com `clampProgressPercent`: valores abaixo de `0` viram `0`, acima de `100` viram `100` e valores inválidos viram `0`.
- O texto só é renderizado quando `text` tem conteúdo.
- Quando existe texto, ele recebe um `id` gerado e a barra aponta para ele via `aria-describedby`.
- A largura do preenchimento é aplicada via `style` com transição de `width`.

## Acessibilidade

- A barra usa `role="progressbar"` com `aria-valuenow`, `aria-valuemin` e `aria-valuemax`.
- Sem `text`, informe um `aria-label` no componente para descrever o progresso.
- Atributos extras passados ao componente são encaminhados para o elemento com `role="progressbar"`.

## Observacoes

- O componente ocupa `100%` da largura disponível; controle a largura pelo container ou por `className`.
- A trilha usa `bg-st-surface-2` e o preenchimento usa os tokens semânticos de cor (`st-primary`, `st-secondary`, `st-info`, `st-system`, `st-warning`, `st-positive`, `st-negative`).
- O tamanho `small` usa trilha de `4px` e `text-st-body-small`.
- O tamanho `large` usa trilha de `8px` e `text-st-body-medium`.
