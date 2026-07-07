# StDropdown

Componente de dropdown da biblioteca para exibir conteúdo flutuante a partir de um trigger, com suporte a posicionamento, largura configurável e modos controlado e não controlado.

## Import

```ts
import { StDropdown } from '@startbet/st-core-ui';
```

## Slots

- `trigger`: conteúdo que abre ou fecha o dropdown.
- `default`: conteúdo renderizado no painel flutuante.

## Props principais

- `placement`: define a direção preferencial do painel. Default: `auto`.
- `width`: controla a largura do painel. Default: `auto`.
- `offset`: define o espaçamento entre trigger e painel. Default: `8`.
- `open`: controla o estado aberto de forma externa.
- `defaultOpen`: define o estado inicial no modo não controlado. Default: `false`.
- `onOpenChange`: callback disparado quando o estado aberto muda.
- `closeOnOutsideClick`: fecha ao clicar fora. Default: `true`.
- `triggerAsChild`: delega o trigger para o slot com `open`, `toggle`, `setTriggerEl` e `attrs`.
- `className`: injeta classes extras no container raiz.
- `panelClassName`: injeta classes extras no painel.

## Placements disponíveis

- `auto`
- `top`
- `bottom`
- `left`
- `right`

## Exemplo básico

```vue
<script setup lang="ts">
import { StButton, StDropdown } from '@startbet/st-core-ui';
</script>

<template>
  <StDropdown>
    <template #trigger>
      <StButton variant="outline">Abrir menu</StButton>
    </template>

    <div class="flex min-w-st-40 flex-col gap-st-1">
      <button
        class="rounded-st-1 px-st-2 py-st-1 text-left hover:bg-st-surface-2"
      >
        Perfil
      </button>
      <button
        class="rounded-st-1 px-st-2 py-st-1 text-left hover:bg-st-surface-2"
      >
        Configurações
      </button>
    </div>
  </StDropdown>
</template>
```

## Exemplo controlado

```vue
<script setup lang="ts">
import { ref } from 'vue';

import { StButton, StDropdown } from '@startbet/st-core-ui';

const open = ref(false);
</script>

<template>
  <StDropdown :open="open" @update:open="open = $event">
    <template #trigger>
      <StButton variant="solid">
        {{ open ? 'Fechar' : 'Abrir' }}
      </StButton>
    </template>

    <div class="min-w-st-32 rounded-st-1 bg-st-surface-1 p-st-2">
      Painel controlado externamente
    </div>
  </StDropdown>
</template>
```

## Exemplo com `triggerAsChild`

```vue
<script setup lang="ts">
import { StButton, StDropdown } from '@startbet/st-core-ui';
</script>

<template>
  <StDropdown trigger-as-child>
    <template #trigger="{ open, toggle, setTriggerEl, attrs }">
      <StButton
        :ref="setTriggerEl"
        variant="outline"
        v-bind="attrs"
        @click="toggle"
      >
        {{ open ? 'Fechar ações' : 'Abrir ações' }}
      </StButton>
    </template>

    <div class="min-w-st-32 p-st-1">Conteúdo do painel</div>
  </StDropdown>
</template>
```

## Regras internas

- Quando `placement="auto"`, o componente escolhe entre `bottom` e `top` com base no espaço disponível.
- Quando `width="full"`, o painel recebe a mesma largura do trigger.
- O painel usa `position: fixed` para facilitar o reposicionamento durante `scroll` e `resize`.
- O componente monitora clique fora apenas enquanto o painel está aberto.

## Observações

- No modo controlado, o componente emite `update:open` e `open-change`, mas depende da atualização do prop `open` para refletir o novo estado.
- No modo `triggerAsChild`, o slot recebe `attrs` com `aria-haspopup` e `aria-expanded` para manter a acessibilidade do trigger.
