<script lang="ts">
import {
  cloneVNode,
  computed,
  defineComponent,
  h,
  isVNode,
  nextTick,
  onMounted,
  onUpdated,
  ref,
  useAttrs,
  useSlots
} from 'vue';
import type { PropType, VNode } from 'vue';

import type {
  ButtonColor,
  ButtonSize,
  ButtonVariant
} from '../button/StButton.interface';
import type {
  StButtonGroupOrientation,
  StButtonGroupValue
} from './StButtonGroup.interface';
import {
  buildButtonGroupClasses,
  buildButtonGroupItemClasses,
  computeActiveProps,
  isSelected,
  normalizeButtonGroupValue
} from './styleStButtonGroup';

export default defineComponent({
  name: 'StButtonGroup',
  props: {
    value: {
      type: [String, Array] as PropType<StButtonGroupValue>,
      default: undefined
    },
    defaultValue: {
      type: [String, Array] as PropType<StButtonGroupValue>,
      default: undefined
    },
    onValueChange: {
      // eslint-disable-next-line no-unused-vars
      type: Function as PropType<(value: StButtonGroupValue) => void>,
      default: undefined
    },
    multiple: { type: Boolean, default: false },
    orientation: {
      type: String as PropType<StButtonGroupOrientation>,
      default: 'horizontal'
    },
    variant: { type: String as PropType<ButtonVariant>, default: 'solid' },
    size: { type: String as PropType<ButtonSize>, default: 'medium' },
    color: { type: String as PropType<ButtonColor>, default: 'primary' },
    disabled: { type: Boolean, default: false },
    className: { type: String, default: '' }
  },
  emits: ['update:value', 'value-change'],
  setup(props, { emit }) {
    const attrs = useAttrs();
    const slots = useSlots();

    const groupRef = ref<HTMLDivElement | null>(null);
    const buttonRefs = ref<HTMLButtonElement[]>([]);

    const updateRefs = () => {
      void nextTick(() => {
        const root = groupRef.value;
        buttonRefs.value = root
          ? Array.from(root.querySelectorAll('button'))
          : [];
      });
    };

    onMounted(updateRefs);
    onUpdated(updateRefs);

    const isControlled = computed(() => props.value !== undefined);
    const internalValue = ref<StButtonGroupValue>(
      props.defaultValue ?? (props.multiple ? [] : '')
    );

    const selected = computed(() =>
      normalizeButtonGroupValue(
        isControlled.value ? props.value : internalValue.value,
        props.multiple
      )
    );

    const setValue = (next: string[]) => {
      const nextValue: StButtonGroupValue = props.multiple
        ? next
        : (next[0] ?? '');

      if (!isControlled.value) internalValue.value = nextValue;

      props.onValueChange?.(nextValue);
      emit('value-change', nextValue);
      emit('update:value', nextValue);
    };

    const handleToggle = (buttonValue: string) => {
      if (props.disabled) return;

      if (props.multiple) {
        if (selected.value.includes(buttonValue)) {
          setValue(selected.value.filter((value) => value !== buttonValue));
        } else {
          setValue([...selected.value, buttonValue]);
        }
        return;
      }

      setValue([buttonValue]);
    };

    const onKeydown = (event: KeyboardEvent) => {
      const isHorizontal = props.orientation === 'horizontal';
      const previousKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
      const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';

      if (event.key !== previousKey && event.key !== nextKey) return;

      event.preventDefault();

      const activeElement = document.activeElement;
      const activeButton =
        activeElement instanceof HTMLButtonElement ? activeElement : null;
      const currentIndex = activeButton
        ? buttonRefs.value.indexOf(activeButton)
        : -1;
      const count = buttonRefs.value.length;

      if (count === 0) return;

      const baseIndex = Math.max(0, currentIndex);
      const nextIndex =
        event.key === nextKey
          ? (baseIndex + 1) % count
          : (baseIndex - 1 + count) % count;

      buttonRefs.value[nextIndex]?.focus();
    };

    const groupClasses = computed(() => buildButtonGroupClasses(props));
    const itemClasses = computed(() =>
      buildButtonGroupItemClasses(props.orientation)
    );
    const activeProps = computed(() =>
      computeActiveProps(props.color, props.variant)
    );

    const getChildValue = (child: VNode, index: number) => {
      const rawValue = (child.props as { value?: unknown } | null)?.value;
      return rawValue === undefined ? String(index) : String(rawValue);
    };

    const mergeClasses = (base: unknown, next: unknown) =>
      [base, next].filter(Boolean).join(' ');

    const normalizeSlot = (nodes: unknown): VNode[] => {
      if (!Array.isArray(nodes)) return [];
      return nodes.filter((node) => isVNode(node)) as VNode[];
    };

    return () => {
      const children = normalizeSlot(slots.default?.());

      const rendered = children.map((child, index) => {
        const childProps =
          (child.props as Record<string, unknown> | null) ?? {};
        const childValue = getChildValue(child, index);
        const selectedItem = isSelected(selected.value, childValue);

        const nextVariant =
          (childProps.variant as ButtonVariant | undefined) ??
          (selectedItem ? activeProps.value.variant : props.variant);
        const nextColor =
          (childProps.color as ButtonColor | undefined) ??
          (selectedItem ? activeProps.value.color : props.color);
        const nextSize =
          (childProps.size as ButtonSize | undefined) ?? props.size;
        const nextDisabled = props.disabled || Boolean(childProps.disabled);
        const nextClassName = mergeClasses(
          itemClasses.value,
          childProps.className
        );
        const childOnClick =
          typeof childProps.onClick === 'function'
            ? childProps.onClick
            : undefined;

        return cloneVNode(child, {
          variant: nextVariant,
          size: nextSize,
          color: nextColor,
          disabled: nextDisabled,
          className: nextClassName,
          'aria-pressed': selectedItem ? 'true' : 'false',
          onClick: (event: MouseEvent) => {
            if (childOnClick) Reflect.apply(childOnClick, undefined, [event]);
            handleToggle(childValue);
          }
        });
      });

      return h(
        'div',
        {
          ref: groupRef,
          class: groupClasses.value,
          role: 'group',
          onKeydown,
          ...attrs
        },
        rendered
      );
    };
  }
});
</script>
