# StButton

Componente de botao da biblioteca para acoes principais e secundarias, com suporte a variantes visuais, tamanhos, cores semanticas, largura fluida, estado desabilitado e modo `icon only`.

## Import

```ts
import { StButton } from '@startbet/st-core-ui';
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

- `variant`: define o estilo visual do botao. Default: `solid`.
- `size`: define a escala visual do botao. Default: `medium`.
- `color`: define a cor semantica usada pela variante. Default: `primary`.
- `fullWidth`: expande o botao para `w-full` quando existe conteudo textual.
- `type`: controla o tipo nativo do elemento. Default: `button`.
- `value`: repassa o valor para o elemento nativo.
- `iconLeft`: renderiza um adorno textual antes do conteudo.
- `iconRight`: renderiza um adorno textual depois do conteudo.
- `disabled`: aplica estilo desabilitado e bloqueia interacao. Default: `false`.
- `className`: injeta classes extras no elemento raiz.

## Slots

- `default`: conteudo principal do botao.
- `startAdornment`: area extra antes do conteudo.
- `endAdornment`: area extra depois do conteudo.

## Exemplo basico

```vue
<script setup lang="ts">
import { StButton } from '@startbet/st-core-ui';
</script>

<template>
  <StButton>Salvar</StButton>
</template>
```

## Exemplo com variantes

```vue
<template>
  <div class="flex flex-wrap gap-st-2">
    <StButton variant="solid" color="primary">Primary</StButton>
    <StButton variant="outline" color="secondary">Secondary</StButton>
    <StButton variant="text" color="negative">Negative</StButton>
  </div>
</template>
```

## Exemplo com adornos

```vue
<template>
  <StButton iconLeft="+" iconRight="->">Continuar</StButton>
</template>
```

## Regras internas

- Sem conteudo no slot `default` e com apenas um adorno, o componente entra em modo `icon only`.
- O modo `icon only` troca o comportamento de largura por um tamanho quadrado baseado na altura do botao.
- O estado `disabled` sobrescreve as classes da variante e aplica cores neutras da biblioteca.

## Observacoes

- O componente usa os tokens semanticos de cor e conteudo ja publicados no tema Tailwind da biblioteca.
- `iconLeft` e `iconRight` usam fallback textual na implementacao atual, porque a biblioteca ainda nao expoe `StIcon`.
