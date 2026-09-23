<script setup lang="ts">
import { computed, normalizeClass, ref, useAttrs, useSlots, watch } from 'vue';

import type {
  StGameCardEmits,
  StGameCardImageSlotProps,
  StGameCardProps,
  StGameCardSlots
} from './StGameCard.interface';
import {
  buildGameCardClasses,
  resolveGameCardFavoriteLabel,
  resolveGameCardLinkLabel,
  resolveGameCardProvider,
  ST_GAME_CARD_FAVORITE_ICON_PATH,
  ST_GAME_CARD_PLAY_LABEL,
  ST_GAME_CARD_UNAVAILABLE_LABEL
} from './styleStGameCard';

defineOptions({ name: 'StGameCard', inheritAttrs: false });

const props = withDefaults(defineProps<StGameCardProps>(), {
  name: '',
  provider: null,
  image: null,
  imageLoading: 'lazy',
  showName: true,
  aspect: 'portrait',
  href: '',
  linkAs: 'a',
  linkAriaLabel: '',
  playLabel: ST_GAME_CARD_PLAY_LABEL,
  favorite: false,
  showFavorite: true,
  favoriteAriaLabel: '',
  loading: false,
  unavailableLabel: ST_GAME_CARD_UNAVAILABLE_LABEL,
  ariaLabel: '',
  className: ''
});

const emit = defineEmits<StGameCardEmits>();

defineSlots<StGameCardSlots>();

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
  buildGameCardClasses({
    aspect: props.aspect,
    hasLink: hasLink.value,
    favorite: props.favorite,
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

const providerName = computed(() => resolveGameCardProvider(props.provider));

const isUnavailable = computed(() => !props.name);

const showImage = computed(
  () => (Boolean(props.image) || Boolean(slots.image)) && !hasImageError.value
);

const cardLabel = computed(() => props.ariaLabel || props.name || undefined);

const linkLabel = computed(
  () => props.linkAriaLabel || resolveGameCardLinkLabel(props.name)
);

const favoriteLabel = computed(
  () =>
    props.favoriteAriaLabel ||
    resolveGameCardFavoriteLabel(props.favorite, props.name)
);

const hasTop = computed(
  () => props.showFavorite || Boolean(slots['top-start'])
);

const onToggleFavorite = () => {
  emit('update:favorite', !props.favorite);
};

const onImageError = () => {
  hasImageError.value = true;
};

const imageSlotProps = computed<StGameCardImageSlotProps>(() => ({
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
    data-st-game-card-skeleton
    v-bind="rootAttrs"
  />

  <div
    v-else-if="isUnavailable"
    :class="rootClass(classes.unavailable)"
    :style="rootStyle"
    data-st-game-card-unavailable
    v-bind="rootAttrs"
  >
    {{ props.unavailableLabel }}
  </div>

  <article
    v-else
    :class="rootClass(classes.root)"
    :style="rootStyle"
    :aria-label="cardLabel"
    data-st-game-card
    v-bind="rootAttrs"
  >
    <template v-if="showImage">
      <slot name="image" v-bind="imageSlotProps">
        <img
          :class="classes.image"
          :src="props.image ?? ''"
          alt=""
          :loading="props.imageLoading"
          decoding="async"
          data-st-game-card-image
          @error="onImageError"
        />
      </slot>
    </template>

    <span
      v-else
      :class="classes.fallback"
      aria-hidden="true"
      data-st-game-card-fallback
    >
      {{ props.name }}
    </span>

    <div
      v-if="props.showName || providerName"
      :class="classes.info"
      data-st-game-card-info
    >
      <span v-if="props.showName" :class="classes.name" data-st-game-card-name>
        {{ props.name }}
      </span>

      <span
        v-if="providerName"
        :class="classes.provider"
        data-st-game-card-provider
      >
        {{ providerName }}
      </span>
    </div>

    <component
      :is="props.linkAs"
      v-if="hasLink"
      :href="props.href"
      :class="classes.link"
      :aria-label="linkLabel"
      data-st-game-card-link
    >
      <span :class="classes.overlay" aria-hidden="true">
        <span :class="classes.play" data-st-game-card-play>
          <span :class="classes.playContent">{{ props.playLabel }}</span>
        </span>
      </span>
    </component>

    <div v-if="hasTop" :class="classes.top" data-st-game-card-top>
      <slot name="top-start"><span /></slot>

      <button
        v-if="props.showFavorite"
        type="button"
        :class="classes.favoriteButton"
        :aria-label="favoriteLabel"
        :aria-pressed="props.favorite"
        :title="favoriteLabel"
        data-st-game-card-favorite
        @click="onToggleFavorite"
      >
        <svg
          :class="classes.favoriteIcon"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          aria-hidden="true"
        >
          <path :d="ST_GAME_CARD_FAVORITE_ICON_PATH" />
        </svg>
      </button>
    </div>
  </article>
</template>
