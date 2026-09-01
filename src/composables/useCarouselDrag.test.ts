import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';

import { useCarouselDrag } from './useCarouselDrag';

const makeDragEvent = (
  type: string,
  overrides: Partial<PointerEvent> = {}
): PointerEvent => {
  const event = new Event(type) as unknown as PointerEvent;

  Object.defineProperties(event, {
    clientX: { value: overrides.clientX ?? 0, configurable: true },
    clientY: { value: overrides.clientY ?? 0, configurable: true },
    pointerId: { value: overrides.pointerId ?? 1, configurable: true },
    button: { value: overrides.button ?? 0, configurable: true },
    currentTarget: {
      value: overrides.currentTarget ?? document.createElement('div'),
      configurable: true
    },
    isPrimary: { value: overrides.isPrimary ?? true, configurable: true }
  });

  return event;
};

describe('useCarouselDrag', () => {
  const originalGetSelection = window.getSelection;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    window.getSelection = originalGetSelection;
    vi.useRealTimers();
  });

  const setupDrag = (
    options: Parameters<typeof useCarouselDrag>[0] & {
      element?: HTMLElement;
    }
  ) => {
    let api: ReturnType<typeof useCarouselDrag>;
    const el = options.element ?? document.createElement('div');
    el.setPointerCapture = vi.fn();
    el.releasePointerCapture = vi.fn();

    const Harness = defineComponent({
      setup() {
        api = useCarouselDrag(options);
        return () => h('div');
      }
    });

    mount(Harness);
    return { api: api!, el };
  };

  it('inicia com estado neutro', () => {
    const { api } = setupDrag({
      enabled: true,
      stepSize: 100,
      onDragEnd: vi.fn()
    });

    expect(api.isPressed.value).toBe(false);
    expect(api.isDragging.value).toBe(false);
    expect(api.dragSlides.value).toBe(0);
  });

  it('ignora pointerdown quando disabled', () => {
    const onDragStart = vi.fn();
    const { api } = setupDrag({
      enabled: false,
      stepSize: 100,
      onDragStart,
      onDragEnd: vi.fn()
    });

    api.handlers.pointerdown(makeDragEvent('pointerdown'));
    expect(api.isPressed.value).toBe(false);
    expect(onDragStart).not.toHaveBeenCalled();
  });

  it('ignora pointerdown de botao que nao e o primario', () => {
    const onDragStart = vi.fn();
    const { api } = setupDrag({
      enabled: true,
      stepSize: 100,
      onDragStart,
      onDragEnd: vi.fn()
    });

    api.handlers.pointerdown(
      makeDragEvent('pointerdown', { button: 2, clientX: 50, clientY: 50 })
    );
    expect(api.isPressed.value).toBe(false);
    expect(onDragStart).not.toHaveBeenCalled();
  });

  it('inicia press e chama onDragStart no pointerdown valido', () => {
    const onDragStart = vi.fn();
    const { api } = setupDrag({
      enabled: true,
      stepSize: 100,
      onDragStart,
      onDragEnd: vi.fn()
    });

    api.handlers.pointerdown(
      makeDragEvent('pointerdown', { clientX: 0, clientY: 0 })
    );
    expect(api.isPressed.value).toBe(true);
    expect(onDragStart).toHaveBeenCalledTimes(1);
  });

  it('reconhece gesto horizontal apos activationDistance', () => {
    const { api, el } = setupDrag({
      enabled: true,
      stepSize: 100,
      activationDistance: 10,
      onDragEnd: vi.fn()
    });

    api.handlers.pointerdown(
      makeDragEvent('pointerdown', {
        clientX: 100,
        clientY: 50,
        currentTarget: el
      })
    );
    expect(api.isDragging.value).toBe(false);

    api.handlers.pointermove(
      makeDragEvent('pointermove', {
        clientX: 105,
        clientY: 50,
        currentTarget: el
      })
    );
    expect(api.isDragging.value).toBe(false);

    api.handlers.pointermove(
      makeDragEvent('pointermove', {
        clientX: 120,
        clientY: 50,
        currentTarget: el
      })
    );
    expect(api.isDragging.value).toBe(true);
    expect(el.setPointerCapture).toHaveBeenCalledWith(1);
  });

  it('ignora gesto vertical dominante', () => {
    const { api } = setupDrag({
      enabled: true,
      stepSize: 100,
      activationDistance: 6,
      onDragEnd: vi.fn()
    });

    api.handlers.pointerdown(
      makeDragEvent('pointerdown', { clientX: 100, clientY: 50 })
    );

    api.handlers.pointermove(
      makeDragEvent('pointermove', { clientX: 105, clientY: 100 })
    );
    expect(api.isDragging.value).toBe(false);
  });

  it('atualiza dragSlides conforme deltaX', () => {
    const { api, el } = setupDrag({
      enabled: true,
      stepSize: 100,
      activationDistance: 0,
      onDragEnd: vi.fn()
    });

    api.handlers.pointerdown(
      makeDragEvent('pointerdown', {
        clientX: 0,
        clientY: 0,
        currentTarget: el
      })
    );

    api.handlers.pointermove(
      makeDragEvent('pointermove', { clientX: -100, clientY: 0 })
    );
    expect(api.dragSlides.value).toBeCloseTo(1);

    api.handlers.pointermove(
      makeDragEvent('pointermove', { clientX: 150, clientY: 0 })
    );
    expect(api.dragSlides.value).toBeCloseTo(-1.5);
  });

  it('ignora pointermove sem pointerdown previo', () => {
    const { api } = setupDrag({
      enabled: true,
      stepSize: 100,
      activationDistance: 0,
      onDragEnd: vi.fn()
    });

    api.handlers.pointermove(
      makeDragEvent('pointermove', { clientX: 200, clientY: 0 })
    );
    expect(api.isPressed.value).toBe(false);
    expect(api.dragSlides.value).toBe(0);
  });

  it('chama onDragEnd com valor arrastado no pointerup', () => {
    const onDragEnd = vi.fn();
    const { api, el } = setupDrag({
      enabled: true,
      stepSize: 100,
      activationDistance: 0,
      onDragEnd
    });

    api.handlers.pointerdown(
      makeDragEvent('pointerdown', {
        clientX: 100,
        clientY: 0,
        currentTarget: el
      })
    );
    api.handlers.pointermove(
      makeDragEvent('pointermove', { clientX: 0, clientY: 0 })
    );
    api.handlers.pointerup(makeDragEvent('pointerup'));

    expect(onDragEnd).toHaveBeenCalledTimes(1);
    expect(onDragEnd).toHaveBeenCalledWith(1);
    expect(api.isPressed.value).toBe(false);
    expect(api.isDragging.value).toBe(false);
    expect(api.dragSlides.value).toBe(0);
  });

  it('nao chama onDragEnd se nenhum gesto foi reconhecido', () => {
    const onDragEnd = vi.fn();
    const { api } = setupDrag({
      enabled: true,
      stepSize: 100,
      activationDistance: 999,
      onDragEnd
    });

    api.handlers.pointerdown(
      makeDragEvent('pointerdown', { clientX: 100, clientY: 0 })
    );
    api.handlers.pointermove(
      makeDragEvent('pointermove', { clientX: 101, clientY: 0 })
    );
    api.handlers.pointerup(makeDragEvent('pointerup'));

    expect(onDragEnd).not.toHaveBeenCalled();
  });

  it('pointercancel finaliza gesto', () => {
    const onDragEnd = vi.fn();
    const { api, el } = setupDrag({
      enabled: true,
      stepSize: 100,
      activationDistance: 0,
      onDragEnd
    });

    api.handlers.pointerdown(
      makeDragEvent('pointerdown', {
        clientX: 0,
        clientY: 0,
        currentTarget: el
      })
    );
    api.handlers.pointermove(
      makeDragEvent('pointermove', { clientX: -200, clientY: 0 })
    );
    api.handlers.pointercancel(makeDragEvent('pointercancel'));

    expect(onDragEnd).toHaveBeenCalledWith(2);
  });

  it('pointerleave finaliza gesto', () => {
    const onDragEnd = vi.fn();
    const { api, el } = setupDrag({
      enabled: true,
      stepSize: 100,
      activationDistance: 0,
      onDragEnd
    });

    api.handlers.pointerdown(
      makeDragEvent('pointerdown', {
        clientX: 0,
        clientY: 0,
        currentTarget: el
      })
    );
    api.handlers.pointermove(
      makeDragEvent('pointermove', { clientX: 300, clientY: 0 })
    );
    api.handlers.pointerleave(makeDragEvent('pointerleave'));

    expect(onDragEnd).toHaveBeenCalledWith(-3);
  });

  it('onClickCapture bloqueia clique apos movimento', () => {
    const { api, el } = setupDrag({
      enabled: true,
      stepSize: 100,
      activationDistance: 0,
      onDragEnd: vi.fn()
    });

    const clickEvent = new Event('click', {
      cancelable: true,
      bubbles: true
    }) as unknown as MouseEvent;
    Object.defineProperties(clickEvent, {
      stopPropagation: { value: vi.fn() },
      preventDefault: { value: vi.fn() }
    });

    api.handlers.pointerdown(
      makeDragEvent('pointerdown', {
        clientX: 0,
        clientY: 0,
        currentTarget: el
      })
    );
    api.handlers.pointermove(
      makeDragEvent('pointermove', { clientX: 100, clientY: 0 })
    );
    api.onClickCapture(clickEvent);

    expect(clickEvent.stopPropagation).toHaveBeenCalled();
    expect(clickEvent.preventDefault).toHaveBeenCalled();
  });

  it('onClickCapture nao bloqueia sem movimento previo', () => {
    const { api } = setupDrag({
      enabled: true,
      stepSize: 100,
      onDragEnd: vi.fn()
    });

    const clickEvent = new Event('click', {
      cancelable: true,
      bubbles: true
    }) as unknown as MouseEvent;
    Object.defineProperties(clickEvent, {
      stopPropagation: { value: vi.fn() },
      preventDefault: { value: vi.fn() }
    });

    api.onClickCapture(clickEvent);

    expect(clickEvent.stopPropagation).not.toHaveBeenCalled();
    expect(clickEvent.preventDefault).not.toHaveBeenCalled();
  });

  it('onDragstart previne nativo quando enabled', () => {
    const { api } = setupDrag({
      enabled: true,
      stepSize: 100,
      onDragEnd: vi.fn()
    });

    const dragEvent = new Event('dragstart', { cancelable: true });
    api.handlers.dragstart(dragEvent);
    expect(dragEvent.defaultPrevented).toBe(true);
  });

  it('onSelectstart previne selecao durante dragging', () => {
    const { api, el } = setupDrag({
      enabled: true,
      stepSize: 100,
      activationDistance: 0,
      onDragEnd: vi.fn()
    });

    const selEvent = new Event('selectstart', { cancelable: true });
    api.handlers.selectstart(selEvent);
    expect(selEvent.defaultPrevented).toBe(false);

    api.handlers.pointerdown(
      makeDragEvent('pointerdown', {
        clientX: 0,
        clientY: 0,
        currentTarget: el
      })
    );
    api.handlers.pointermove(
      makeDragEvent('pointermove', { clientX: 100, clientY: 0 })
    );

    const selEvent2 = new Event('selectstart', { cancelable: true });
    api.handlers.selectstart(selEvent2);
    expect(selEvent2.defaultPrevented).toBe(true);
  });

  it('clearSelection remove selecao de texto quando presente', () => {
    const fakeRange = { remove: vi.fn() };
    const fakeSelection = {
      isCollapsed: false,
      removeAllRanges: vi.fn()
    };
    window.getSelection = vi.fn().mockReturnValue(fakeSelection);

    const { api, el } = setupDrag({
      enabled: true,
      stepSize: 100,
      activationDistance: 0,
      onDragEnd: vi.fn()
    });

    api.handlers.pointerdown(
      makeDragEvent('pointerdown', {
        clientX: 0,
        clientY: 0,
        currentTarget: el
      })
    );
    api.handlers.pointermove(
      makeDragEvent('pointermove', { clientX: 50, clientY: 0 })
    );

    expect(fakeSelection.removeAllRanges).toHaveBeenCalled();
    expect(fakeRange.remove).not.toHaveBeenCalled();
  });

  it('reset zera todo o estado', () => {
    const { api, el } = setupDrag({
      enabled: true,
      stepSize: 100,
      activationDistance: 0,
      onDragEnd: vi.fn()
    });

    api.handlers.pointerdown(
      makeDragEvent('pointerdown', {
        clientX: 0,
        clientY: 0,
        currentTarget: el
      })
    );
    api.handlers.pointermove(
      makeDragEvent('pointermove', { clientX: 100, clientY: 0 })
    );

    expect(api.isPressed.value).toBe(true);
    expect(api.isDragging.value).toBe(true);
    expect(api.dragSlides.value).not.toBe(0);

    api.reset();

    expect(api.isPressed.value).toBe(false);
    expect(api.isDragging.value).toBe(false);
    expect(api.dragSlides.value).toBe(0);
  });

  it('resolveStepSize trata step invalido', () => {
    const { api, el } = setupDrag({
      enabled: true,
      stepSize: NaN,
      activationDistance: 0,
      onDragEnd: vi.fn()
    });

    api.handlers.pointerdown(
      makeDragEvent('pointerdown', {
        clientX: 0,
        clientY: 0,
        currentTarget: el
      })
    );
    api.handlers.pointermove(
      makeDragEvent('pointermove', { clientX: 100, clientY: 0 })
    );

    expect(api.dragSlides.value).toBe(0);
  });
});
