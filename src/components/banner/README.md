# StBanner

Faixa de status em formato pill, com uma unica frase. Cresce na horizontal conforme o texto, ate a largura do container. Aceita icone opcional, botao de acao e botao de fechar.

Para um aviso com titulo e descricao, use o [`StAlert`](../alert/README.md).

## Import

```ts
import { StBanner } from '@startbet/st-core-ui';
```

## Props

| Prop             | Tipo             | Default         | Descricao                                                        |
| ---------------- | ---------------- | --------------- | ---------------------------------------------------------------- |
| `text`           | `string`         | `''`            | Frase do banner; o slot padrao tem prioridade.                   |
| `status`         | `StBannerStatus` | `info`          | Status do banner.                                                |
| `icon`           | `string`         | `undefined`     | Icone a esquerda da frase. Sem a prop, nao ha icone.             |
| `actionLabel`    | `string`         | `undefined`     | Rotulo do botao de acao; o slot `action` tem prioridade.         |
| `closable`       | `boolean`        | `false`         | Renderiza o botao de fechar.                                     |
| `closeAriaLabel` | `string`         | `Fechar banner` | Rotulo do botao de fechar.                                       |
| `open`           | `boolean`        | `undefined`     | Visibilidade (`v-model:open`). Sem a prop, o banner se controla. |
| `className`      | `string`         | `''`            | Classes extras no container.                                     |

## Slots

| Slot      | Descricao                                         |
| --------- | ------------------------------------------------- |
| `default` | Conteudo da frase, no lugar de `text`.            |
| `action`  | Acao propria, no lugar do botao de `actionLabel`. |

## Eventos

| Evento        | Payload      | Quando                            |
| ------------- | ------------ | --------------------------------- |
| `action`      | `MouseEvent` | Clique no botao de `actionLabel`. |
| `close`       | —            | Clique no botao de fechar.        |
| `update:open` | `boolean`    | Clique no botao de fechar.        |

### Status disponiveis

| Status      | Uso                                 | Cor do botao de acao |
| ----------- | ----------------------------------- | -------------------- |
| `info`      | Informacao neutra.                  | `primary`            |
| `system`    | Aviso da plataforma, manutencao.    | `primary`            |
| `warning`   | Atencao, algo perto de um limite.   | `primary`            |
| `positive`  | Confirmacao, algo liberado.         | `positive`           |
| `negative`  | Erro ou bloqueio.                   | `negative`           |
| `primary`   | Destaque de marca, promocao.        | `primary`            |
| `secondary` | Destaque secundario, oferta rapida. | `secondary`          |

## Exemplo basico

```vue
<script setup lang="ts">
import { StBanner } from '@startbet/st-core-ui';
</script>

<template>
  <StBanner
    status="primary"
    icon="gift"
    text="Deposite hoje e ganhe 100% de bonus ate R$ 200"
    action-label="Depositar"
    closable
    @action="abrirDeposito"
  />
</template>
```

## Acao propria

```vue
<StBanner status="primary" text="Bonus liberado">
  <template #action>
    <StButton size="small" variant="outline" class-name="!rounded-full">
      Regras
    </StButton>
  </template>
</StBanner>
```

## Dimensoes

- `w-fit` com `max-w-full`: a pill acompanha a frase e para na largura do container.
- A frase fica em uma linha; o que passar da largura vira reticencias, com o texto completo no `title`.
- Altura minima de 40px (`min-h-st-5`), que acomoda o `StButton` `small` com 6px de respiro. O lado que termina em icone, botao ou fechar encolhe o padding para a borda da pill abracar o elemento.

## Tokens usados

- Fundo: `bg-st-content-<status>`, sem borda — as cores sao invertidas em relacao ao `StAlert`.
- Frase e fechar: `text-st-surface-<status>`, frase em `text-st-body-small` semibold.
- Icone: circulo de 28px (`rounded-full`) com as cores invertidas de novo, `bg-st-surface-<status>` e `text-st-content-<status>`.
- Acao: `StButton` `small` `solid` na cor do status, com `!rounded-full` para seguir a pill.

## Acessibilidade

- `negative` e `warning` usam `role="alert"`; os demais status usam `role="status"`.
- O icone e `aria-hidden`; a informacao esta na frase.
- O botao de fechar tem `aria-label` configuravel por `closeAriaLabel`.
- `data-st-banner-status`, `data-st-banner-icon`, `data-st-banner-text`, `data-st-banner-action` e `data-st-banner-close` estao disponiveis para testes e QA.

## Observacoes

- Nao ha icone padrao: o banner mostra so o icone passado em `icon`. Um icone fora dos ja usados pela lib precisa do renderizador de icones da aplicacao (ver [`StIcon`](../icon/README.md)).
