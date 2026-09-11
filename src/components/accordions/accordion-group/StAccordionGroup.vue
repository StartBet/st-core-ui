<script setup lang="ts">
import {
  computed,
  normalizeClass,
  provide,
  reactive,
  ref,
  useAttrs,
  watch
} from 'vue';

import type { StAccordionGroupProps } from './StAccordionGroup.interface';
import {
  buildAccordionGroupClasses,
  normalizeOpenValues,
  toggleOpenValue,
  toModelValue
} from './styleStAccordionGroup';
import type {
  StAccordionContext,
  StAccordionValue
} from '../accordion/StAccordion.interface';
import { stAccordionContextKey } from '../accordion/styleStAccordion';

defineOptions({ name: 'StAccordionGroup', inheritAttrs: false });

const props = withDefaults(defineProps<StAccordionGroupProps>(), {
  multiple: false,
  modelValue: undefined,
  size: undefined,
  headerSurface: undefined,
  contentSurface: undefined,
  disabled: false,
  gap: 1,
  ariaLabel: undefined,
  className: ''
});

const emit = defineEmits<{
  'update:modelValue': [value: ReturnType<typeof toModelValue>];
  change: [value: ReturnType<typeof toModelValue>];
}>();

defineSlots<{ default?: () => unknown }>();

const attrs = useAttrs();

const openValues = ref<StAccordionValue[]>(
  normalizeOpenValues(props.modelValue, props.multiple)
);

const isControlled = computed(() => props.modelValue !== undefined);

watch(
  () => props.modelValue,
  (value) => {
    openValues.value = normalizeOpenValues(value, props.multiple);
  }
);

/** Ao sair do modo multiplo, mantem apenas o primeiro item aberto. */
watch(
  () => props.multiple,
  (multiple) => {
    if (multiple || openValues.value.length <= 1) return;

    openValues.value = openValues.value.slice(0, 1);
  }
);

const commit = (values: StAccordionValue[]) => {
  openValues.value = values;

  const payload = toModelValue(values, props.multiple);

  emit('update:modelValue', payload);
  emit('change', payload);
};

const isOpen = (value: StAccordionValue) => openValues.value.includes(value);

const toggle = (value: StAccordionValue) => {
  if (props.disabled) return;

  commit(toggleOpenValue(openValues.value, value, props.multiple));
};

/** `defaultOpen` dos itens so vale quando o grupo nao esta controlado. */
const requestDefaultOpen = (value: StAccordionValue) => {
  if (isControlled.value || isOpen(value)) return;
  if (!props.multiple && openValues.value.length > 0) return;

  commit(props.multiple ? [...openValues.value, value] : [value]);
};

const collapseAll = () => commit([]);

const context = reactive<StAccordionContext>({
  multiple: props.multiple,
  size: props.size,
  headerSurface: props.headerSurface,
  contentSurface: props.contentSurface,
  disabled: props.disabled,
  isOpen,
  toggle,
  requestDefaultOpen
});

watch(
  () =>
    [
      props.multiple,
      props.size,
      props.headerSurface,
      props.contentSurface,
      props.disabled
    ] as const,
  ([multiple, size, headerSurface, contentSurface, disabled]) => {
    context.multiple = multiple;
    context.size = size;
    context.headerSurface = headerSurface;
    context.contentSurface = contentSurface;
    context.disabled = disabled;
  }
);

provide(stAccordionContextKey, context);

const classes = computed(() =>
  buildAccordionGroupClasses({ gap: props.gap, className: props.className })
);

const containerClass = computed(() =>
  normalizeClass([classes.value.container, attrs.class])
);

const containerStyle = computed(() => attrs.style);

const containerAttrs = computed(() => {
  const next: Record<string, unknown> = { ...attrs };
  delete next.class;
  delete next.style;
  return next;
});

defineExpose({ openValues, isOpen, toggle, collapseAll });
</script>

<template>
  <div
    :class="containerClass"
    :style="containerStyle"
    :aria-label="props.ariaLabel"
    :role="props.ariaLabel ? 'group' : undefined"
    v-bind="containerAttrs"
  >
    <slot />
  </div>
</template>
