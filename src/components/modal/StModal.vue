<script setup lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import type { ComponentPublicInstance } from 'vue';
import { computed, nextTick, onBeforeUnmount, ref, useAttrs, watch } from 'vue';

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
const dialogRef = ref<ComponentPublicInstance | HTMLElement | null>(null);
const previousActiveElement = ref<HTMLElement | null>(null);
const originalBodyOverflow = ref<string | null>(null);

const focusableSelector = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(', ');

const resolveDialogElement = () => {
  const element = dialogRef.value;

  if (element instanceof HTMLElement) return element;

  const maybeEl = element?.$el;

  return maybeEl instanceof HTMLElement ? maybeEl : null;
};

const getFocusableElements = () => {
  const dialogEl = resolveDialogElement();

  if (!dialogEl) return [];

  return Array.from(
    dialogEl.querySelectorAll<HTMLElement>(focusableSelector)
  ).filter(
    (element) =>
      !element.hasAttribute('disabled') &&
      element.getAttribute('aria-hidden') !== 'true'
  );
};

const focusInitialElement = () => {
  const dialogEl = resolveDialogElement();

  if (!dialogEl) return;

  const firstFocusable = getFocusableElements()[0];

  if (firstFocusable) {
    firstFocusable.focus();
    return;
  }

  dialogEl.focus();
};

const restoreFocus = () => {
  previousActiveElement.value?.focus();
  previousActiveElement.value = null;
};

const lockBodyScroll = () => {
  if (globalThis.document === undefined) return;

  if (originalBodyOverflow.value === null) {
    originalBodyOverflow.value = globalThis.document.body.style.overflow;
  }

  globalThis.document.body.style.overflow = 'hidden';
};

const unlockBodyScroll = () => {
  if (globalThis.document === undefined) return;

  globalThis.document.body.style.overflow = originalBodyOverflow.value ?? '';
  originalBodyOverflow.value = null;
};

const close = () => {
  emit('update:open', false);
  emit('close');
};

const handleOverlayClick = () => {
  if (!props.closeOnOutsideClick) return;
  close();
};

const handleKeydown = (event: KeyboardEvent) => {
  if (!props.open) return;

  if (event.key === 'Escape') {
    close();
    return;
  }

  if (event.key !== 'Tab') return;

  const dialogEl = resolveDialogElement();

  if (!dialogEl) return;

  const focusableElements = getFocusableElements();

  if (focusableElements.length === 0) {
    event.preventDefault();
    dialogEl.focus();
    return;
  }

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  const activeElement = globalThis.document?.activeElement;

  if (event.shiftKey) {
    if (activeElement === firstFocusable || activeElement === dialogEl) {
      event.preventDefault();
      lastFocusable.focus();
    }

    return;
  }

  if (activeElement === lastFocusable || !dialogEl.contains(activeElement)) {
    event.preventDefault();
    firstFocusable.focus();
  }
};

watch(
  () => props.open,
  async (isOpen, wasOpen) => {
    if (globalThis.window === undefined) return;

    globalThis.window.removeEventListener('keydown', handleKeydown);

    if (isOpen) {
      if (!wasOpen) {
        const activeElement = globalThis.document?.activeElement;

        previousActiveElement.value =
          activeElement instanceof HTMLElement ? activeElement : null;
      }

      lockBodyScroll();

      await nextTick();
      focusInitialElement();
      globalThis.window.addEventListener('keydown', handleKeydown);
      return;
    }

    unlockBodyScroll();
    restoreFocus();
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  if (globalThis.window === undefined) return;
  globalThis.window.removeEventListener('keydown', handleKeydown);
  unlockBodyScroll();
  restoreFocus();
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
        ref="dialogRef"
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
        tabindex="-1"
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
