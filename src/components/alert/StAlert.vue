<script setup lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCircleCheck,
  faCircleInfo,
  faCircleXmark,
  faGear,
  faTriangleExclamation,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import { computed, normalizeClass, ref, useAttrs, useSlots, watch } from 'vue';

import type { StAlertProps } from './StAlert.interface';
import {
  buildAlertClasses,
  resolveAlertIcon,
  resolveAlertRole,
  ST_ALERT_DEFAULT_STATUS
} from './styleStAlert';
import StIcon from '../icon/StIcon.vue';

defineOptions({ name: 'StAlert', inheritAttrs: false });

library.add(
  faCircleCheck,
  faCircleInfo,
  faCircleXmark,
  faGear,
  faTriangleExclamation,
  faXmark
);

const props = withDefaults(defineProps<StAlertProps>(), {
  title: '',
  description: '',
  status: ST_ALERT_DEFAULT_STATUS,
  icon: undefined,
  hideIcon: false,
  closable: false,
  closeAriaLabel: 'Fechar alerta',
  open: undefined,
  width: 'full',
  className: ''
});

const emit = defineEmits<{
  close: [];
  'update:open': [value: boolean];
}>();

defineSlots<{
  default?: () => unknown;
  action?: () => unknown;
}>();

const attrs = useAttrs();
const slots = useSlots();

const internalOpen = ref(props.open ?? true);

watch(
  () => props.open,
  (value) => {
    if (value !== undefined) internalOpen.value = value;
  }
);

const isOpen = computed(() => props.open ?? internalOpen.value);

const classes = computed(() =>
  buildAlertClasses({
    status: props.status,
    width: props.width,
    hasTitle: Boolean(props.title),
    className: props.className
  })
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

const statusIcon = computed(() => props.icon ?? resolveAlertIcon(props.status));

const role = computed(() => resolveAlertRole(props.status));

const hasTitle = computed(() => Boolean(props.title));

const hasDescription = computed(() => Boolean(props.description));

const hasAction = computed(() => Boolean(slots.action));

const onClose = () => {
  internalOpen.value = false;
  emit('update:open', false);
  emit('close');
};
</script>

<template>
  <div
    v-if="isOpen"
    :class="containerClass"
    :style="containerStyle"
    :role="role"
    :data-st-alert-status="props.status"
    v-bind="containerAttrs"
  >
    <StIcon
      v-if="!props.hideIcon"
      :name="statusIcon"
      :size="3"
      :class="classes.icon"
      aria-hidden="true"
      data-st-alert-icon
    />

    <div :class="classes.texts">
      <span v-if="hasTitle" :class="classes.title" data-st-alert-title>
        {{ props.title }}
      </span>

      <span
        v-if="hasDescription"
        :class="classes.description"
        data-st-alert-description
      >
        {{ props.description }}
      </span>

      <slot />

      <div v-if="hasAction" class="mt-st-1 flex items-center gap-st-1">
        <slot name="action" />
      </div>
    </div>

    <button
      v-if="props.closable"
      type="button"
      :class="classes.close"
      :aria-label="props.closeAriaLabel"
      data-st-alert-close
      @click="onClose"
    >
      <StIcon name="xmark" :size="3" aria-hidden="true" />
    </button>
  </div>
</template>
