<script setup lang="ts">
import { computed, useSlots } from 'vue';

import type {
  FontFamily,
  FontSize,
  FontWeight,
  LetterSpacing,
  LineHeight,
  TextAlign,
  TypographyElement,
  TypographyVariant
} from './StTypography.interface';
import { buildTypographyClasses } from './styleStTypography';
import { splitTextIntoLines } from '../../utils/splitTextIntoLines';

const slots = useSlots();

const props = withDefaults(
  defineProps<{
    variant?: TypographyVariant;
    as?: TypographyElement;
    lines?: number;
    size?: FontSize;
    weight?: FontWeight;
    family?: FontFamily;
    lineHeight?: LineHeight;
    letterSpacing?: LetterSpacing;
    align?: TextAlign;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    uppercase?: boolean;
    lowercase?: boolean;
    capitalize?: boolean;
    truncate?: boolean;
    maxLines?: number;
    className?: string;
  }>(),
  {
    variant: 'body-medium',
    as: 'p',
    italic: false,
    underline: false,
    strikethrough: false,
    uppercase: false,
    lowercase: false,
    capitalize: false,
    truncate: false,
    className: ''
  }
);

const classes = computed(() => buildTypographyClasses(props));

const shouldColorLastLine = computed(
  () => props.variant === 'hero-title' && (props.lines ?? 0) > 1
);

const renderedLines = computed(() => {
  const lineCount = props.lines;
  if (!lineCount || lineCount <= 1) return null;

  const nodes = slots.default?.() ?? [];
  if (nodes.length !== 1) return null;

  const child = nodes[0]?.children;
  if (typeof child !== 'string') return null;

  const parts = splitTextIntoLines(child, lineCount);
  if (parts.length <= 1) return null;

  return parts;
});
</script>

<template>
  <component :is="props.as" :class="classes.base" v-bind="$attrs">
    <template v-if="renderedLines">
      <template v-for="(line, idx) in renderedLines" :key="idx">
        <span
          :class="
            idx === renderedLines.length - 1 && shouldColorLastLine
              ? classes.heroTitleEffectClasses
              : undefined
          "
        >
          {{ line }}
        </span>
        <br v-if="idx < renderedLines.length - 1" />
      </template>
    </template>
    <slot v-else />
  </component>
</template>
