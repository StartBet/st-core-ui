<script setup lang="ts">
import { computed } from 'vue';

import type {
  PaperBorder,
  PaperBorderRadius,
  PaperElevation,
  PaperVariant,
  SizeValue
} from './StPaper.interface';
import { buildPaperClasses, buildPaperStyle } from './styleStPaper';

const props = withDefaults(
  defineProps<{
    variant?: PaperVariant;
    border?: PaperBorder;
    borderRadius?: PaperBorderRadius;
    elevation?: PaperElevation;
    interactive?: boolean;
    bgImage?: string;
    width?: SizeValue;
    height?: SizeValue;
    padding?: string;
    paddingSm?: string;
    paddingMd?: string;
    paddingLg?: string;
    margin?: string;
    marginSm?: string;
    marginMd?: string;
    marginLg?: string;
    className?: string;
    as?: string;
  }>(),
  {
    variant: 'surface-1',
    border: 'none',
    borderRadius: '1',
    elevation: 1,
    interactive: false,
    className: '',
    as: 'div'
  }
);

const paperClasses = computed(() => buildPaperClasses(props));
const paperStyle = computed(() => buildPaperStyle(props));
</script>

<template>
  <component
    :is="props.as"
    :class="paperClasses"
    :style="paperStyle"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>
