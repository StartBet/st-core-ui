<script setup lang="ts">
import { computed } from 'vue';

import type {
  StLoadingProps,
  StLoadingSize,
  StLoadingVariant
} from './StLoading.interface';
import { buildStLoadingClasses } from './styleStLoading';

defineOptions({ name: 'StLoading' });

const props = withDefaults(defineProps<StLoadingProps>(), {
  type: 'arrow',
  variant: 'primary',
  size: '8',
  value: 0,
  className: ''
});

const classes = computed(() =>
  buildStLoadingClasses({
    type: props.type,
    variant: props.variant,
    size: props.size,
    className: props.className
  })
);

const arrowColorByVariant: Record<StLoadingVariant, string> = {
  primary: 'var(--st-color-secondary)',
  secondary: 'var(--st-color-primary)',
  tertiary: 'var(--st-color-content-bright)'
};

const animatedAccentColor = 'var(--st-color-content-bright)';

const backgroundColorByVariant: Record<StLoadingVariant, string> = {
  primary: 'var(--st-brand-primary-600)',
  secondary: 'var(--st-brand-secondary-500)',
  tertiary: 'var(--st-brand-primary-700)'
};

const showArrow = computed(() => props.size !== '3' || props.type === 'arrow');

const contentStyle = computed(() => ({
  backgroundColor: backgroundColorByVariant[props.variant]
}));

const accentStyle = computed(() => ({
  color: arrowColorByVariant[props.variant]
}));

const animatedAccentStyle = computed(() => ({
  color: animatedAccentColor
}));

const cyclicalValue = computed(() => {
  const raw = props.value ?? 0;
  if (raw < 0) return 0;
  if (raw > 100) return 100;
  return raw;
});

const cyclicalRadius = 46;
const cyclicalCircumference = 2 * Math.PI * cyclicalRadius;
const cyclicalOffset = computed(
  () => cyclicalCircumference * (1 - cyclicalValue.value / 100)
);

const viewBoxBySize: Record<StLoadingSize, string> = {
  '3': '0 0 24 24',
  '4': '0 0 24 24',
  '6': '0 0 24 24',
  '8': '0 0 24 24'
};
</script>

<template>
  <span
    :class="classes.content"
    :style="contentStyle"
    role="status"
    aria-busy="true"
    aria-live="polite"
  >
    <svg
      v-if="showArrow"
      :class="classes.arrow"
      :viewBox="viewBoxBySize[props.size]"
      :style="accentStyle"
      :data-variant="props.variant"
      data-loading-arrow
      aria-hidden="true"
    >
      <path fill="currentColor" d="M5 3h6.5L20 12l-8.5 9H5l8.5-9L5 3Z" />
    </svg>

    <span
      v-if="props.type === 'spinner'"
      :class="classes.spinner"
      :style="animatedAccentStyle"
      data-loading-spinner
      aria-hidden="true"
    />

    <svg
      v-else-if="props.type === 'cyclical'"
      :class="classes.cyclical"
      viewBox="0 0 100 100"
      data-loading-cyclical
      aria-hidden="true"
    >
      <circle
        cx="50"
        cy="50"
        :r="cyclicalRadius"
        fill="none"
        :stroke="animatedAccentColor"
        stroke-width="4"
        stroke-linecap="round"
        :stroke-dasharray="cyclicalCircumference"
        :stroke-dashoffset="cyclicalOffset"
        class="transition-[stroke-dashoffset] duration-200 ease-linear"
      />
    </svg>
  </span>
</template>
