# StAlert

Alerta de interface, fixo no fluxo da pagina, nos status semanticos da lib. Tem icone padrao por status, titulo, descricao e botao de fechar opcional. A largura segue a mesma escala do `StPaper`.

Para feedback passageiro, disparado por uma acao, use o [`StToast`](../toasts/toast/README.md).

## Import

```ts
import { StAlert } from '@startbet/st-core-ui';
```

## Props

| Prop             | Tipo            | Default         | Descricao                                                         |
| ---------------- | --------------- | --------------- | ----------------------------------------------------------------- |
| `title`          | `string`        | `''`            | Titulo do alerta.                                                 |
| `description`    | `string`        | `''`            | Texto de apoio; o alerta cresce conforme o conteudo.              |
| `status`         | `StAlertStatus` | `info`          | Status do alerta.                                                 |
| `icon`           | `string`        | `undefined`     | Sobrescreve o icone padrao do status.                             |
| `hideIcon`       | `boolean`       | `false`         | Remove o icone do status.                                         |
| `closable`       | `boolean`       | `false`         | Renderiza o botao de fechar.                                      |
| `closeAriaLabel` | `string`        | `Fechar alerta` | Rotulo do botao de fechar.                                        |
| `open`           | `boolean`       | `undefined`     | Visibilidade (`v-model:open`). Sem a prop, o alerta se controla.  |
| `width`          | `SizeValue`     | `full`          | Largura, na escala do `StPaper` (`full`, `fit-content`, `96`...). |
| `className`      | `string`        | `''`            | Classes extras no container.                                      |

## Slots

| Slot      | Descricao                                      |
| --------- | ---------------------------------------------- |
| `default` | Conteudo extra abaixo da descricao.            |
| `action`  | Linha de acoes no fim do alerta (botao, link). |

## Eventos

| Evento        | Payload   | Quando                     |
| ------------- | --------- | -------------------------- |
| `close`       | —         | Clique no botao de fechar. |
| `update:open` | `boolean` | Clique no botao de fechar. |

### Status disponiveis

| Status     | Uso                               | Icone padrao           |
| ---------- | --------------------------------- | ---------------------- |
| `info`     | Informacao neutra.                | `circle-info`          |
| `system`   | Aviso da plataforma, manutencao.  | `gear`                 |
| `warning`  | Atencao, algo perto de um limite. | `triangle-exclamation` |
| `positive` | Confirmacao, algo liberado.       | `circle-check`         |
| `negative` | Erro ou bloqueio.                 | `circle-xmark`         |

## Exemplo basico

```vue
<script setup lang="ts">
import { StAlert } from '@startbet/st-core-ui';
</script>

<template>
  <StAlert
    status="warning"
    title="Verificacao de identidade pendente"
    description="Envie um documento com foto para liberar saques acima de R$ 500."
  />
</template>
```

## Com fechar

Sem `open`, o alerta some sozinho ao ser fechado. Com `v-model:open`, quem decide e o componente pai.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { StAlert } from '@startbet/st-core-ui';

const aberto = ref(true);
</script>

<template>
  <StAlert
    v-model:open="aberto"
    closable
    status="info"
    title="Novo mercado disponivel"
  />
</template>
```

## Dimensoes

- `width` usa as mesmas classes de largura do `StPaper` (`sizeWidthClasses`). O default `full` ocupa o container; `max-w-full` impede que larguras fixas estourem em telas estreitas.
- Altura livre: cresce com a descricao e com os slots. Textos longos quebram em varias linhas (`break-words`).

## Tokens usados

- Fundo: `bg-st-surface-<status>`; borda de 1px em volta toda, em `border-st-content-<status>`.
- Titulo, icone e fechar: `text-st-content-<status>`; descricao em `text-st-content-default`.
- Sem sombra, porque o alerta fica no fluxo da pagina. Raio `rounded-st-1`, respiro `p-st-2`.
- Tipografia: `font-st-body`, titulo em `text-st-body-medium` negrito e descricao em `text-st-body-small`.

## Acessibilidade

- `negative` e `warning` usam `role="alert"`; `info`, `system` e `positive` usam `role="status"`.
- O icone do status e `aria-hidden`; a informacao vem do titulo e da descricao.
- O botao de fechar tem `aria-label` configuravel por `closeAriaLabel`.
- `data-st-alert-status`, `data-st-alert-icon`, `data-st-alert-title`, `data-st-alert-description` e `data-st-alert-close` estao disponiveis para testes e QA.

## Observacoes

- Os icones dos cinco status e o `xmark` ja vem registrados no componente. Um icone proprio em `icon` precisa do renderizador de icones da aplicacao (ver [`StIcon`](../icon/README.md)).
