# StAvatarGroup

Lista horizontal de [`StAvatar`](../avatar/README.md) levemente sobrepostos. Acima do limite de avatares visiveis, fecha com um contador que informa quantos usuarios ficaram de fora.

## Import

```ts
import { StAvatarGroup } from '@startbet/st-core-ui';
```

## Props

| Prop                | Tipo                        | Default             | Descricao                                          |
| ------------------- | --------------------------- | ------------------- | -------------------------------------------------- |
| `avatars`           | `StAvatarGroupItem[]`       | `[]`                | Usuarios exibidos, na ordem informada.             |
| `max`               | `number`                    | `5`                 | Maximo de avatares visiveis antes do contador.     |
| `size`              | `small \| medium \| large`  | `medium`            | Escala aplicada a todos os avatares e ao contador. |
| `fit`               | `cover \| contain`          | `cover`             | `fit` padrao dos avatares do grupo.                |
| `placeholderIcon`   | `string`                    | `user`              | Icone dos avatares sem imagem e sem nome.          |
| `ariaLabel`         | `string`                    | `Grupo de usuarios` | Rotulo do grupo.                                   |
| `overflowAriaLabel` | `(count: number) => string` | `undefined`         | Rotulo do contador; por padrao `Mais N usuarios`.  |
| `className`         | `string`                    | `''`                | Classes extras no container.                       |
| `avatarClassName`   | `string`                    | `''`                | Classes extras em cada avatar.                     |

### StAvatarGroupItem

| Campo   | Tipo               | Descricao                                                           |
| ------- | ------------------ | ------------------------------------------------------------------- |
| `name`  | `string`           | Nome do usuario: gera as iniciais e a cor quando nao existe imagem. |
| `src`   | `string`           | URL da imagem do usuario.                                           |
| `alt`   | `string`           | Texto alternativo da imagem; por padrao usa `name`.                 |
| `color` | `StAvatarColor`    | Forca uma cor da paleta neste avatar.                               |
| `fit`   | `cover \| contain` | Sobrescreve o `fit` do grupo neste avatar.                          |

## Exemplo basico

```vue
<script setup lang="ts">
import { StAvatarGroup } from '@startbet/st-core-ui';

const avatars = [
  { name: 'Arthur Morgan', src: 'https://cdn.exemplo.com/arthur.png' },
  { name: 'Dutch van der Linde' },
  { name: 'John Marston' }
];
</script>

<template>
  <StAvatarGroup :avatars="avatars" />
</template>
```

## Contador de excedentes

O contador aparece somente quando a lista passa de `max`. Os `max` primeiros avatares continuam visiveis e o contador soma o restante:

| Usuarios | `max` | Resultado          |
| -------- | ----- | ------------------ |
| 3        | 5     | 3 avatares         |
| 5        | 5     | 5 avatares         |
| 6        | 5     | 5 avatares + `+1`  |
| 18       | 5     | 5 avatares + `+13` |

```vue
<template>
  <StAvatarGroup :avatars="avatars" :max="3" />
</template>
```

## Um unico usuario

O componente faz mais sentido a partir de dois usuarios, mas renderiza normalmente com um so — util quando a lista e dinamica e pode encolher. Com a lista vazia, nao renderiza nada.

## Regras internas

- `clampAvatarGroupMax` garante pelo menos um avatar visivel: valores invalidos caem no padrao `5` e valores abaixo de `1` viram `1`.
- `resolveAvatarGroupOverflow` calcula o excedente apenas quando o total passa de `max`.
- O primeiro avatar fica por cima no empilhamento, e os seguintes descem o `z-index` na ordem da lista.
- O contador herda tamanho e sobreposicao dos avatares, com superficie neutra.

## Tokens usados

- Sobreposicao de cerca de 20% do diametro: `-ml-[6px]` no `small`, `-ml-[8px]` no `medium` e `-ml-[11px]` no `large` — o suficiente para empilhar sem cobrir as iniciais.
- Anel de separacao `ring-2 ring-st-surface-0` em cada avatar. Em fundos diferentes da superficie base, ajuste com `avatarClassName` (ex.: `ring-st-surface-1`).
- Contador: `bg-st-surface-3` com borda `st-border-2` e texto `st-content-default`.

## Acessibilidade

- O container usa `role="group"` com `aria-label` configuravel.
- Cada avatar mantem o proprio `alt` ou `aria-label`, vindo de `alt` ou `name`.
- O contador usa `role="img"` com `aria-label` descritivo (`Mais 3 usuarios`), enquanto o texto `+3` fica `aria-hidden`. Use `overflowAriaLabel` para ajustar o texto.
- `data-st-avatar-overflow` esta disponivel para testes e QA.
