<script setup lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import {
  computed,
  inject,
  normalizeClass,
  ref,
  useAttrs,
  useId,
  useSlots
} from 'vue';

import type { StAccordionProps } from './StAccordion.interface';
import {
  buildAccordionClasses,
  resolveAccordionIconSize,
  ST_ACCORDION_DEFAULT_CONTENT_SURFACE,
  ST_ACCORDION_DEFAULT_HEADER_SURFACE,
  ST_ACCORDION_EXPAND_ICON,
  stAccordionContextKey
} from './styleStAccordion';
import StIcon from '../../icon/StIcon.vue';

defineOptions({ name: 'StAccordion', inheritAttrs: false });

library.add(faChevronDown);

const props = withDefaults(defineProps<StAccordionProps>(), {
  title: '',
  icon: undefined,
  value: undefined,
  modelValue: undefined,
  defaultOpen: false,
  disabled: false,
  size: undefined,
  headerSurface: undefined,
  contentSurface: undefined,
  expandIcon: ST_ACCORDION_EXPAND_ICON,
  hideExpandIcon: false,
  className: '',
  headerClassName: '',
  contentClassName: ''
});

const emit = defineEmits<{
  'update:modelValue': [open: boolean];
  toggle: [open: boolean];
}>();

defineSlots<{
  title?: () => unknown;
  icon?: () => unknown;
  endAdornment?: () => unknown;
  default?: () => unknown;
}>();

const attrs = useAttrs();
const slots = useSlots();

const group = inject(stAccordionContextKey, null);

const generatedId = useId();
const headerId = `${generatedId}-header`;
const titleId = `${generatedId}-title`;
const regionId = `${generatedId}-region`;

const itemValue = computed(() => props.value ?? generatedId);

const isControlled = computed(() => props.modelValue !== undefined);

const internalOpen = ref(props.defaultOpen);

/** Controlado pela prop, senao pelo grupo, senao pelo estado interno. */
const isOpen = computed(() => {
  if (isControlled.value) return Boolean(props.modelValue);
  if (group) return group.isOpen(itemValue.value);

  return internalOpen.value;
});

const size = computed(() => props.size ?? group?.size ?? 'medium');

const headerSurface = computed(
  () =>
    props.headerSurface ??
    group?.headerSurface ??
    ST_ACCORDION_DEFAULT_HEADER_SURFACE
);

const contentSurface = computed(
  () =>
    props.contentSurface ??
    group?.contentSurface ??
    ST_ACCORDION_DEFAULT_CONTENT_SURFACE
);

const isDisabled = computed(() => props.disabled || Boolean(group?.disabled));

const iconSize = computed(() => resolveAccordionIconSize(size.value));

const hasEndAdornment = computed(() => Boolean(slots.endAdornment));

const classes = computed(() =>
  buildAccordionClasses({
    size: size.value,
    headerSurface: headerSurface.value,
    contentSurface: contentSurface.value,
    open: isOpen.value,
    disabled: isDisabled.value,
    className: props.className,
    headerClassName: props.headerClassName,
    contentClassName: props.contentClassName
  })
);

const rootClass = computed(() =>
  normalizeClass([classes.value.root, attrs.class])
);

const rootStyle = computed(() => attrs.style);

const rootAttrs = computed(() => {
  const next: Record<string, unknown> = { ...attrs };
  delete next.class;
  delete next.style;
  return next;
});

const toggle = () => {
  if (isDisabled.value) return;

  const next = !isOpen.value;

  if (!isControlled.value) {
    if (group) group.toggle(itemValue.value);
    else internalOpen.value = next;
  }

  emit('update:modelValue', next);
  emit('toggle', next);
};

/**
 * Registrado ainda no setup, antes do primeiro render: dentro de um grupo o
 * item com `defaultOpen` ja nasce aberto, sem piscar fechado nem animar na
 * montagem. Em modo unico, vence o primeiro item na ordem do template.
 */
if (group && !isControlled.value && props.defaultOpen) {
  group.requestDefaultOpen(itemValue.value);
}

defineExpose({ isOpen, toggle });
</script>

<template>
  <div
    :class="rootClass"
    :style="rootStyle"
    :data-st-accordion-open="isOpen"
    v-bind="rootAttrs"
  >
    <div :class="classes.header" data-st-accordion-header>
      <button
        :id="headerId"
        type="button"
        :class="classes.trigger"
        :disabled="isDisabled"
        :aria-expanded="isOpen"
        :aria-controls="regionId"
        :aria-labelledby="titleId"
        @click="toggle"
      />

      <StIcon
        v-if="props.icon && !slots.icon"
        :name="props.icon"
        :size="iconSize"
        :class="classes.icon"
        aria-hidden="true"
      />
      <span v-else-if="slots.icon" :class="classes.icon">
        <slot name="icon" />
      </span>

      <span :id="titleId" :class="classes.title">
        <slot name="title">{{ props.title }}</slot>
      </span>

      <div v-if="hasEndAdornment" :class="classes.adornment">
        <slot name="endAdornment" />
      </div>

      <StIcon
        v-if="!props.hideExpandIcon"
        :name="props.expandIcon"
        :size="iconSize"
        :class="classes.expandIcon"
        aria-hidden="true"
        data-st-accordion-expand-icon
      />
    </div>

    <div
      :id="regionId"
      role="region"
      :class="classes.region"
      :aria-labelledby="headerId"
      :inert="!isOpen || undefined"
      data-st-accordion-region
    >
      <div :class="classes.regionInner">
        <div :class="classes.content">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
