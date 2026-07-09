import { computed, ref, useAttrs, useSlots } from 'vue';

type CheckableControlProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  label?: string;
};

type CheckableControlEmitters = {
  updateChecked: (checked: boolean) => void;
  change: (event: Event) => void;
};

export const useCheckableControl = <T extends CheckableControlProps>(
  props: T,
  emitters: CheckableControlEmitters
) => {
  const attrs = useAttrs();
  const slots = useSlots();

  const isControlled = computed(() => props.checked !== undefined);
  const internalChecked = ref<boolean>(props.defaultChecked ?? false);

  const checkedValue = computed(() =>
    isControlled.value ? Boolean(props.checked) : internalChecked.value
  );

  const hasLabel = computed(() => {
    const slotNodes = slots.default?.() ?? [];
    const slotHasContent = slotNodes.length > 0;
    const propHasContent =
      props.label !== undefined && String(props.label).length > 0;

    return slotHasContent || propHasContent;
  });

  const inputAttrs = computed(() => {
    const next: Record<string, unknown> = { ...attrs };
    delete next.class;
    delete next.style;
    return next;
  });

  const handleChange = (event: Event) => {
    const target =
      event.target instanceof HTMLInputElement ? event.target : null;
    const nextChecked = target ? target.checked : !checkedValue.value;

    if (!isControlled.value) internalChecked.value = nextChecked;

    emitters.updateChecked(nextChecked);
    emitters.change(event);
  };

  return {
    attrs,
    checkedValue,
    hasLabel,
    inputAttrs,
    handleChange
  };
};
