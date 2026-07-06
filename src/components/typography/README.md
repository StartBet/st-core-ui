# StTypography

Componente base de tipografia da biblioteca para renderizar textos semanticos com os tokens de `fontFamily`, `fontSize`, `lineHeight` e `letterSpacing` expostos pelo tema Tailwind.

## Import

```ts
import { StTypography } from '@startbet/st-core-ui';
```

## Variantes disponiveis

- `heading-1`
- `heading-2`
- `heading-3`
- `heading-4`
- `highlight-large`
- `highlight-medium`
- `body-large`
- `body-medium`
- `body-small`
- `hero-title`

## Props principais

- `variant`: aplica uma variante semantica predefinida. Default: `body-medium`.
- `as`: define a tag HTML renderizada. Default: `p`.
- `size`: sobrescreve o tamanho com a escala numerica do tema.
- `weight`: sobrescreve o peso da fonte.
- `family`: sobrescreve a familia tipografica entre `body`, `heading`, `highlight` e `display`.
- `lineHeight`: sobrescreve o line-height com os tokens do tema.
- `letterSpacing`: sobrescreve o tracking com os tokens do tema.
- `align`: aplica alinhamento de texto.
- `italic`, `underline`, `strikethrough`, `uppercase`, `lowercase`, `capitalize`: aplicam transformacoes utilitarias.
- `truncate`: aplica truncamento em uma linha.
- `maxLines`: aplica clamp entre 1 e 6 linhas.
- `lines`: divide o texto em multiplas linhas quando o slot for apenas texto puro. Foi pensado principalmente para `hero-title`.
- `className`: injeta classes extras no elemento raiz.

## Exemplo basico

```vue
<script setup lang="ts">
import { StTypography } from '@startbet/st-core-ui';
</script>

<template>
  <StTypography as="h2" variant="heading-3"> Titulo da secao </StTypography>

  <StTypography variant="body-medium">
    Texto de apoio usando a tipografia padrao da biblioteca.
  </StTypography>
</template>
```

## Exemplo com overrides

```vue
<StTypography
  as="span"
  variant="body-small"
  weight="bold"
  align="center"
  uppercase
>
  Status do componente
</StTypography>
```

## Observacoes

- O componente depende dos tokens CSS e das fontes publicadas pela biblioteca.
- Para o `hero-title`, a prop `lines` permite destacar visualmente a ultima linha quando o slot contiver apenas texto simples.
