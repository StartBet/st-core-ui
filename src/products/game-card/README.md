# StGameCard

Card de jogo do cassino da plataforma. Faz parte da secao **Products** da lib: componentes de produto, prontos para uso, montados em cima dos tokens e dos componentes base.

Substitui o `BaseGame` da plataforma (`app/components/cometa/base/Game.vue`) nos carrosseis, grades, busca, favoritos e recentes.

## Import

```ts
import { StGameCard } from '@startbet/st-core-ui';
```

## Alimentacao

Os nomes das props espelham o `GameData` que a plataforma ja recebe da API (`name`, `provider`, `image`), entao o consumo e direto:

```vue
<script setup lang="ts">
import { NuxtLink } from '#components';

const { getImageUrl } = useCloudflareImage();

const gameLink = (game: GameData) =>
  game.url || `/play/${game.provider.slug}/${game.slug}`;
</script>

<template>
  <StGameCard
    v-for="game in games"
    :key="game.id"
    :name="game.name"
    :provider="game.provider"
    :image="getImageUrl(game.image)"
    :href="gameLink(game)"
    :link-as="NuxtLink"
  />
</template>
```

`provider` aceita o objeto da API (`{ name, slug }`) ou um texto — o card le so o `name`. A URL da capa ja chega pronta: a otimizacao (Cloudflare) continua sendo do consumidor.

## Props

| Prop                | Tipo                                   | Default             | Descricao                                              |
| ------------------- | -------------------------------------- | ------------------- | ------------------------------------------------------ |
| `name`              | `string`                               | `''`                | Nome do jogo. Sem ele o card vira `Jogo indisponivel`. |
| `provider`          | `string \| StGameCardProvider \| null` | `null`              | Provedor. Objeto da API ou texto.                      |
| `image`             | `string \| null`                       | `null`              | URL da capa, ja otimizada.                             |
| `imageLoading`      | `'lazy' \| 'eager'`                    | `lazy`              | `eager` para os cards acima da dobra (LCP).            |
| `aspect`            | `'portrait' \| 'wide'`                 | `portrait`          | `10/13` ou `16/9`.                                     |
| `showName`          | `boolean`                              | `true`              | Mostra o nome sobre a capa.                            |
| `href`              | `string`                               | `''`                | Destino do jogo; sem ele nao existe link.              |
| `linkAs`            | `string \| Component`                  | `a`                 | Componente do link; o destino vai sempre em `href`.    |
| `linkAriaLabel`     | `string`                               | `''`                | Nome acessivel do link; por padrao `Jogar {name}`.     |
| `playLabel`         | `string`                               | `Jogue`             | Texto do botao que aparece no hover.                   |
| `favorite`          | `boolean`                              | `false`             | Jogo marcado como favorito. Aceita `v-model:favorite`. |
| `showFavorite`      | `boolean`                              | `true`              | Mostra a estrela de favorito.                          |
| `favoriteAriaLabel` | `string`                               | `''`                | Rotulo da estrela; por padrao descreve a acao.         |
| `loading`           | `boolean`                              | `false`             | Skeleton no lugar do card, com a mesma proporcao.      |
| `unavailableLabel`  | `string`                               | `Jogo indisponivel` | Texto do estado indisponivel.                          |
| `ariaLabel`         | `string`                               | `''`                | Rotulo do card; por padrao o `name`.                   |
| `className`         | `string`                               | `''`                | Classes extras no container.                           |

## Slots

| Slot        | Props                     | Descricao                                                             |
| ----------- | ------------------------- | --------------------------------------------------------------------- |
| `top-start` | —                         | Canto superior esquerdo. Ex.: contador de jogadores online.           |
| `image`     | `{ class, alt, onError }` | Troca a `<img>` da capa — use para um `NuxtImg` com `sizes`/`format`. |

O slot do topo fica **fora** do link e acima dele, ao lado da estrela de favorito:

```vue
<StGameCard
  :name="game.name"
  :provider="game.provider"
  :href="gameLink(game)"
  :link-as="NuxtLink"
>
  <template #top-start>
    <OnlineCount :game-id="game.id" />
  </template>
</StGameCard>
```

Para manter a otimizacao do `NuxtImg`, repasse as props do slot:

```vue
<StGameCard :name="game.name" :provider="game.provider">
  <template #image="{ class: imageClass, alt, onError }">
    <NuxtImg
      :src="getImageUrl(game.image)"
      :class="imageClass"
      :alt="alt"
      format="webp"
      width="300"
      height="400"
      sizes="120px sm:160px md:180px lg:220px"
      loading="lazy"
      @error="onError"
    />
  </template>
</StGameCard>
```

Chamar `onError` e o que faz o card cair no fallback quando a capa nao carrega.

## Eventos

| Evento            | Payload   | Quando                                       |
| ----------------- | --------- | -------------------------------------------- |
| `update:favorite` | `boolean` | Clique na estrela, com o valor ja invertido. |

## Favorito

A estrela fica no canto superior direito e aparece por padrao; `showFavorite` falso a esconde (ex.: usuario deslogado). O card nao guarda estado: ele pinta a estrela a partir de `favorite` e avisa o clique. Quem decide e o consumidor, a partir da propria store:

```vue
<StGameCard
  :name="game.name"
  :provider="game.provider"
  :favorite="isFavorite(game.id)"
  @update:favorite="
    (value) => (value ? addFavorite(game) : removeFavorite(game))
  "
/>
```

| Estado     | Estrela                                                      |
| ---------- | ------------------------------------------------------------ |
| Fora       | Contorno `st-content-bright` com fundo `st-surface-shadow-2` |
| Favoritado | Preenchida em `st-warning`                                   |

A estrela e um `button` com `aria-pressed` e rotulo `Adicionar aos favoritos o jogo {name}` / `Remover dos favoritos o jogo {name}`. Ela fica fora do link, entao o clique nao navega e nao precisa de `@click.stop.prevent`. No skeleton e no indisponivel ela nao aparece.

## Estados

| Estado       | Quando                           | Render                                                     |
| ------------ | -------------------------------- | ---------------------------------------------------------- |
| Skeleton     | `loading`                        | Bloco `animate-pulse` em `bg-st-surface-1`, `aria-hidden`. |
| Indisponivel | sem `name`                       | Bloco com `unavailableLabel`.                              |
| Sem capa     | sem `image` ou `error` na imagem | Gradiente de superficie com o nome do jogo centralizado.   |
| Normal       | —                                | Capa, gradiente inferior, nome e provedor.                 |

O skeleton e o indisponivel usam a mesma forma (proporcao e raio) do card, entao a grade nao pula quando os dados chegam. Uma capa nova em `image` limpa o erro anterior.

## Link do jogo

Com `href`, o card inteiro vira o acesso ao jogo: uma camada absoluta por cima da capa, com o `playLabel` no hover. Sem `href`, nada de ancora vazia.

`NuxtLink` aceita `href` como alias de `to`. Componentes que so entendem `to` — `RouterLink`, por exemplo — precisam de um wrapper que faca a traducao.

O comportamento muda no breakpoint `md` (768px):

| Largura        | Sobreposicao e `Jogue`                                         | Zoom da capa                 |
| -------------- | -------------------------------------------------------------- | ---------------------------- |
| abaixo de `md` | Nao renderiza (`display: none`)                                | Nao existe                   |
| `md` ou mais   | No hover (so com `@media (hover: hover)`) e no foco de teclado | No hover, com `hover: hover` |

No mobile o primeiro toque ja abre o jogo. A sobreposicao sai do layout em vez de so ficar transparente: no iOS, um elemento que muda de visibilidade no hover faz o primeiro toque virar hover, e o usuario precisaria tocar duas vezes para entrar no jogo.

## Dimensoes

O card ocupa `100%` da largura disponivel e deriva a altura do `aspect` — quem define a largura e o container (slide do carrossel ou coluna da grade). Nao existe prop equivalente ao `fillContainer` do `BaseGame`: esse ja e o comportamento padrao.

## Tokens usados

- Card: `bg-st-surface-1`, raio `rounded-st-1`.
- Gradiente inferior de `--st-color-surface-0` para transparente — acompanha o tema, roxo no escuro.
- Nome em `st-content-default` bold, provedor em `st-content-default` com `opacity-80`.
- Hover: camada `bg-st-surface-shadow-1` e botao com as classes do `StButton` (`solid`, `secondary`, `small`), so a partir de `md`.
- Foco: `ring-st-focus` por dentro do card.
- Skeleton: `bg-st-surface-1`, a mesma superficie do card. Indisponivel: `bg-st-surface-1` com borda `st-border-2` e texto `st-content-ghost`.

## Acessibilidade

- O card e um `article` rotulado pelo `name`, ou pelo `ariaLabel` informado.
- O link tem `aria-label` proprio (`Jogar {name}`); o botao do hover e decorativo (`aria-hidden`).
- A capa e decorativa (`alt=""`): o nome ja esta em texto no card.
- Transicoes respeitam `prefers-reduced-motion`.
- `data-st-game-card`, `-image`, `-fallback`, `-info`, `-name`, `-provider`, `-link`, `-play`, `-top`, `-favorite`, `-favorite`, `-skeleton` e `-unavailable` estao disponiveis para testes e QA.

## Fora do card

O contador de jogadores online (`useLiveGameOnlineCount`) depende de flags da plataforma, entao continua no consumidor e entra pelo slot `top-start`. O estado do favorito tambem vem do consumidor (`useFavorite`), mas a estrela e do card.
