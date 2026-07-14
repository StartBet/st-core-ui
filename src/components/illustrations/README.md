# StIllustration

Componente da biblioteca para renderizar ilustrações SVG publicadas no CDN da StartBet a partir de um caminho relativo.

## Import

```ts
import { StIllustration } from '@startbet/st-core-ui';
```

## Props principais

- `name`: caminho relativo da ilustração no CDN. Exemplo: `arrows/chip_3d`.
- `alt`: texto alternativo obrigatório da imagem.
- `width`: largura opcional usando os mesmos `SizeValue` expostos pela biblioteca.
- `height`: altura opcional usando os mesmos `SizeValue` expostos pela biblioteca.
- `className`: permite complementar as classes do elemento `<img>`.

## Exemplo básico

```vue
<template>
  <StIllustration name="arrows/chip_3d" alt="Chip 3D" height="24" />
</template>
```

## Exemplo com tamanho e classes extras

```vue
<template>
  <StIllustration
    name="brands/logo_dark"
    alt="Logo StartBet escura"
    width="56"
    className="rounded-st-1"
  />
</template>
```

## Formato do `name`

- O valor deve ser enviado como caminho relativo dentro de `https://cdn.start.bet.br/illustrations`.
- O componente aceita nomes com ou sem a extensão `.svg`.
- Não use caminhos locais da máquina ou URLs completas no `name`.

Exemplos válidos:

- `arrows/chip_3d`
- `brands/logo_dark`
- `characters/soccer_player_01`
- `random/star_3d_01.svg`

## Categorias disponíveis no catálogo atual

- `arrows`
- `balls`
- `brands`
- `casino`
- `characters`
- `coins`
- `cup`
- `football`
- `papers`
- `random`
- `safety`
- `smoke`
- `stickers`
- `time`
- `various`

## Regras internas

- O componente monta automaticamente a URL final do CDN com base no `name`.
- `width` e `height` numéricos também são refletidos nos atributos nativos da imagem.
- Atributos extras como `loading`, `decoding` e `referrerpolicy` podem ser encaminhados via `$attrs`.
