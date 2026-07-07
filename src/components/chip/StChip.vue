<script setup lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { computed, useAttrs } from 'vue';

import StIcon from '../icon/StIcon.vue';
import type { StChipVariant } from './StChip.interface';
import { buildChipClasses } from './styleStChip';

library.add(faXmark);

const props = withDefaults(
  defineProps<{
    variant?: StChipVariant;
    clickable?: boolean;
    closable?: boolean;
    onClose?: () => void;
    className?: string;
  }>(),
  {
    variant: 'primary',
    clickable: false,
    closable: false,
    className: ''
  }
);

const emit = defineEmits<{
  click: [event: MouseEvent | KeyboardEvent];
}>();

const attrs = useAttrs();
const classes = computed(() => buildChipClasses(props));

const filteredAttrs = computed(() => {
  const next: Record<string, unknown> = { ...attrs };
  delete next.onClick;
  delete next.onKeydown;
  delete next.onKeyDown;
  return next;
});

const handleClick = (event: MouseEvent) => {
  if (!props.clickable) return;
  emit('click', event);
};

const handleKeydown = (event: KeyboardEvent) => {
  if (!props.clickable) return;
  if (event.key !== 'Enter' && event.key !== ' ') return;

  event.preventDefault();
  emit('click', event);
};

const handleClose = () => {
  props.onClose?.();
};
</script>

<template>
  <div
    :class="classes.container"
    :role="props.clickable ? 'button' : undefined"
    :tabindex="props.clickable ? 0 : undefined"
    @click="handleClick"
    @keydown="handleKeydown"
    v-bind="filteredAttrs"
  >
    <span><slot /></span>
    <button
      v-if="props.closable"
      type="button"
      :class="classes.closeButton"
      aria-label="Close"
      @click.stop="handleClose"
    >
      <StIcon name="xmark" :size="1" aria-label="close-icon" />
    </button>
  </div>
</template>
