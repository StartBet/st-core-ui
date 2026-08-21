<script setup lang="ts">
import { computed, normalizeClass, useAttrs, useId } from 'vue';

import type { StProgressBarProps } from './StProgressBar.interface';
import {
  buildProgressBarClasses,
  clampProgressPercent,
  ST_PROGRESS_BAR_MAX_PERCENT,
  ST_PROGRESS_BAR_MIN_PERCENT
} from './styleStProgressBar';

defineOptions({ name: 'StProgressBar', inheritAttrs: false });

const props = withDefaults(defineProps<StProgressBarProps>(), {
  variant: 'primary',
  size: 'small',
  percent: 0,
  text: '',
  className: ''
});

const attrs = useAttrs();

const generatedId = useId();
const textId = computed(() => `${generatedId}-text`);

const percent = computed(() => clampProgressPercent(props.percent));
const hasText = computed(() => !!props.text);

const classes = computed(() =>
  buildProgressBarClasses({
    variant: props.variant,
    size: props.size,
    className: props.className
  })
);

const containerClass = computed(() =>
  normalizeClass([classes.value.container, attrs.class])
);

const containerStyle = computed(() => attrs.style);

const trackAttrs = computed(() => {
  const next: Record<string, unknown> = { ...attrs };
  delete next.class;
  delete next.style;
  return next;
});

const fillStyle = computed(() => ({ width: `${percent.value}%` }));
</script>

<template>
  <div :class="containerClass" :style="containerStyle">
    <div
      :class="classes.track"
      role="progressbar"
      :aria-valuenow="percent"
      :aria-valuemin="ST_PROGRESS_BAR_MIN_PERCENT"
      :aria-valuemax="ST_PROGRESS_BAR_MAX_PERCENT"
      :aria-describedby="hasText ? textId : undefined"
      v-bind="trackAttrs"
    >
      <div :class="classes.fill" :style="fillStyle" data-progress-fill />
    </div>

    <span v-if="hasText" :id="textId" :class="classes.text">
      {{ props.text }}
    </span>
  </div>
</template>
