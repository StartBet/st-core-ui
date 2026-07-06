<script setup lang="ts">
import { computed, useSlots } from 'vue';

import type {
  ButtonColor,
  ButtonSize,
  ButtonVariant
} from './StButton.interface';
import { buildButtonClasses } from './styleStButton';

const slots = useSlots();

defineSlots<{
  startAdornment?: () => unknown;
  default?: () => unknown;
  endAdornment?: () => unknown;
}>();

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant;
    size?: ButtonSize;
    color?: ButtonColor;
    fullWidth?: boolean;
    type?: 'button' | 'submit' | 'reset';
    value?: string | number;
    iconLeft?: string;
    iconRight?: string;
    disabled?: boolean;
    className?: string;
  }>(),
  {
    variant: 'solid',
    size: 'medium',
    color: 'primary',
    fullWidth: false,
    type: 'button',
    disabled: false,
    className: ''
  }
);

const hasSlotContent = (slot?: (() => unknown) | undefined) => {
  const nodes = (slot?.() as Array<{ children?: unknown }>) ?? [];

  return nodes.some((node) => {
    const children = node?.children;
    if (typeof children === 'string') return children.trim().length > 0;
    return true;
  });
};

const hasDefaultSlot = computed(() => hasSlotContent(slots.default));
const hasStartAdornment = computed(() => hasSlotContent(slots.startAdornment));
const hasEndAdornment = computed(() => hasSlotContent(slots.endAdornment));

const adornmentCount = computed(
  () =>
    Number(hasStartAdornment.value) +
    Number(Boolean(props.iconLeft)) +
    Number(hasEndAdornment.value) +
    Number(Boolean(props.iconRight))
);

const isIconOnly = computed(
  () => !hasDefaultSlot.value && adornmentCount.value === 1
);

const iconAriaLabel = computed(() => (isIconOnly.value ? 'icon' : undefined));

const classes = computed(() =>
  buildButtonClasses({ ...props, isIconOnly: isIconOnly.value })
);
</script>

<template>
  <button
    :type="props.type"
    :value="props.value"
    :disabled="props.disabled"
    :class="classes.container"
    v-bind="$attrs"
  >
    <span v-if="hasStartAdornment" class="ml-st-2 inline-flex">
      <slot name="startAdornment" />
    </span>
    <span :class="classes.content">
      <span
        v-if="props.iconLeft"
        :aria-label="iconAriaLabel || 'icon-left'"
        class="inline-flex leading-none"
      >
        {{ props.iconLeft }}
      </span>

      <slot v-if="hasDefaultSlot" />

      <span
        v-if="props.iconRight"
        :aria-label="iconAriaLabel || 'icon-right'"
        class="inline-flex leading-none"
      >
        {{ props.iconRight }}
      </span>
    </span>
    <span v-if="hasEndAdornment" class="mr-st-2 inline-flex">
      <slot name="endAdornment" />
    </span>
  </button>
</template>
