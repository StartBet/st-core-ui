<script setup lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { computed, onBeforeUnmount, useAttrs, watch } from 'vue';

import StButton from '../buttons/button/StButton.vue';
import StPaper from '../paper/StPaper.vue';
import type { StModalProps } from './StModal.interface';
import { buildStModalClasses } from './styleStModal';

library.add(faXmark);

defineOptions({ name: 'StModal', inheritAttrs: false });

const props = withDefaults(defineProps<StModalProps>(), {
  open: false,
  showCloseButton: false,
  closeOnOutsideClick: false,
  variant: 'surface-1',
  border: 'none',
  borderRadius: '1',
  elevation: 2,
  interactive: false,
  className: ''
});

const emit = defineEmits<{
  'update:open': [value: boolean];
  close: [];
}>();

const attrs = useAttrs();
const classes = computed(() => buildStModalClasses());

const close = () => {
  emit('update:open', false);
  emit('close');
};

const handleOverlayClick = () => {
  if (!props.closeOnOutsideClick) return;
  close();
};

const handleKeydown = (event: KeyboardEvent) => {
  if (!props.open || event.key !== 'Escape') return;
  close();
};

watch(
  () => props.open,
  (isOpen) => {
    if (globalThis.window === undefined) return;

    if (isOpen) {
      globalThis.window.addEventListener('keydown', handleKeydown);
      return;
    }

    globalThis.window.removeEventListener('keydown', handleKeydown);
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  if (globalThis.window === undefined) return;
  globalThis.window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="props.open"
      data-test="modal-overlay"
      :class="classes.overlay"
      @click.self="handleOverlayClick"
    >
      <StPaper
        :variant="props.variant"
        :border="props.border"
        :borderRadius="props.borderRadius"
        :elevation="props.elevation"
        :interactive="props.interactive"
        :bgImage="props.bgImage"
        :width="props.width"
        :height="props.height"
        :padding="props.padding"
        :paddingSm="props.paddingSm"
        :paddingMd="props.paddingMd"
        :paddingLg="props.paddingLg"
        :margin="props.margin"
        :marginSm="props.marginSm"
        :marginMd="props.marginMd"
        :marginLg="props.marginLg"
        :className="props.className"
        role="dialog"
        aria-modal="true"
        v-bind="attrs"
      >
        <StButton
          v-if="props.showCloseButton"
          variant="text"
          size="small"
          iconLeft="xmark"
          aria-label="Fechar modal"
          className="!absolute right-st-2 top-st-2 !min-w-0 px-st-2"
          @click="close"
        />
        <slot />
      </StPaper>
    </div>
  </Teleport>
</template>
