# StPromotionCard

Card de promocao da plataforma. Faz parte da secao **Products** da lib: componentes de produto, prontos para uso, montados em cima dos tokens e dos componentes base.

Substitui o card montado a mao no `StPromotionCarousel` (`app/components/domain/promotion-carousel`) e na listagem `app/components/cometa/promotions/index.vue` — o `NuxtLink` com banner, nome, descricao e o `BaseButton variant="smartbet"`, que da lugar ao `StButton` da lib.

## Import

```ts
import { StPromotionCard } from '@startbet/st-core-ui';
```

## Alimentacao

Os nomes das props espelham a promocao que a plataforma ja recebe da API (`name`, `description`, `image`), entao o consumo e direto:

```vue
<script setup lang="ts">
import { NuxtLink } from '#components';

const { getImageUrl } = useCloudflareImage();

const promotionImage = (promotion: StPromotionCarouselItem) =>
  getImageUrl(promotion.image_cf, promotion.image, 'bannerModal');
</script>

<template>
  <StPromotionCard
    v-for="promotion in promotions"
    :key="promotion.slug"
    :name="promotion.name"
    :description="promotion.description"
    :image="promotionImage(promotion)"
    :href="`/promotions/${promotion.slug}`"
    :link-as="NuxtLink"
  />
</template>
```

A URL do banner ja chega pronta: a otimizacao (Cloudflare) continua sendo do consumidor. Evite `v-bind="promotion"`: campos como `id` e `slug` cairiam como atributos no `article`.

No carrossel, o card ocupa o slide inteiro — basta manter `slide-class-name="flex"` no `StCarousel`. O skeleton entra no lugar dos cards enquanto a store carrega:

```vue
<StCarousel slide-class-name="flex" ...>
  <template v-if="isLoading">
    <StPromotionCard v-for="index in skeletonCount" :key="index" loading />
  </template>

  <template v-else>
    <StPromotionCard
      v-for="(promotion, index) in promotions"
      :key="promotion.slug"
      :name="promotion.name"
      :description="promotion.description"
      :image="promotionImage(promotion)"
      :image-loading="index === 0 ? 'eager' : 'lazy'"
      :href="`/promotions/${promotion.slug}`"
      :link-as="NuxtLink"
    />
  </template>
</StCarousel>
```

## Props

| Prop            | Tipo                  | Default      | Descricao                                                                |
| --------------- | --------------------- | ------------ | ------------------------------------------------------------------------ |
| `name`          | `string`              | `''`         | Nome da promocao. Uma linha, com reticencias.                            |
| `description`   | `string`              | `''`         | Descricao curta. Ate duas linhas; vazia, nao renderiza.                  |
| `image`         | `string \| null`      | `null`       | URL do banner 16/9, ja otimizada.                                        |
| `imageLoading`  | `'lazy' \| 'eager'`   | `lazy`       | `eager` para o primeiro card acima da dobra (LCP).                       |
| `href`          | `string`              | `''`         | Destino da promocao; sem ele nao existe link.                            |
| `linkAs`        | `string \| Component` | `a`          | Componente do link; o destino vai sempre em `href`.                      |
| `linkAriaLabel` | `string`              | `''`         | Nome acessivel do link; por padrao `Saiba mais sobre a promoção {name}`. |
| `ctaLabel`      | `string`              | `Saiba mais` | Texto do CTA.                                                            |
| `showCta`       | `boolean`             | `true`       | Mostra o CTA.                                                            |
| `ctaVariant`    | `ButtonVariant`       | `solid`      | `variant` do `StButton` do CTA.                                          |
| `ctaColor`      | `ButtonColor`         | `secondary`  | `color` do `StButton` do CTA.                                            |
| `ctaSize`       | `ButtonSize`          | `small`      | `size` do `StButton` do CTA.                                             |
| `loading`       | `boolean`             | `false`      | Skeleton no lugar do card, com a mesma forma.                            |
| `ariaLabel`     | `string`              | `''`         | Rotulo do card; por padrao o `name`.                                     |
| `className`     | `string`              | `''`         | Classes extras no container.                                             |

## Slots

| Slot        | Props                     | Descricao                                                               |
| ----------- | ------------------------- | ----------------------------------------------------------------------- |
| `image`     | `{ class, alt, onError }` | Troca a `<img>` do banner — use para um `NuxtImg` com `sizes`/`format`. |
| `top-start` | —                         | Canto superior esquerdo, acima do link. Ex.: `StChip` `Termina hoje`.   |

```vue
<StPromotionCard :name="promotion.name" :description="promotion.description">
  <template #image="{ class: imageClass, alt, onError }">
    <NuxtImg
      :src="promotionImage(promotion)"
      :class="imageClass"
      :alt="alt"
      format="webp"
      sizes="100vw sm:50vw lg:33vw"
      @error="onError"
    />
  </template>
</StPromotionCard>
```

Chamar `onError` e o que faz o card cair no fallback quando o banner nao carrega.

## Estados

| Estado   | Quando                           | Render                                                       |
| -------- | -------------------------------- | ------------------------------------------------------------ |
| Skeleton | `loading`                        | Midia 16/9 e rodape em `animate-pulse`, `aria-hidden`.       |
| Sem capa | sem `image` ou `error` na imagem | Gradiente de superficie com o nome da promocao centralizado. |
| Normal   | —                                | Banner, nome, descricao e CTA.                               |

A midia reserva o 16/9 antes da imagem chegar e o skeleton tem a mesma forma, entao o carrossel nao pula quando os dados chegam. Uma imagem nova em `image` limpa o erro anterior.

## Link e CTA

Com `href`, o card inteiro vira o acesso a promocao: uma camada absoluta por cima de tudo, com `aria-label` e `title` proprios. O CTA e o `StButton` da lib, mas fica fora do foco (`tabindex="-1"`, `aria-hidden`) e com `pointer-events-none`: o clique cai no link por cima, entao nao ha dois alvos para a mesma acao.

`NuxtLink` aceita `href` como alias de `to`. Componentes que so entendem `to` — `RouterLink`, por exemplo — precisam de um wrapper que faca a traducao.

No hover (so com `@media (hover: hover)`) a borda acende em `st-primary` e, a partir de `md`, o banner da um zoom leve.

## Dimensoes

O card ocupa `100%` da largura disponivel; a altura sai do banner 16/9 mais o rodape. Quem define a largura e o container (slide do carrossel ou coluna da grade).

## Tokens usados

- Card: `bg-st-surface-2`, borda `st-border-1`, raio `rounded-st-1`; hover com borda `st-primary`.
- Nome em `st-content-default` bold e caixa alta; descricao em `st-content-default` com `opacity-60`.
- CTA: `StButton` `solid` / `secondary` / `small` por padrao — o mesmo do `Jogue` do `StGameCard`. Nenhum estilo de botao e definido no card.
- Foco: `ring-st-focus` por dentro do card.
- Skeleton: `bg-st-surface-1` com rodape `bg-st-surface-2`.

## Acessibilidade

- O card e um `article` rotulado pelo `name`, ou pelo `ariaLabel` informado.
- O banner e decorativo (`alt=""`): o nome ja esta em texto no card. Arte com texto importante deve ter esse texto tambem em `name`/`description`.
- Transicoes respeitam `prefers-reduced-motion`.
- `data-st-promotion-card`, `-media`, `-image`, `-fallback`, `-footer`, `-name`, `-description`, `-cta`, `-link`, `-top` e `-skeleton` estao disponiveis para testes e QA.
