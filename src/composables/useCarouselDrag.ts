import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue';

export type UseCarouselDragOptions = {
  enabled: MaybeRefOrGetter<boolean>;
  stepSize: MaybeRefOrGetter<number>;
  activationDistance?: number;
  onDragStart?: () => void;
  onDragEnd: (dragSlides: number) => void;
};

const DEFAULT_ACTIVATION_DISTANCE = 6;

export const useCarouselDrag = (options: UseCarouselDragOptions) => {
  const isPressed = ref(false);
  const isDragging = ref(false);
  const dragSlides = ref(0);

  const activationDistance =
    options.activationDistance ?? DEFAULT_ACTIVATION_DISTANCE;

  let pointerId: number | undefined;
  let startX = 0;
  let startY = 0;
  let hasMoved = false;
  let activeStepSize = 0;

  const isEnabled = computed(() => toValue(options.enabled));

  const resolveStepSize = () => {
    const size = Number(toValue(options.stepSize));

    return Number.isFinite(size) && size > 0 ? size : 0;
  };

  const clearSelection = () => {
    if (typeof window === 'undefined') return;

    const selection = window.getSelection?.();

    if (!selection || selection.isCollapsed) return;

    selection.removeAllRanges();
  };

  const reset = () => {
    isPressed.value = false;
    isDragging.value = false;
    dragSlides.value = 0;
    pointerId = undefined;
    activeStepSize = 0;
  };

  const onPointerdown = (event: PointerEvent) => {
    if (!isEnabled.value || event.button !== 0) return;

    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    hasMoved = false;
    isPressed.value = true;
    dragSlides.value = 0;
    activeStepSize = resolveStepSize();

    options.onDragStart?.();
  };

  const onPointermove = (event: PointerEvent) => {
    if (!isPressed.value || event.pointerId !== pointerId) return;

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    if (!isDragging.value) {
      const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);

      if (!isHorizontal || Math.abs(deltaX) < activationDistance) return;

      isDragging.value = true;

      clearSelection();

      const target = event.currentTarget as HTMLElement | null;

      if (target?.setPointerCapture && event.isPrimary) {
        try {
          target.setPointerCapture(event.pointerId);
        } catch {
          /* ponteiro ja liberado pelo navegador */
        }
      }
    }

    hasMoved = true;
    dragSlides.value = activeStepSize > 0 ? -deltaX / activeStepSize : 0;
  };

  const finish = (event?: PointerEvent) => {
    if (!isPressed.value) return;
    if (event && pointerId !== undefined && event.pointerId !== pointerId) {
      return;
    }

    const dragged = dragSlides.value;
    const wasDragging = isDragging.value;

    reset();

    if (wasDragging) options.onDragEnd(dragged);
  };

  const onPointerup = (event: PointerEvent) => finish(event);
  const onPointercancel = (event: PointerEvent) => finish(event);
  const onPointerleave = (event: PointerEvent) => finish(event);

  /** Impede que o arraste dispare cliques nos itens do slide. */
  const onClickCapture = (event: MouseEvent) => {
    if (!hasMoved) return;

    hasMoved = false;
    event.stopPropagation();
    event.preventDefault();
  };

  const onDragstart = (event: Event) => {
    if (isEnabled.value) event.preventDefault();
  };

  const onSelectstart = (event: Event) => {
    if (!isDragging.value) return;

    event.preventDefault();
  };

  return {
    dragSlides,
    isDragging,
    isPressed,
    handlers: {
      pointerdown: onPointerdown,
      pointermove: onPointermove,
      pointerup: onPointerup,
      pointercancel: onPointercancel,
      pointerleave: onPointerleave,
      dragstart: onDragstart,
      selectstart: onSelectstart
    },
    onClickCapture,
    reset
  };
};
