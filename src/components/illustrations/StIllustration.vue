<script setup lang="ts">
import { computed, normalizeClass, useAttrs } from 'vue';

import type { StIllustrationProps } from './StIllustration.interface';
import {
  buildIllustrationSizeClasses,
  buildIllustrationSrc
} from './styleStIllustration';

defineOptions({ name: 'StIllustration', inheritAttrs: false });

const props = withDefaults(defineProps<StIllustrationProps>(), {
  width: undefined,
  height: undefined,
  className: ''
});

const attrs = useAttrs();

const src = computed(() => buildIllustrationSrc(props.name));
const sizeClasses = computed(() =>
  buildIllustrationSizeClasses(props.width, props.height)
);

const imgClass = computed(() =>
  normalizeClass([props.className, attrs.class, ...sizeClasses.value])
);

const imgStyle = computed(() => attrs.style);

const imgWidthAttr = computed(() => {
  if (props.width === undefined) return undefined;
  return /^\d+$/.test(props.width) ? props.width : undefined;
});

const imgHeightAttr = computed(() => {
  if (props.height === undefined) return undefined;
  return /^\d+$/.test(props.height) ? props.height : undefined;
});

const imgAttrs = computed(() => {
  const next: Record<string, unknown> = { ...attrs };
  delete next.class;
  delete next.style;
  return next;
});
</script>

<template>
  <img
    :src="src"
    :alt="props.alt"
    :width="imgWidthAttr"
    :height="imgHeightAttr"
    :class="imgClass"
    :style="imgStyle"
    v-bind="imgAttrs"
  />
</template>
