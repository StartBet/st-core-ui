<script setup lang="ts">
import { computed, normalizeClass, useAttrs } from 'vue';

import type { StToastContainerProps } from './StToastContainer.interface';
import {
  buildToastContainerClasses,
  ST_TOAST_DEFAULT_POSITION
} from './styleStToastContainer';
import StToast from '../toast/StToast.vue';
import { useToast } from '../../../composables/useToast';

defineOptions({ name: 'StToastContainer', inheritAttrs: false });

const props = withDefaults(defineProps<StToastContainerProps>(), {
  position: ST_TOAST_DEFAULT_POSITION,
  gap: 1,
  pauseOnHover: true,
  to: 'body',
  ariaLabel: 'Avisos da aplicacao',
  className: ''
});

const { toasts, dismiss, pause, resume } = useToast();

const attrs = useAttrs();

const classes = computed(() =>
  buildToastContainerClasses({
    position: props.position,
    gap: props.gap,
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

const onPointerEnter = () => {
  if (props.pauseOnHover) pause();
};

const onPointerLeave = () => {
  if (props.pauseOnHover) resume();
};
</script>

<template>
  <Teleport :to="props.to || 'body'" :disabled="!props.to">
    <div
      :class="containerClass"
      :style="containerStyle"
      role="region"
      :aria-label="props.ariaLabel"
      data-st-toast-container
      v-bind="containerAttrs"
      @mouseenter="onPointerEnter"
      @mouseleave="onPointerLeave"
      @focusin="onPointerEnter"
      @focusout="onPointerLeave"
    >
      <TransitionGroup
        :enter-active-class="classes.enterActive"
        :enter-from-class="classes.enterFrom"
        :leave-active-class="classes.leaveActive"
        :leave-to-class="classes.leaveTo"
        :move-class="classes.move"
      >
        <StToast
          v-for="entry in toasts"
          :key="entry.id"
          :class="classes.item"
          :title="entry.title"
          :description="entry.description"
          :status="entry.status"
          :icon="entry.icon"
          :hide-icon="entry.hideIcon"
          :closable="entry.closable ?? true"
          @close="dismiss(entry.id)"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>
