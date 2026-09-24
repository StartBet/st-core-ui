<script setup lang="ts">
import { computed, normalizeClass, ref, useAttrs, useSlots, watch } from 'vue';

import type {
  StPromotionCardImageSlotProps,
  StPromotionCardProps,
  StPromotionCardSlots
} from './StPromotionCard.interface';
import {
  buildPromotionCardClasses,
  resolvePromotionCardLinkLabel,
  ST_PROMOTION_CARD_CTA_LABEL
} from './styleStPromotionCard';
import StButton from '../../components/buttons/button/StButton.vue';

defineOptions({ name: 'StPromotionCard', inheritAttrs: false });

const props = withDefaults(defineProps<StPromotionCardProps>(), {
  name: '',
  description: '',
  image: null,
  imageLoading: 'lazy',
  href: '',
  linkAs: 'a',
  linkAriaLabel: '',
  ctaLabel: ST_PROMOTION_CARD_CTA_LABEL,
  showCta: true,
  ctaVariant: 'solid',
  ctaColor: 'secondary',
  ctaSize: 'small',
  loading: false,
  ariaLabel: '',
  className: ''
});

defineSlots<StPromotionCardSlots>();

const attrs = useAttrs();
const slots = useSlots();

const hasImageError = ref(false);

watch(
  () => props.image,
  () => {
    hasImageError.value = false;
  }
);

const hasLink = computed(() => Boolean(props.href));

const classes = computed(() =>
  buildPromotionCardClasses({
    hasLink: hasLink.value,
    className: props.className
  })
);

const rootClass = (base: string) => normalizeClass([base, attrs.class]);

const rootStyle = computed(() => attrs.style);

const rootAttrs = computed(() => {
  const next: Record<string, unknown> = { ...attrs };
  delete next.class;
  delete next.style;
  return next;
});

const showImage = computed(
  () => (Boolean(props.image) || Boolean(slots.image)) && !hasImageError.value
);

const cardLabel = computed(() => props.ariaLabel || props.name || undefined);

const linkLabel = computed(
  () => props.linkAriaLabel || resolvePromotionCardLinkLabel(props.name)
);

const onImageError = () => {
  hasImageError.value = true;
};

const imageSlotProps = computed<StPromotionCardImageSlotProps>(() => ({
  class: classes.value.image,
  alt: '',
  onError: onImageError
}));
</script>

<template>
  <div
    v-if="props.loading"
    :class="rootClass(classes.skeleton)"
    :style="rootStyle"
    aria-busy="true"
    aria-hidden="true"
    data-st-promotion-card-skeleton
    v-bind="rootAttrs"
  >
    <span :class="classes.skeletonMedia" />
    <span :class="classes.skeletonFooter" />
  </div>

  <article
    v-else
    :class="rootClass(classes.root)"
    :style="rootStyle"
    :aria-label="cardLabel"
    data-st-promotion-card
    v-bind="rootAttrs"
  >
    <div :class="classes.media" data-st-promotion-card-media>
      <template v-if="showImage">
        <slot name="image" v-bind="imageSlotProps">
          <img
            :class="classes.image"
            :src="props.image ?? ''"
            alt=""
            :loading="props.imageLoading"
            decoding="async"
            data-st-promotion-card-image
            @error="onImageError"
          />
        </slot>
      </template>

      <span
        v-else
        :class="classes.fallback"
        aria-hidden="true"
        data-st-promotion-card-fallback
      >
        {{ props.name }}
      </span>
    </div>

    <div :class="classes.footer" data-st-promotion-card-footer>
      <div :class="classes.text">
        <span
          v-if="props.name"
          :class="classes.name"
          data-st-promotion-card-name
        >
          {{ props.name }}
        </span>

        <span
          v-if="props.description"
          :class="classes.description"
          data-st-promotion-card-description
        >
          {{ props.description }}
        </span>
      </div>

      <!--
        O card inteiro ja e o link: o botao fica fora do foco e da arvore de
        acessibilidade, e o clique passa para a camada do link por cima.
      -->
      <StButton
        v-if="props.showCta && props.ctaLabel"
        :variant="props.ctaVariant"
        :color="props.ctaColor"
        :size="props.ctaSize"
        class-name="shrink-0 pointer-events-none"
        tabindex="-1"
        aria-hidden="true"
        data-st-promotion-card-cta
      >
        {{ props.ctaLabel }}
      </StButton>
    </div>

    <component
      :is="props.linkAs"
      v-if="hasLink"
      :href="props.href"
      :class="classes.link"
      :aria-label="linkLabel"
      :title="linkLabel"
      data-st-promotion-card-link
    />

    <div
      v-if="slots['top-start']"
      :class="classes.top"
      data-st-promotion-card-top
    >
      <slot name="top-start" />
    </div>
  </article>
</template>
