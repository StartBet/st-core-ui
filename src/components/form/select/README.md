# StSelect

Componente de select customizado da biblioteca para seleção única, com suporte a modos controlado e não controlado, opções via prop ou slot, ícone opcional, mensagens de feedback e integração com formulários.

## Import

```ts
import { StOption, StSelect } from '@startbet/st-core-ui';
```

## Props principais

- `value`: controla o valor selecionado de forma externa.
- `defaultValue`: define o valor inicial no modo não controlado.
- `onValueChange`: callback executado a cada mudança de seleção, recebendo o valor escolhido.
- `options`: lista de opções no formato `{ name, value }`.
- `label`: renderiza o texto acima do select.
- `icon`: nome do ícone exibido no trigger.
- `placeholder`: texto exibido quando não há valor selecionado. Default: `Selecione uma opção`.
- `name`: cria um `input[type="hidden"]` para integração com formulários.
- `required`: marca o campo como obrigatório e afeta o estado de validação.
- `disabled`: desabilita a interação. Default: `false`.
- `readOnly`: impede alteração do valor mantendo o campo focável.
- `messageInfo`: mensagem exibida quando o campo está válido e não existe `messageSuccess`.
- `messageDanger`: mensagem exibida quando o campo está inválido.
- `messageSuccess`: mensagem exibida quando o campo está válido.
- `className`: injeta classes extras no wrapper do componente.
- `panelClassName`: injeta classes extras no painel de opções.
- `placement`: define o posicionamento preferencial do dropdown.
- `offset`: define o espaçamento entre trigger e painel. Default: `8`.
- `closeOnSelect`: fecha o painel ao selecionar uma opção. Default: `true`.

## Eventos emitidos

- `update:value`: retorna o novo valor selecionado.
- `value-change`: retorna o novo valor selecionado após a mudança.

## Métodos expostos

- `focus()`
- `blur()`
- `clear()`
- `setInvalidity()`
- `setValidity()`
- `reportValidity()`

## Exemplo básico

```vue
<script setup lang="ts">
import { StSelect } from '@startbet/st-core-ui';

const options = [
  { name: 'Esportes', value: 'sports' },
  { name: 'Cassino', value: 'casino' },
  { name: 'Poker', value: 'poker' }
];
</script>

<template>
  <StSelect
    label="Categoria"
    placeholder="Selecione uma categoria"
    :options="options"
  />
</template>
```

## Exemplo controlado

```vue
<script setup lang="ts">
import { ref } from 'vue';

import { StSelect } from '@startbet/st-core-ui';

const value = ref('casino');
</script>

<template>
  <StSelect
    :value="value"
    label="Campo controlado"
    :options="[
      { name: 'Esportes', value: 'sports' },
      { name: 'Cassino', value: 'casino' }
    ]"
    @update:value="value = String($event)"
  />
</template>
```

## Exemplo com slot

```vue
<script setup lang="ts">
import { StOption, StSelect } from '@startbet/st-core-ui';
</script>

<template>
  <StSelect label="Seleção com slot">
    <StOption value="profile">Perfil</StOption>
    <StOption value="wallet">Carteira</StOption>
    <StOption value="settings">Configurações</StOption>
  </StSelect>
</template>
```

## Regras internas

- O componente usa `StDropdown` em modo `triggerAsChild` para controlar abertura, fechamento e posicionamento do painel.
- Quando `value` é informado, o componente entra em modo controlado e depende da atualização externa da prop.
- Quando `defaultValue` é usado sem `value`, o estado é gerenciado internamente.
- As opções podem ser fornecidas por `options` ou por slot com `StOption`.
- Quando `name` é informado, o valor atual também é refletido em um `input[type="hidden"]`.

## Observações

- A prop `icon` e o chevron do trigger usam `StIcon`, então os ícones precisam estar registrados no contexto de uso da biblioteca.
- `messageSuccess` tem prioridade sobre `messageInfo` quando o campo está válido.
- Quando `closeOnSelect=false`, o painel permanece aberto após a seleção.
