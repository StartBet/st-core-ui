<script setup lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { computed, normalizeClass, ref, useAttrs, watch } from 'vue';

import type { StAvatarProps } from './StAvatar.interface';
import {
  buildAvatarClasses,
  resolveAvatarColor,
  resolveAvatarContent,
  resolveAvatarIconSize,
  resolveAvatarInitials,
  ST_AVATAR_PLACEHOLDER_ICON
} from './styleStAvatar';
import StIcon from '../../icon/StIcon.vue';

defineOptions({ name: 'StAvatar', inheritAttrs: false });

library.add(faUser);

const props = withDefaults(defineProps<StAvatarProps>(), {
  name: '',
  src: '',
  alt: '',
  size: 'medium',
  fit: 'cover',
  color: undefined,
  placeholderIcon: ST_AVATAR_PLACEHOLDER_ICON,
  className: ''
});

const attrs = useAttrs();

const hasImageError = ref(false);

watch(
  () => props.src,
  () => {
    hasImageError.value = false;
  }
);

const initials = computed(() => resolveAvatarInitials(props.name));

const content = computed(() =>
  resolveAvatarContent({
    src: props.src,
    name: props.name,
    hasImageError: hasImageError.value
  })
);

const color = computed(() => props.color ?? resolveAvatarColor(props.name));

const iconSize = computed(() => resolveAvatarIconSize(props.size));

const classes = computed(() =>
  buildAvatarClasses({
    size: props.size,
    fit: props.fit,
    color: color.value,
    content: content.value,
    className: props.className
  })
);

const containerClass = computed(() =>
  normalizeClass([classes.value.container, attrs.class])
);

const containerStyle = computed(() => attrs.style);

const containerAttrs = computed(() => {
  const next: Record<string, unknown> = { ...attrs };
  delete next.class;
  delete next.style;
  return next;
});

const isImage = computed(() => content.value === 'image');

const imageAlt = computed(() => props.alt || props.name || '');

const ariaLabel = computed(() => props.alt || props.name || undefined);

const onImageError = () => {
  hasImageError.value = true;
};
</script>

<template>
  <span
    :class="containerClass"
    :style="containerStyle"
    :role="isImage ? undefined : 'img'"
    :aria-label="isImage ? undefined : ariaLabel"
    :data-st-avatar-content="content"
    v-bind="containerAttrs"
  >
    <img
      v-if="isImage"
      :class="classes.image"
      :src="props.src"
      :alt="imageAlt"
      @error="onImageError"
    />

    <span
      v-else-if="content === 'initials'"
      :class="classes.initials"
      aria-hidden="true"
    >
      {{ initials }}
    </span>

    <StIcon
      v-else
      :name="props.placeholderIcon"
      :size="iconSize"
      aria-hidden="true"
    />
  </span>
</template>
