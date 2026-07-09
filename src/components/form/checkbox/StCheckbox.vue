<script setup lang="ts">
import { computed } from 'vue';

import { useCheckableControl } from '../../../composables/useCheckableControl';
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

const { attrs, checkedValue, hasLabel, inputAttrs, handleChange } =
  useCheckableControl(props, {
    updateChecked: (checked) => emit('update:checked', checked),
    change: (event) => emit('change', event)
  });

const classes = computed(() => buildCheckboxClasses(props));
const wrapperClass = computed(() =>
  [classes.value.wrapper, attrs.class].filter(Boolean).join(' ')
);
const wrapperStyle = computed(() => attrs.style);
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
