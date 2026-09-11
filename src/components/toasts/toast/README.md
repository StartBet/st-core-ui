# StToast

Cartao de feedback da aplicacao, nos status semanticos da lib. Largura fixa de `st-48` (384px) e altura livre, definida pelo titulo e pela descricao.

Na maioria dos casos voce nao monta o `StToast` na mao: dispara pelo [`useToast`](../toast-container/README.md) e o [`StToastContainer`](../toast-container/README.md) renderiza. Use direto quando o aviso for fixo na pagina.

## Import

```ts
import { StToast } from '@startbet/st-core-ui';
```

## Props

| Prop             | Tipo            | Default        | Descricao                                           |
| ---------------- | --------------- | -------------- | --------------------------------------------------- |
| `title`          | `string`        | `''`           | Titulo do feedback.                                 |
| `description`    | `string`        | `''`           | Texto de apoio; o toast cresce conforme o conteudo. |
| `status`         | `StToastStatus` | `info`         | Status do feedback.                                 |
| `icon`           | `string`        | `undefined`    | Sobrescreve o icone padrao do status.               |
| `hideIcon`       | `boolean`       | `false`        | Remove o icone do status.                           |
| `closable`       | `boolean`       | `true`         | Renderiza o botao de fechar.                        |
| `closeAriaLabel` | `string`        | `Fechar aviso` | Rotulo do botao de fechar.                          |
| `className`      | `string`        | `''`           | Classes extras no container.                        |

## Slots

| Slot      | Descricao                                          |
| --------- | -------------------------------------------------- |
| `default` | Conteudo extra abaixo da descricao.                |
| `action`  | Linha de acoes no fim do card (botao, link, chip). |

## Eventos

| Evento  | Payload | Quando                     |
| ------- | ------- | -------------------------- |
| `close` | —       | Clique no botao de fechar. |

### Status disponiveis

| Status     | Uso                                | Icone padrao           |
| ---------- | ---------------------------------- | ---------------------- |
| `info`     | Informacao neutra.                 | `circle-info`          |
| `system`   | Aviso da plataforma, manutencao.   | `gear`                 |
| `warning`  | Atencao, algo perto de um limite.  | `triangle-exclamation` |
| `positive` | Confirmacao de uma acao concluida. | `circle-check`         |
| `negative` | Erro ou bloqueio.                  | `circle-xmark`         |

## Exemplo basico

```vue
<script setup lang="ts">
import { StToast } from '@startbet/st-core-ui';
</script>

<template>
  <StToast
    status="positive"
    title="Aposta registrada"
    description="Bilhete 4821 confirmado no Brasileirao Serie A."
  />
</template>
```

## Com acao

```vue
<template>
  <StToast status="positive" title="Aposta registrada">
    <template #action>
      <StButton size="small" variant="text">Ver bilhete</StButton>
    </template>
  </StToast>
</template>
```

## Dimensoes

- Largura fixa de `w-st-48` (384px), com `max-w-full` para nao estourar em telas estreitas.
- Altura livre: cresce com a descricao, com o slot `action` e com qualquer conteudo do slot padrao. Textos longos quebram em varias linhas (`break-words`), sem corte nem reticencias.

## Tokens usados

- Fundo: `bg-st-surface-<status>`; acento lateral de 4px em `border-l-st-<status>`.
- Titulo e icone: `text-st-content-<status>`; descricao em `text-st-content-default`.
- Elevacao `shadow-st-paper-3`, raio `rounded-st-1`, respiro `p-st-2`.
- Tipografia: `font-st-body`, titulo em `text-st-body-medium` negrito e descricao em `text-st-body-small`.

Superficie e conteudo sao os pares semanticos da lib, entao o contraste se mantem nos temas claro e escuro.

## Acessibilidade

- `negative` e `warning` usam `role="alert"` com `aria-live="assertive"`: interrompem a leitura, porque exigem acao.
- `info`, `system` e `positive` usam `role="status"` com `aria-live="polite"`: esperam uma pausa natural do leitor de tela.
- O icone do status e `aria-hidden`; a informacao vem do titulo e da descricao.
- O botao de fechar tem `aria-label` configuravel por `closeAriaLabel`.
- `data-st-toast-status`, `data-st-toast-icon`, `data-st-toast-description` e `data-st-toast-close` estao disponiveis para testes e QA.

## Observacoes

- Os icones dos cinco status e o `xmark` do botao de fechar ja vem registrados no componente. Um icone informado em `icon` precisa ser registrado na `library` do Font Awesome pelo projeto consumidor.
- Para disparar toasts de qualquer ponto da aplicacao, veja o [`StToastContainer`](../toast-container/README.md) e o `useToast`.
