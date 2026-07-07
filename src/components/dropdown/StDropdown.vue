<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue';
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from 'vue';

import type { DropdownProps } from './StDropdown.interface';
import {
  buildDropdownClasses,
  calculateDropdownPosition
} from './styleStDropdown';

const props = withDefaults(defineProps<DropdownProps>(), {
  placement: 'auto',
  width: 'auto',
  offset: 8,
  open: undefined,
  defaultOpen: false,
  closeOnOutsideClick: true,
  triggerAsChild: false,
  className: '',
  panelClassName: ''
});

const emit = defineEmits<{
  'update:open': [open: boolean];
  'open-change': [open: boolean];
}>();

const rootRef = ref<HTMLDivElement | null>(null);
const triggerRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLDialogElement | null>(null);

const internalOpen = ref<boolean>(props.defaultOpen);
const isControlled = computed(() => props.open !== undefined);
const isOpen = computed(() =>
  isControlled.value ? Boolean(props.open) : internalOpen.value
);
const isBrowser =
  globalThis.window !== undefined && globalThis.document !== undefined;

const position = ref({ top: 0, left: 0 });
const triggerWidth = ref<number | undefined>(undefined);

const classes = computed(() => buildDropdownClasses(props));

const resolveElement = (ref: Element | ComponentPublicInstance | null) => {
  if (ref instanceof HTMLElement) return ref;
  if (ref instanceof Element) return ref as HTMLElement;

  const maybeEl = (ref as ComponentPublicInstance | null)?.$el;

  if (maybeEl instanceof HTMLElement) return maybeEl;
  if (maybeEl instanceof Element) return maybeEl as HTMLElement;

  return null;
};

const setTriggerEl = (ref: Element | ComponentPublicInstance | null) => {
  triggerRef.value = resolveElement(ref);
};

const setOpen = (next: boolean) => {
  if (!isControlled.value) internalOpen.value = next;

  if (typeof props.onOpenChange === 'function') {
    Reflect.apply(props.onOpenChange, undefined, [next]);
  }
  emit('open-change', next);
  emit('update:open', next);
};

const toggle = () => setOpen(!isOpen.value);

const updatePosition = () => {
  if (!isBrowser) return;

  const triggerEl = triggerRef.value;
  const panelEl = panelRef.value;

  if (!triggerEl || !panelEl) return;

  const triggerRect = triggerEl.getBoundingClientRect();
  const panelRect = panelEl.getBoundingClientRect();

  position.value = calculateDropdownPosition({
    placement: props.placement,
    triggerRect,
    panelRect,
    offset: props.offset
  });

  triggerWidth.value = triggerRect.width;
};

const onDocumentPointerDown = (event: MouseEvent) => {
  if (isOpen.value && props.closeOnOutsideClick) {
    const target = event.target as Node;
    const root = rootRef.value;
    const panel = panelRef.value;

    if (root?.contains(target) || panel?.contains(target)) return;

    setOpen(false);
  }
};

const onDocumentKeydown = (event: KeyboardEvent) => {
  if (isOpen.value && event.key === 'Escape') {
    setOpen(false);
  }
};

const onReposition = () => updatePosition();

let resizeObserver: ResizeObserver | undefined;

watch(
  () => [isOpen.value, props.width, props.placement, props.offset] as const,
  async ([open]) => {
    if (!open) return;

    await nextTick();
    updatePosition();
  }
);

watch(
  () => isOpen.value,
  async (open) => {
    if (!isBrowser) return;

    window.removeEventListener('resize', onReposition);
    window.removeEventListener('scroll', onReposition, true);
    document.removeEventListener('mousedown', onDocumentPointerDown);
    document.removeEventListener('keydown', onDocumentKeydown);
    resizeObserver?.disconnect();
    resizeObserver = undefined;

    if (!open) {
      triggerWidth.value = undefined;
      return;
    }

    await nextTick();
    updatePosition();

    window.addEventListener('resize', onReposition);
    window.addEventListener('scroll', onReposition, true);
    document.addEventListener('mousedown', onDocumentPointerDown);
    document.addEventListener('keydown', onDocumentKeydown);

    const panelEl = panelRef.value;
    const triggerEl = triggerRef.value;

    if (panelEl && triggerEl && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => updatePosition());
      resizeObserver.observe(panelEl);
      resizeObserver.observe(triggerEl);
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (isOpen.value) updatePosition();
});

onBeforeUnmount(() => {
  if (!isBrowser) return;

  window.removeEventListener('resize', onReposition);
  window.removeEventListener('scroll', onReposition, true);
  document.removeEventListener('mousedown', onDocumentPointerDown);
  document.removeEventListener('keydown', onDocumentKeydown);
  resizeObserver?.disconnect();
});

const panelStyle = computed<Record<string, string | number>>(() => {
  const style: Record<string, string | number> = {
    top: `${position.value.top}px`,
    left: `${position.value.left}px`
  };

  if (props.width === 'full' && typeof triggerWidth.value === 'number') {
    style.width = `${triggerWidth.value}px`;
  }

  return style;
});

const triggerAria = computed(() => ({
  'aria-haspopup': 'dialog' as const,
  'aria-expanded': isOpen.value
}));
</script>

<template>
  <div ref="rootRef" :class="classes.root">
    <template v-if="props.triggerAsChild">
      <slot
        name="trigger"
        :open="isOpen"
        :toggle="toggle"
        :setTriggerEl="setTriggerEl"
        :attrs="triggerAria"
      />
    </template>
    <button
      v-else
      :ref="setTriggerEl"
      type="button"
      :class="classes.trigger"
      v-bind="triggerAria"
      @click="toggle"
    >
      <slot
        name="trigger"
        :open="isOpen"
        :toggle="toggle"
        :setTriggerEl="setTriggerEl"
        :attrs="triggerAria"
      />
    </button>

    <dialog
      v-if="isOpen"
      ref="panelRef"
      :class="classes.panel"
      :style="panelStyle"
      open
    >
      <slot />
    </dialog>
  </div>
</template>
