<script setup lang="ts">
import { computed, useSlots } from 'vue';

import StIcon from '../../icon/StIcon.vue';
import type { StIconSize } from '../../icon/StIcon.interface';
import type {
  ButtonColor,
  ButtonSize,
  ButtonVariant
} from './StButton.interface';
import { buildButtonClasses } from './styleStButton';

const slots = useSlots();

const iconSizes: Record<ButtonSize, StIconSize> = {
  small: 2,
  medium: 3,
  large: 4
};

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
const iconSize = computed(() => iconSizes[props.size]);

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
      <StIcon
        v-if="props.iconLeft"
        :name="props.iconLeft"
        :size="iconSize"
        :aria-label="iconAriaLabel || 'icon-left'"
      />

      <slot v-if="hasDefaultSlot" />

      <StIcon
        v-if="props.iconRight"
        :name="props.iconRight"
        :size="iconSize"
        :aria-label="iconAriaLabel || 'icon-right'"
      />
    </span>
    <span v-if="hasEndAdornment" class="mr-st-2 inline-flex">
      <slot name="endAdornment" />
    </span>
  </button>
</template>
