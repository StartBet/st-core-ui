# StToastContainer e useToast

A dupla que faz o feedback virar uma chamada de funcao: monte o `StToastContainer` uma vez na aplicacao e dispare [`StToast`](../toast/README.md) de qualquer lugar com `useToast()`.

## Import

```ts
import { StToastContainer, useToast } from '@startbet/st-core-ui';
```

## Montagem

O container e o unico ponto que precisa existir no layout. Monte uma vez, normalmente no `App.vue`:

```vue
<script setup lang="ts">
import { StToastContainer } from '@startbet/st-core-ui';
</script>

<template>
  <RouterView />
  <StToastContainer />
</template>
```

## Disparando de qualquer lugar

```vue
<script setup lang="ts">
import { useToast } from '@startbet/st-core-ui';

const toast = useToast();

const registrarAposta = async () => {
  try {
    await api.apostar();
    toast.positive({
      title: 'Aposta registrada',
      description: 'Bilhete 4821 confirmado.'
    });
  } catch {
    toast.negative('Nao foi possivel registrar a aposta');
  }
};
</script>
```

Cada atalho aceita so o titulo (`toast.positive('Pronto')`) ou o objeto completo de opcoes.

## API do useToast

| Membro       | Assinatura                          | Descricao                        |
| ------------ | ----------------------------------- | -------------------------------- |
| `toasts`     | `ComputedRef<StToastEntry[]>`       | Fila atual, somente leitura.     |
| `toast`      | `(options) => string`               | Dispara e devolve o id.          |
| `info`       | `(options) => string`               | Atalho com `status: 'info'`.     |
| `system`     | `(options) => string`               | Atalho com `status: 'system'`.   |
| `warning`    | `(options) => string`               | Atalho com `status: 'warning'`.  |
| `positive`   | `(options) => string`               | Atalho com `status: 'positive'`. |
| `negative`   | `(options) => string`               | Atalho com `status: 'negative'`. |
| `dismiss`    | `(id: string) => void`              | Fecha um toast pelo id.          |
| `dismissAll` | `() => void`                        | Fecha todos.                     |
| `pause`      | `() => void`                        | Congela a contagem de todos.     |
| `resume`     | `() => void`                        | Retoma do tempo restante.        |
| `config`     | `{ duration: number; max: number }` | Ajustes globais reativos.        |

### Opcoes do toast

Todas as props do [`StToast`](../toast/README.md) (menos `className` e `closeAriaLabel`), mais:

| Opcao      | Tipo     | Default | Descricao                                               |
| ---------- | -------- | ------- | ------------------------------------------------------- |
| `duration` | `number` | `5000`  | Tempo ate fechar, em ms. `0` mantem na tela ate fechar. |

```ts
toast.negative({
  title: 'Conta nao verificada',
  description: 'Envie um documento para liberar saques.',
  duration: 0
});
```

## Props do StToastContainer

| Prop           | Tipo              | Default               | Descricao                                          |
| -------------- | ----------------- | --------------------- | -------------------------------------------------- |
| `position`     | `StToastPosition` | `top-right`           | Canto da tela onde a pilha aparece.                |
| `gap`          | `1 \| 2 \| 3`     | `1`                   | Espaco entre os toasts.                            |
| `pauseOnHover` | `boolean`         | `true`                | Congela a contagem com o ponteiro sobre a pilha.   |
| `to`           | `string \| false` | `body`                | Destino do `Teleport`; `false` renderiza no lugar. |
| `ariaLabel`    | `string`          | `Avisos da aplicacao` | Rotulo da regiao de avisos.                        |
| `className`    | `string`          | `''`                  | Classes extras no container.                       |

Posicoes: `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center` e `bottom-right`. Nas de baixo a pilha cresce para cima, mantendo o toast mais novo perto da borda.

## Configuracao global

```ts
import { stToastConfig } from '@startbet/st-core-ui';

stToastConfig.duration = 8000; // padrao de duracao
stToastConfig.max = 3; // maximo de toasts na fila
```

O objeto e reativo e vale para os proximos toasts. Ao passar de `max`, o mais antigo sai da fila — inclusive os persistentes, entao a pilha nunca cresce sem limite.

## Regras internas

- A fila vive no escopo do modulo, e nao por instancia: todo `useToast()` fala com a mesma lista, e um unico container basta para a aplicacao inteira.
- `pause` guarda o tempo restante e `resume` reinicia a partir dele, entao passar o mouse nao reinicia a contagem do zero.
- Toasts com `duration: 0` ignoram `pause` e `resume`; so saem por `dismiss`, `dismissAll` ou pelo limite da fila.
- O container tem `pointer-events-none` e cada toast `pointer-events-auto`: a pagina atras da pilha continua clicavel.
- Entrada, saida e reposicionamento usam `TransitionGroup`, respeitando `prefers-reduced-motion`.

## Acessibilidade

- O container e uma `region` com `aria-label` configuravel.
- Cada toast escolhe o proprio `role` e `aria-live` pelo status — veja o [`StToast`](../toast/README.md).
- Focar qualquer elemento dentro da pilha tambem congela a contagem, para quem navega por teclado nao perder o aviso.
- `data-st-toast-container` esta disponivel para testes e QA.

## Fora do componente

`pushToast`, `dismissToast`, `dismissAllToasts`, `pauseToasts` e `resumeToasts` sao exportados soltos, para disparar feedback de um interceptor HTTP, de uma store ou de qualquer arquivo que nao seja um componente:

```ts
import { pushToast } from '@startbet/st-core-ui';

api.interceptors.response.use(undefined, (error) => {
  pushToast({ title: 'Falha na comunicacao', status: 'negative' });

  return Promise.reject(error);
});
```
