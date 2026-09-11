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
import { computed, normalizeClass, useAttrs, useSlots } from 'vue';

import type { StToastProps } from './StToast.interface';
import {
  buildToastClasses,
  resolveToastIcon,
  resolveToastRole,
  ST_TOAST_DEFAULT_STATUS
} from './styleStToast';
import StIcon from '../../icon/StIcon.vue';

defineOptions({ name: 'StToast', inheritAttrs: false });

library.add(
  faCircleCheck,
  faCircleInfo,
  faCircleXmark,
  faGear,
  faTriangleExclamation,
  faXmark
);

const props = withDefaults(defineProps<StToastProps>(), {
  title: '',
  description: '',
  status: ST_TOAST_DEFAULT_STATUS,
  icon: undefined,
  hideIcon: false,
  closable: true,
  closeAriaLabel: 'Fechar aviso',
  className: ''
});

const emit = defineEmits<{ close: [] }>();

defineSlots<{
  default?: () => unknown;
  action?: () => unknown;
}>();

const attrs = useAttrs();
const slots = useSlots();

const classes = computed(() =>
  buildToastClasses({ status: props.status, className: props.className })
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

const statusIcon = computed(() => props.icon ?? resolveToastIcon(props.status));

const semantics = computed(() => resolveToastRole(props.status));

const hasDescription = computed(() => Boolean(props.description));

const hasAction = computed(() => Boolean(slots.action));
</script>

<template>
  <div
    :class="containerClass"
    :style="containerStyle"
    :role="semantics.role"
    :aria-live="semantics.ariaLive"
    :data-st-toast-status="props.status"
    v-bind="containerAttrs"
  >
    <StIcon
      v-if="!props.hideIcon"
      :name="statusIcon"
      :size="3"
      :class="classes.icon"
      aria-hidden="true"
      data-st-toast-icon
    />

    <div :class="classes.texts">
      <span :class="classes.title">{{ props.title }}</span>

      <span
        v-if="hasDescription"
        :class="classes.description"
        data-st-toast-description
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
      data-st-toast-close
      @click="emit('close')"
    >
      <StIcon name="xmark" :size="3" aria-hidden="true" />
    </button>
  </div>
</template>
