# StSwitch

Componente de switch da biblioteca para alternância booleana, com suporte a modos controlado e não controlado, label por prop ou slot e ícones opcionais nos estados ligado e desligado.

## Import

```ts
import { StSwitch } from '@startbet/st-core-ui';
```

## Props principais

- `checked`: controla o estado ligado de forma externa.
- `defaultChecked`: define o estado inicial no modo não controlado.
- `disabled`: desabilita o input. Default: `false`.
- `label`: define o texto do label quando o slot padrão não é usado.
- `iconOff`: nome do ícone exibido no lado desligado.
- `iconOn`: nome do ícone exibido no lado ligado.
- `className`: injeta classes extras no wrapper.

## Eventos emitidos

- `update:checked`: retorna o novo valor booleano do switch.
- `change`: retorna o evento nativo disparado pelo input.

## Exemplo básico

```vue
<script setup lang="ts">
import { StSwitch } from '@startbet/st-core-ui';
</script>

<template>
  <div class="flex flex-col gap-st-2">
    <StSwitch label="Receber notificações" />
    <StSwitch default-checked label="Modo turbo" />
  </div>
</template>
```

## Exemplo controlado

```vue
<script setup lang="ts">
import { ref } from 'vue';

import { StSwitch } from '@startbet/st-core-ui';

const checked = ref(false);
</script>

<template>
  <StSwitch
    :checked="checked"
    label="Modo controlado"
    @update:checked="checked = $event"
  />
</template>
```

## Exemplo com ícones

```vue
<script setup lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

import { StSwitch } from '@startbet/st-core-ui';

library.add(faCheck, faXmark);
</script>

<template>
  <StSwitch
    label="Ativar confirmações visuais"
    icon-off="xmark"
    icon-on="check"
  />
</template>
```

## Regras internas

- O componente usa um `input[type="checkbox"]` real com `role="switch"` para manter acessibilidade e comportamento nativo.
- Quando `checked` é informado, o componente entra em modo controlado e depende da atualização externa da prop.
- Quando `defaultChecked` é usado sem `checked`, o estado é gerenciado internamente.
- `class` e `style` passados via attrs são aplicados no wrapper, enquanto os demais attrs são encaminhados ao `input`.

## Observações

- O wrapper é um `label`, então clicar no texto também alterna o switch quando ele não está desabilitado.
- Se `label` e slot padrão forem usados ao mesmo tempo, o conteúdo do slot tem prioridade visual.
- Os ícones exibidos em `iconOff` e `iconOn` dependem do registro prévio no Font Awesome usado pela aplicação consumidora.
