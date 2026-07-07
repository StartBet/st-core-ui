# StCheckbox

Componente de checkbox da biblioteca para seleção booleana, com suporte a modos controlado e não controlado, label por prop ou slot e encaminhamento de attrs para o `input`.

## Import

```ts
import { StCheckbox } from '@startbet/st-core-ui';
```

## Props principais

- `checked`: controla o estado marcado de forma externa.
- `defaultChecked`: define o estado inicial no modo não controlado.
- `disabled`: desabilita o input. Default: `false`.
- `label`: define o texto do label quando o slot padrão não é usado.
- `className`: injeta classes extras no wrapper.

## Eventos emitidos

- `update:checked`: retorna o novo valor booleano do checkbox.
- `change`: retorna o evento nativo disparado pelo input.

## Exemplo básico

```vue
<script setup lang="ts">
import { StCheckbox } from '@startbet/st-core-ui';
</script>

<template>
  <div class="flex flex-col gap-st-2">
    <StCheckbox label="Aceito os termos" />
    <StCheckbox default-checked label="Receber notificações" />
  </div>
</template>
```

## Exemplo controlado

```vue
<script setup lang="ts">
import { ref } from 'vue';

import { StCheckbox } from '@startbet/st-core-ui';

const checked = ref(false);
</script>

<template>
  <StCheckbox
    :checked="checked"
    label="Ativar modo controlado"
    @update:checked="checked = $event"
  />
</template>
```

## Exemplo com slot

```vue
<script setup lang="ts">
import { StCheckbox } from '@startbet/st-core-ui';
</script>

<template>
  <StCheckbox>
    <span class="text-st-body-small text-st-content-default">
      Quero receber novidades por e-mail
    </span>
  </StCheckbox>
</template>
```

## Regras internas

- O componente usa um `input[type="checkbox"]` real para manter acessibilidade e comportamento nativo.
- Quando `checked` é informado, o componente entra em modo controlado e depende da atualização externa da prop.
- Quando `defaultChecked` é usado sem `checked`, o estado é gerenciado internamente.
- `class` e `style` passados via attrs são aplicados no wrapper, enquanto os demais attrs são encaminhados ao `input`.

## Observações

- O wrapper é um `label`, então clicar no texto também alterna o checkbox quando ele não está desabilitado.
- Se `label` e slot padrão forem usados ao mesmo tempo, o conteúdo do slot tem prioridade visual.
