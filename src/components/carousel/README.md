# StCarousel

Componente de carousel da biblioteca com navegacao por setas e bullets, autoplay, loop infinito, altura automatica, area de escape, destaque do slide de referencia, arraste (grab) e props responsivas usando os tokens `st-*` do projeto.

## Import

```ts
import { StCarousel } from '@startbet/st-core-ui';
```

## Slide-item livre

Cada filho direto do slot default vira um slide. O componente apenas envolve o conteudo no `slide-item`, sem impor estrutura: qualquer elemento, componente ou markup pode ser usado.

```vue
<script setup lang="ts">
import { StCarousel } from '@startbet/st-core-ui';

const games = [
  { id: 1, title: 'Roleta ao vivo' },
  { id: 2, title: 'Crash' },
  { id: 3, title: 'Blackjack' }
];
</script>

<template>
  <StCarousel :slide-per-page="3" :gap="2">
    <article
      v-for="game in games"
      :key="game.id"
      class="h-full rounded-st-2 bg-st-surface-2 p-st-3"
    >
      {{ game.title }}
    </article>
  </StCarousel>
</template>
```

`v-for` e `<template>` sao achatados automaticamente, entao o numero de slides acompanha a lista de forma reativa.

## Props principais

| Prop                 | Tipo                        | Default     | Descricao                                              |
| -------------------- | --------------------------- | ----------- | ------------------------------------------------------ |
| `autoplay`           | `boolean`                   | `false`     | Habilita a troca automatica de pagina.                 |
| `autoplayTimeout`    | `number`                    | `5000`      | Intervalo do autoplay em milissegundos.                |
| `autoplayHoverPause` | `boolean`                   | `true`      | Pausa o autoplay no hover e no foco.                   |
| `autoHeight`         | `boolean`                   | `false`     | Ajusta a altura do viewport aos slides ativos.         |
| `infiniteLoop`       | `boolean`                   | `false`     | Navegacao continua usando clones nas pontas.           |
| `bullets`            | `outside \| inside \| none` | `outside`   | Tipo de navegacao por bullets.                         |
| `bulletsPosition`    | `left \| center \| right`   | `center`    | Alinhamento horizontal dos bullets.                    |
| `arrows`             | `outside \| inside \| none` | `outside`   | Tipo de navegacao por setas.                           |
| `slidePerPage`       | `number`                    | `1`         | Quantidade de colunas visiveis por pagina.             |
| `peek`               | `0..6`                      | `0`         | Area de escape lateral que revela os slides vizinhos.  |
| `slideAlign`         | `left \| center`            | `left`      | Posicao do slide de referencia na pagina.              |
| `gap`                | `UsualSizeValue \| 0..12`   | `2`         | Intervalo entre os itens (tokens `st-*`).              |
| `grab`               | `boolean`                   | `false`     | Habilita o arraste por ponteiro.                       |
| `highlight`          | `boolean`                   | `false`     | Destaca o slide de referencia, que cresce.             |
| `modelValue`         | `number`                    | `undefined` | Indice do primeiro slide visivel (`v-model`).          |
| `transitionDuration` | `number`                    | `350`       | Duracao da transicao de deslocamento em milissegundos. |

Props de estilo: `className`, `viewportClassName`, `trackClassName`, `slideClassName` e `ariaLabel`.

## Props responsivas

As props que mudam layout ou comportamento aceitam variantes por breakpoint, no mesmo padrao do `StGrid` (`sm`, `md`, `lg` — mobile first, cascata do menor para o maior):

- `slidePerPage`, `smSlidePerPage`, `mdSlidePerPage`, `lgSlidePerPage`
- `peek`, `smPeek`, `mdPeek`, `lgPeek`
- `slideAlign`, `smSlideAlign`, `mdSlideAlign`, `lgSlideAlign`
- `gap`, `smGap`, `mdGap`, `lgGap`
- `grab`, `smGrab`, `mdGrab`, `lgGrab`
- `highlight`, `smHighlight`, `mdHighlight`, `lgHighlight`
- `arrows`, `smArrows`, `mdArrows`, `lgArrows`
- `bullets`, `smBullets`, `mdBullets`, `lgBullets`

```vue
<template>
  <StCarousel
    :slide-per-page="1"
    :sm-slide-per-page="2"
    :md-slide-per-page="3"
    :lg-slide-per-page="4"
    :gap="1"
    :md-gap="2"
    :lg-gap="3"
    arrows="none"
    md-arrows="outside"
    grab
    :lg-grab="false"
  >
    <div v-for="item in 8" :key="item">Slide {{ item }}</div>
  </StCarousel>
</template>
```

Os breakpoints seguem o Tailwind (`sm: 640px`, `md: 768px`, `lg: 1024px`) e sao resolvidos em runtime via `matchMedia`, porque `slidePerPage` e `grab` tambem afetam a logica de paginacao e de arraste, nao apenas o CSS.

## Area de escape e slide de referencia

`peek` abre uma faixa lateral onde os slides vizinhos aparecem parcialmente, sinalizando que ha mais conteudo. O valor usa os tokens `st-*` e e limitado a `6` (48px) para o vazamento nao dominar a view.

O escape e aplicado como `padding` do viewport. Como o recorte acontece na borda externa do padding, o vizinho aparece nessa faixa — e, por a largura do slide ser um percentual do track, ela diminui sozinha para abrir o espaco. O slide de referencia continua inteiro, sem corte.

A referencia e sempre o slide ativo (o mesmo do `v-model` e dos bullets). `slideAlign` define onde ele aparece na view e como o escape se distribui:

- `left` (default): o ativo fica na borda esquerda e o escape fica somente a direita.
- `center`: a view recua meia pagina para o ativo cair no centro, e o escape vale nos dois lados. Com `slidePerPage` impar ele fica no centro exato do viewport.

```vue
<template>
  <StCarousel
    :slide-per-page="3"
    slide-align="center"
    :peek="4"
    :gap="2"
    highlight
  >
    <div v-for="item in 9" :key="item">Slide {{ item }}</div>
  </StCarousel>
</template>
```

Com `slidePerPage` par nao existe meio exato, entao o recuo leva o ativo para o slide anterior ao centro (ex.: a segunda de quatro colunas).

O recuo abre um slot antes do slide ativo, preenchido conforme o contexto:

- pelo slide anterior, nas posicoes intermediarias;
- pelo clone do ultimo slide, na primeira posicao com `infiniteLoop`;
- vazio, na primeira posicao sem `infiniteLoop`.

Para que o recuo nao deixe os ultimos slides de fora, a ultima posicao alcancavel tambem avanca — com `slidePerPage: 3` e 8 slides, a ultima pagina passa a comecar no setimo slide em vez do sexto. O mesmo vale para a faixa de escape: sem `infiniteLoop` ela fica vazia nas pontas, porque nao existe slide antes do primeiro nem depois do ultimo.

Quando todos os slides cabem na view (`slidePerPage` maior ou igual ao total) nao ha recuo: centralizar esconderia os ultimos itens sem nada para navegar.

A referencia define o destaque (`highlight`) e o atributo `data-st-slide-selected`, que permite estiliza-la pelo consumidor.

## Destaque do slide de referencia

`highlight` mantem o slide de referencia no tamanho cheio (`scale(1)`) e reduz os demais. A prop e independente de `grab`: o destaque pode existir sozinho, como realce visual da posicao atual.

```vue
<template>
  <StCarousel :slide-per-page="4" :peek="3" highlight :md-highlight="false">
    <div v-for="item in 10" :key="item">Slide {{ item }}</div>
  </StCarousel>
</template>
```

O destaque usa `transform: scale()` — nao `margin` nem `height` — para nao alterar a caixa do slide. Isso mantem o destaque compativel com `autoHeight` (que precisa medir a altura real do conteudo) e nao interfere no passo do arraste. Como a referencia nunca passa de `scale(1)`, ela tambem nunca e recortada pela borda do viewport, em qualquer `slidePerPage`.

A escala dos slides reduzidos vem da variavel `--st-carousel-idle-scale` (default `0.9`), que pode ser sobrescrita via CSS:

```css
.minha-vitrine {
  --st-carousel-idle-scale: 0.85;
}
```

### A escala acompanha o arraste

A escala nao alterna entre dois estados: ela e interpolada pela distancia de cada slide ate a referencia, e essa distancia acompanha o gesto em tempo real. Arrastando meio slide, o que sai e o que entra ficam ambos no meio do caminho:

| arraste | referencia | vizinho |
| ------- | ---------- | ------- |
| repouso | `1.0`      | `0.9`   |
| 25%     | `0.975`    | `0.925` |
| 50%     | `0.95`     | `0.95`  |
| 100%    | `0.9`      | `1.0`   |

O componente publica em cada slide a variavel `--st-carousel-slide-progress` (de `0` na referencia a `1` a partir de um slide de distancia) e o `calc()` do `transform` faz a conta — por isso `--st-carousel-idle-scale` continua valendo mesmo com a interpolacao. Durante o gesto a transicao e zerada para a escala seguir o ponteiro sem atraso; ao soltar, ela volta a animar junto com o deslocamento.

Como a interpolacao ja e o retorno visual do gesto, nao existe mais um estado separado de "pressionado".

## Grab

Com `grab` habilitado:

- o cursor vira `grab` / `grabbing`;
- o deslocamento e proporcional ao arraste: arrastar a largura de 3 slides move 3 slides, limitado a `slidePerPage`;
- com `slidePerPage` igual a `1`, o carousel anda sempre 1 slide;
- arrastes menores que 15% da largura de um slide sao descartados e a posicao volta ao lugar;
- o gesto vertical continua livre para o scroll da pagina, e o clique imediatamente posterior ao arraste e bloqueado para nao ativar links dentro do slide;
- o arraste nao marca texto: a selecao e bloqueada apenas depois do gesto horizontal ser reconhecido, e o trecho que tenha sido marcado no comeco do movimento e descartado;
- com `highlight` tambem ativo, a escala dos slides transita junto com o gesto, acompanhando o ponteiro.

O conteudo do slide segue interativo com `grab` ligado: clique, foco, campos de formulario e selecao de texto por duplo clique continuam funcionando. As protecoes valem somente durante o gesto horizontal — `selectstart` e `user-select` sao bloqueados nesse intervalo e liberados ao soltar, e o arraste nativo de imagens e links (`dragstart`) e sempre prevenido. Em iOS o menu de contexto do toque longo tambem e desativado (`-webkit-touch-callout`), porque competiria com o gesto.

## Navegacao

- Setas: `outside` reserva espaco ao lado do viewport, `inside` sobrepoe o conteudo, `none` remove.
- Bullets: usam o componente [`StBullets`](../bullets/README.md) e navegam por pagina (`ceil(total / slidePerPage)`).
- Teclado: `ArrowLeft` e `ArrowRight` navegam quando o foco esta dentro do carousel.
- Slots `arrow-prev` e `arrow-next` permitem trocar os icones das setas.

## Eventos e API imperativa

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { StCarousel } from '@startbet/st-core-ui';

const carousel = ref<InstanceType<typeof StCarousel> | null>(null);
const current = ref(0);
</script>

<template>
  <StCarousel
    ref="carousel"
    v-model="current"
    :slide-per-page="2"
    @change="(index) => console.log('slide ativo', index)"
    @page-change="(page) => console.log('pagina ativa', page)"
  >
    <div v-for="item in 6" :key="item">Slide {{ item }}</div>
  </StCarousel>

  <button type="button" @click="carousel?.next()">Avancar</button>
</template>
```

Metodos expostos: `next`, `prev`, `goToPage`, `goToSlide`. Estado exposto: `activeIndex`, `activePage`, `pageCount`, `visibleIndexes`.

## Acessibilidade

- Raiz com `role="group"` e `aria-roledescription="carousel"`.
- Cada slide com `role="group"`, `aria-roledescription="slide"` e `aria-label` com a posicao; clones do loop ficam com `aria-hidden`.
- Setas e bullets sao botoes com `aria-label`; o bullet ativo recebe `aria-current`.
- O autoplay pausa no hover, no foco, durante o arraste, com a aba oculta e quando o usuario pede `prefers-reduced-motion: reduce`.

## Observacoes

- O deslocamento usa `transform` com as variaveis `--st-carousel-gap`, `--st-carousel-per-page`, `--st-carousel-slide-width` e `--st-carousel-step`, definidas no track. Isso mantem a largura do slide exata mesmo com gap.
- Com `infiniteLoop`, sao renderizados `slidePerPage` clones em cada ponta; ao final da transicao a posicao e normalizada sem animacao, produzindo o giro continuo. A normalizacao escuta apenas o `transitionend` do proprio track: o evento borbulha, e a transicao de escala dos slides ou do conteudo do slide encerraria o giro antes da hora.
- Com `autoHeight`, o track usa `items-start` para que cada slide tenha a altura do proprio conteudo; sem ele os slides esticam para a mesma altura.
- Atributos de estado disponiveis para testes, QA e estilizacao pelo consumidor: `data-st-carousel-index`, `data-st-carousel-page`, `data-st-carousel-per-page`, `data-st-carousel-grabbing`, `data-st-carousel-position`, `data-st-slide-index`, `data-st-slide-clone`, `data-st-slide-active` (slide visivel na pagina) e `data-st-slide-selected` (primeiro slide da pagina).
- A logica fica em composables reutilizaveis: `useCarouselPagination`, `useCarouselAutoplay`, `useCarouselDrag`, `useCarouselAutoHeight` e `useResponsiveValue`.
