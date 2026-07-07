# StOption

Componente de opção clicável da biblioteca para compor listas de ações e seleções customizadas, com suporte a estado selecionado, adornos opcionais e callback de clique.

## Import

```ts
import { StOption } from '@startbet/st-core-ui';
```

## Props principais

- `value`: define o valor lógico da opção.
- `selected`: aplica o estado visual de seleção. Default: `false`.
- `className`: injeta classes extras no botão da opção.
- `onClick`: callback disparado ao clicar na opção.

## Slots

- `default`: conteúdo principal da opção.
- `startAdornment`: conteúdo exibido antes do texto principal.
- `endAdornment`: conteúdo exibido depois do texto principal.

## Exemplo básico

```vue
<script setup lang="ts">
import { StOption } from '@startbet/st-core-ui';
</script>

<template>
  <div class="flex max-w-st-48 flex-col gap-st-1">
    <StOption value="profile">Perfil</StOption>
    <StOption value="settings">Configurações</StOption>
    <StOption value="logout">Sair</StOption>
  </div>
</template>
```

## Exemplo com seleção

```vue
<script setup lang="ts">
import { ref } from 'vue';

import { StOption } from '@startbet/st-core-ui';

const selected = ref('settings');
</script>

<template>
  <div class="flex max-w-st-48 flex-col gap-st-1">
    <StOption
      value="profile"
      :selected="selected === 'profile'"
      :on-click="() => (selected = 'profile')"
    >
      Perfil
    </StOption>
    <StOption
      value="settings"
      :selected="selected === 'settings'"
      :on-click="() => (selected = 'settings')"
    >
      Configurações
    </StOption>
  </div>
</template>
```

## Exemplo com adornos

```vue
<script setup lang="ts">
import { StOption } from '@startbet/st-core-ui';
</script>

<template>
  <StOption value="wallet">
    <template #startAdornment>
      <span>R$</span>
    </template>

    Carteira

    <template #endAdornment>
      <span>+</span>
    </template>
  </StOption>
</template>
```

## Regras internas

- O componente renderiza um `button` com `type="button"` para evitar submit acidental em formulários.
- Quando `selected=true`, a opção recebe `aria-pressed="true"` e um estilo visual fixo de seleção.
- `inheritAttrs: false` é usado para filtrar attrs específicos de teclado antes de repassá-los ao botão.
- O `value` é refletido em `data-value`, facilitando integrações e seleção por atributo.

## Observações

- A prop `onClick` é compatível com o padrão legado do componente.
- Listeners passados via attrs, como `@click`, continuam funcionando no botão raiz.
