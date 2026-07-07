<script setup lang="ts">
import { computed, inject, onMounted, ref, useAttrs, useSlots } from 'vue';

import type { StRadioProps } from './StRadio.interface';
import { buildRadioClasses } from './styleStRadio';
import { radioGroupContextKey } from '../radio-group/styleStRadioGroup';

defineOptions({ name: 'StRadio', inheritAttrs: false });

const props = withDefaults(defineProps<StRadioProps>(), {
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
const radioGroup = inject(radioGroupContextKey, null);

const didMount = ref(false);
onMounted(() => {
  didMount.value = true;
});

const isControlled = computed(() => props.checked !== undefined);

const attrValue = computed(() => {
  const value = attrs.value;
  if (typeof value === 'string' || typeof value === 'number')
    return String(value);
  return undefined;
});

const inputName = computed(() => {
  const name = attrs.name;
  if (typeof name === 'string' && name.length > 0) return name;
  return radioGroup?.name.value;
});

const isGroupChecked = computed(() => {
  if (!radioGroup) return undefined;
  if (attrValue.value === undefined) return undefined;
  return attrValue.value === radioGroup.value.value;
});

const inputDisabled = computed(
  () => props.disabled || Boolean(radioGroup?.disabled.value)
);

const inputChecked = computed<boolean | undefined>(() => {
  if (isControlled.value) return props.checked;
  if (isGroupChecked.value !== undefined) return isGroupChecked.value;
  if (didMount.value) return undefined;
  return props.defaultChecked;
});

const hasLabel = computed(() => {
  const slotNodes = slots.default?.() ?? [];
  const slotHasContent = slotNodes.length > 0;
  const propHasContent =
    props.label !== undefined && String(props.label).length > 0;
  return slotHasContent || propHasContent;
});

const classes = computed(() => buildRadioClasses(props));

const wrapperClass = computed(() =>
  [classes.value.wrapper, attrs.class].filter(Boolean).join(' ')
);
const wrapperStyle = computed(() => attrs.style);

const inputAttrs = computed(() => {
  const next: Record<string, unknown> = { ...attrs };
  delete next.class;
  delete next.style;
  delete next.name;
  delete next.disabled;
  return next;
});

const handleChange = (event: Event) => {
  const target = event.target instanceof HTMLInputElement ? event.target : null;
  const nextChecked = target ? target.checked : false;
  emit('update:checked', nextChecked);
  emit('change', event);
};
</script>

<template>
  <label :class="wrapperClass" :style="wrapperStyle">
    <input
      type="radio"
      :class="classes.input"
      v-bind="inputAttrs"
      :name="inputName"
      :disabled="inputDisabled"
      :checked="inputChecked"
      @change="handleChange"
    />
    <span :class="classes.control" aria-hidden="true">
      <span :class="classes.dot" />
    </span>
    <span v-if="hasLabel" :class="classes.label">
      <slot>{{ props.label }}</slot>
    </span>
  </label>
</template>
