<script setup lang="ts">
import { computed, normalizeClass, useAttrs } from 'vue';

import type { StAvatarGroupProps } from './StAvatarGroup.interface';
import {
  buildAvatarGroupClasses,
  clampAvatarGroupMax,
  resolveAvatarGroupOverflow,
  ST_AVATAR_GROUP_DEFAULT_MAX
} from './styleStAvatarGroup';
import StAvatar from '../avatar/StAvatar.vue';
import { ST_AVATAR_PLACEHOLDER_ICON } from '../avatar/styleStAvatar';

defineOptions({ name: 'StAvatarGroup', inheritAttrs: false });

const props = withDefaults(defineProps<StAvatarGroupProps>(), {
  avatars: () => [],
  max: ST_AVATAR_GROUP_DEFAULT_MAX,
  size: 'medium',
  fit: 'cover',
  placeholderIcon: ST_AVATAR_PLACEHOLDER_ICON,
  ariaLabel: 'Grupo de usuarios',
  overflowAriaLabel: undefined,
  className: '',
  avatarClassName: ''
});

const attrs = useAttrs();

const max = computed(() => clampAvatarGroupMax(props.max));

const visibleAvatars = computed(() => props.avatars.slice(0, max.value));

const overflowCount = computed(() =>
  resolveAvatarGroupOverflow(props.avatars.length, max.value)
);

const classes = computed(() =>
  buildAvatarGroupClasses({ size: props.size, className: props.className })
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

/** O primeiro avatar fica por cima; os seguintes descem no empilhamento. */
const stackStyle = (index: number) => ({
  zIndex: String(visibleAvatars.value.length - index)
});

const avatarClass = (index: number) =>
  normalizeClass([
    classes.value.item,
    index === 0 ? undefined : classes.value.overlap,
    props.avatarClassName
  ]);

const overflowLabel = computed(() =>
  props.overflowAriaLabel
    ? props.overflowAriaLabel(overflowCount.value)
    : `Mais ${overflowCount.value} usuarios`
);
</script>

<template>
  <div
    v-if="visibleAvatars.length > 0"
    :class="containerClass"
    :style="containerStyle"
    role="group"
    :aria-label="props.ariaLabel"
    v-bind="containerAttrs"
  >
    <StAvatar
      v-for="(avatar, index) in visibleAvatars"
      :key="`${avatar.name ?? ''}-${avatar.src ?? ''}-${index}`"
      :name="avatar.name"
      :src="avatar.src"
      :alt="avatar.alt"
      :color="avatar.color"
      :fit="avatar.fit ?? props.fit"
      :size="props.size"
      :placeholder-icon="props.placeholderIcon"
      :class="avatarClass(index)"
      :style="stackStyle(index)"
    />

    <span
      v-if="overflowCount > 0"
      :class="classes.overflow"
      role="img"
      :aria-label="overflowLabel"
      data-st-avatar-overflow
    >
      <span aria-hidden="true">+{{ overflowCount }}</span>
    </span>
  </div>
</template>
