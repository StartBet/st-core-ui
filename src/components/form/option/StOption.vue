<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue';

import type { StOptionProps } from './StOption.interface';
import { buildOptionClasses } from './styleStOption';

defineOptions({ name: 'StOption', inheritAttrs: false });

const props = withDefaults(defineProps<StOptionProps>(), {
  value: undefined,
  selected: false,
  className: '',
  onClick: undefined
});

const attrs = useAttrs();
const slots = useSlots();

const hasStartAdornment = computed(
  () => (slots.startAdornment?.() ?? []).length > 0
);
const hasEndAdornment = computed(
  () => (slots.endAdornment?.() ?? []).length > 0
);

const classes = computed(() => buildOptionClasses(props));

const filteredAttrs = computed(() => {
  const next: Record<string, unknown> = { ...attrs };
  delete next.onKeydown;
  delete next.onKeyDown;
  return next;
});

const activate = () => {
  props.onClick?.();
};
</script>

<template>
  <button
    type="button"
    :class="classes.option"
    :data-value="props.value"
    :aria-pressed="props.selected ? 'true' : undefined"
    v-bind="filteredAttrs"
    @click="activate"
  >
    <span v-if="hasStartAdornment" :class="classes.startAdornment">
      <slot name="startAdornment" />
    </span>
    <span :class="classes.content">
      <slot />
    </span>
    <span v-if="hasEndAdornment" :class="classes.endAdornment">
      <slot name="endAdornment" />
    </span>
  </button>
</template>
