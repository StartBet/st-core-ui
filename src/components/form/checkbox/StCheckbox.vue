<script setup lang="ts">
import { computed, ref, useAttrs, useSlots } from 'vue';

import type { StCheckboxProps } from './StCheckbox.interface';
import { buildCheckboxClasses } from './styleStCheckbox';

defineOptions({ name: 'StCheckbox', inheritAttrs: false });

const props = withDefaults(defineProps<StCheckboxProps>(), {
  checked: undefined,
  defaultChecked: undefined,
  disabled: false,
  label: undefined,
  className: ''
});

const emit = defineEmits<{
  'update:checked': [checked: boolean];
  change: [event: Event];
}>();

const attrs = useAttrs();
const slots = useSlots();

const isControlled = computed(() => props.checked !== undefined);
const internalChecked = ref<boolean>(props.defaultChecked ?? false);

const checkedValue = computed(() =>
  isControlled.value ? Boolean(props.checked) : internalChecked.value
);

const hasLabel = computed(() => {
  const slotNodes = slots.default?.() ?? [];
  const slotHasContent = slotNodes.length > 0;
  const propHasContent =
    props.label !== undefined && String(props.label).length > 0;

  return slotHasContent || propHasContent;
});

const classes = computed(() => buildCheckboxClasses(props));
const wrapperClass = computed(() =>
  [classes.value.wrapper, attrs.class].filter(Boolean).join(' ')
);
const wrapperStyle = computed(() => attrs.style);

const inputAttrs = computed(() => {
  const next: Record<string, unknown> = { ...attrs };
  delete next.class;
  delete next.style;
  return next;
});

const handleChange = (event: Event) => {
  const target = event.target instanceof HTMLInputElement ? event.target : null;
  const nextChecked = target ? target.checked : !checkedValue.value;

  if (!isControlled.value) internalChecked.value = nextChecked;

  emit('update:checked', nextChecked);
  emit('change', event);
};
</script>

<template>
  <label :class="wrapperClass" :style="wrapperStyle">
    <input
      type="checkbox"
      :class="classes.input"
      :disabled="props.disabled"
      :checked="checkedValue"
      v-bind="inputAttrs"
      @change="handleChange"
    />
    <span :class="classes.control" aria-hidden="true">
      <span :class="classes.mark" />
    </span>
    <span v-if="hasLabel" :class="classes.label">
      <slot>{{ props.label }}</slot>
    </span>
  </label>
</template>
