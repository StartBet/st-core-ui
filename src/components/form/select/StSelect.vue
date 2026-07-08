<script lang="ts">
import {
  cloneVNode,
  computed,
  defineComponent,
  h,
  isVNode,
  nextTick,
  ref,
  useAttrs,
  useSlots,
  type PropType,
  type VNode
} from 'vue';

import StDropdown from '../../dropdown/StDropdown.vue';
import type { StDropdownPlacement } from '../../dropdown/StDropdown.interface';
import StOption from '../option/StOption.vue';
import StIcon from '../../icon/StIcon.vue';
import type {
  StSelectOptionItem,
  StSelectRef,
  StSelectValue
} from './StSelect.interface';
import { buildSelectClasses, extractText } from './styleStSelect';

type OptionEntry = {
  key: string;
  label: string;
  value: StSelectValue;
  valueKey: string;
  kind: 'prop' | 'slot';
  sourceIndex: number;
  element?: VNode;
};

const normalizeSlot = (nodes: unknown): VNode[] => {
  if (!Array.isArray(nodes)) return [];
  return nodes.filter((node) => isVNode(node)) as VNode[];
};

const mergeClasses = (a: unknown, b: unknown) =>
  [a, b].filter(Boolean).join(' ');

const normalizeValue = (value: StSelectValue | undefined) =>
  value === undefined ? '' : String(value);

const hasSelectedValue = (value: StSelectValue | undefined) =>
  value !== undefined && String(value).length > 0;

const resolveOptionLabel = (child: VNode, fallbackValue: string) => {
  const slotChildren = child.children;

  if (
    slotChildren &&
    typeof slotChildren === 'object' &&
    !Array.isArray(slotChildren)
  ) {
    const defaultSlot = (slotChildren as { default?: () => unknown }).default;

    if (typeof defaultSlot === 'function') {
      const labelFromDefaultSlot = extractText(defaultSlot());

      if (labelFromDefaultSlot) return labelFromDefaultSlot;
    }
  }

  return extractText(child.children) || fallbackValue;
};

export default defineComponent({
  name: 'StSelect',
  props: {
    value: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined
    },
    defaultValue: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined
    },
    onValueChange: {
      // eslint-disable-next-line no-unused-vars
      type: Function as PropType<(value: StSelectValue) => void>,
      default: undefined
    },
    options: {
      type: Array as PropType<StSelectOptionItem[] | undefined>,
      default: undefined
    },
    icon: { type: String, default: undefined },
    label: { type: String, default: undefined },
    placeholder: { type: String, default: 'Selecione uma opção' },
    name: { type: String, default: undefined },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    readOnly: { type: Boolean, default: false },
    messageInfo: { type: String, default: undefined },
    messageDanger: { type: String, default: undefined },
    messageSuccess: { type: String, default: undefined },
    className: { type: String, default: '' },
    panelClassName: { type: String, default: '' },
    placement: {
      type: String as PropType<StDropdownPlacement>,
      default: 'auto'
    },
    offset: { type: Number, default: 8 },
    closeOnSelect: { type: Boolean, default: true }
  },
  emits: ['update:value', 'value-change'],
  setup(props, { emit, expose }) {
    const attrs = useAttrs();
    const slots = useSlots();

    const isOpen = ref(false);
    const activeIndex = ref(-1);
    const triggerEl = ref<HTMLElement | null>(null);

    const isControlled = computed(() => props.value !== undefined);
    const internalValue = ref<StSelectValue | undefined>(props.defaultValue);

    const currentValue = computed<StSelectValue | undefined>(() =>
      isControlled.value ? props.value : internalValue.value
    );

    const isValid = ref(
      !props.required || hasSelectedValue(currentValue.value)
    );

    const propOptions = computed<OptionEntry[]>(() =>
      (props.options ?? []).map((item, index) => ({
        key: `prop-${index}-${String(item.value)}`,
        label: item.name,
        value: item.value,
        valueKey: normalizeValue(item.value),
        kind: 'prop',
        sourceIndex: index
      }))
    );

    const slotOptions = computed<OptionEntry[]>(() => {
      const renderedChildren = normalizeSlot(slots.default?.());
      const entries: OptionEntry[] = [];

      for (const [index, child] of renderedChildren.entries()) {
        const childValue = (child.props as { value?: unknown } | null)?.value;
        const fallbackValue =
          childValue === undefined
            ? extractText(child.children) || `slot-${index}`
            : String(childValue);
        const label = resolveOptionLabel(child, fallbackValue);
        const rawValue =
          typeof childValue === 'string' || typeof childValue === 'number'
            ? childValue
            : label;

        entries.push({
          key: `slot-${index}-${fallbackValue}`,
          label,
          value: rawValue,
          valueKey: normalizeValue(rawValue),
          kind: 'slot',
          sourceIndex: index,
          element: child
        });
      }

      return entries;
    });

    const entries = computed<OptionEntry[]>(() => [
      ...propOptions.value,
      ...slotOptions.value
    ]);

    const selectedIndex = computed(() =>
      entries.value.findIndex(
        (entry) => entry.valueKey === normalizeValue(currentValue.value)
      )
    );

    const selectedLabel = computed(() => {
      if (!hasSelectedValue(currentValue.value)) return '';
      const entry = entries.value.find(
        (item) => item.valueKey === normalizeValue(currentValue.value)
      );
      return entry?.label ?? '';
    });

    const setOpen = (next: boolean) => {
      if (props.disabled || props.readOnly) return;
      isOpen.value = next;

      if (next && entries.value.length > 0) {
        activeIndex.value = Math.max(0, selectedIndex.value);
      }
    };

    const commitValue = (nextValue: StSelectValue) => {
      if (props.disabled || props.readOnly) return;

      if (!isControlled.value) internalValue.value = nextValue;
      props.onValueChange?.(nextValue);
      emit('value-change', nextValue);
      emit('update:value', nextValue);
      isValid.value = !props.required || hasSelectedValue(nextValue);

      if (props.closeOnSelect) isOpen.value = false;
    };

    const moveActiveIndex = (step: 1 | -1) => {
      if (entries.value.length === 0) return;
      const count = entries.value.length;
      const base =
        activeIndex.value >= 0
          ? activeIndex.value
          : Math.max(0, selectedIndex.value);
      activeIndex.value = (base + step + count) % count;
    };

    const ensureActiveIndex = () => {
      if (entries.value.length === 0) return;
      activeIndex.value = Math.max(0, selectedIndex.value);
    };

    const onTriggerKeyDown = (event: KeyboardEvent) => {
      if (props.disabled || props.readOnly) return;

      const key = event.key;
      const isNext = key === 'ArrowDown' || key === 'ArrowRight';
      const isPrev = key === 'ArrowUp' || key === 'ArrowLeft';
      const isCommit = key === 'Enter' || key === ' ';

      if (key === 'Escape') {
        if (isOpen.value) {
          event.preventDefault();
          isOpen.value = false;
        }
        return;
      }

      if (key === 'Home') {
        event.preventDefault();
        isOpen.value = true;
        activeIndex.value = 0;
        return;
      }

      if (key === 'End') {
        event.preventDefault();
        isOpen.value = true;
        activeIndex.value = Math.max(0, entries.value.length - 1);
        return;
      }

      if (!isNext && !isPrev && !isCommit) return;

      event.preventDefault();

      if (!isOpen.value) {
        isOpen.value = true;
        ensureActiveIndex();
        return;
      }

      if (isCommit) {
        const activeEntry = entries.value[activeIndex.value];
        if (activeEntry) commitValue(activeEntry.value);
        return;
      }

      moveActiveIndex(isNext ? 1 : -1);
    };

    const onTriggerBlur = () => {
      isValid.value = !props.required || hasSelectedValue(currentValue.value);
    };

    const setTriggerEl = (refEl: Element | { $el?: unknown } | null) => {
      let element: unknown = null;

      if (refEl instanceof HTMLElement) {
        element = refEl;
      } else if (!(refEl instanceof Element)) {
        element = refEl?.$el;
      }

      triggerEl.value = element instanceof HTMLElement ? element : null;
    };

    expose({
      focus: () => triggerEl.value?.focus(),
      blur: () => triggerEl.value?.blur(),
      clear: () => commitValue(''),
      setInvalidity: () => {
        isValid.value = false;
      },
      setValidity: () => {
        isValid.value = true;
      },
      reportValidity: () => {
        isValid.value = !props.required || hasSelectedValue(currentValue.value);
      }
    } satisfies StSelectRef);

    const hasIcon = computed(() => Boolean(props.icon));
    const hasValue = computed(() => hasSelectedValue(currentValue.value));

    const classes = computed(() =>
      buildSelectClasses({
        className: props.className,
        panelClassName: props.panelClassName,
        required: props.required,
        disabled: props.disabled,
        readOnly: props.readOnly,
        hasIcon: hasIcon.value,
        isOpen: isOpen.value,
        isValid: isValid.value,
        hasValue: hasValue.value
      })
    );

    const filteredAttrs = computed(() => {
      const next: Record<string, unknown> = { ...attrs };
      delete next.class;
      delete next.style;
      return next;
    });

    const renderPropOptions = () =>
      propOptions.value.map((entry, index) =>
        h(
          StOption,
          {
            key: entry.key,
            value: entry.value,
            selected: entry.valueKey === normalizeValue(currentValue.value),
            className:
              index === activeIndex.value
                ? classes.value.optionActive
                : undefined,
            onMouseenter: () => {
              activeIndex.value = index;
            },
            onClick: () => commitValue(entry.value)
          },
          { default: () => entry.label }
        )
      );

    const renderSlotOptions = () =>
      slotOptions.value.map((entry, slotIndex) => {
        const optionIndex = propOptions.value.length + slotIndex;
        const element = entry.element;
        if (!element) return null;

        const raw = (element.props ?? {}) as Record<string, unknown>;
        const selectedProp = raw.selected;
        const mergedSelected =
          selectedProp === undefined
            ? entry.valueKey === normalizeValue(currentValue.value)
            : Boolean(selectedProp);
        const mergedClassName = mergeClasses(
          raw.className,
          optionIndex === activeIndex.value
            ? classes.value.optionActive
            : undefined
        );
        const originalOnClick = raw.onClick as Function | undefined;
        const originalOnMouseenter = raw.onMouseenter as Function | undefined;

        return cloneVNode(element, {
          key: entry.key,
          value: entry.value,
          selected: mergedSelected,
          className: mergedClassName,
          onMouseenter: (event: MouseEvent) => {
            activeIndex.value = optionIndex;
            if (originalOnMouseenter) {
              Reflect.apply(originalOnMouseenter, undefined, [event]);
            }
          },
          onClick: () => {
            commitValue(entry.value);
            if (originalOnClick) {
              Reflect.apply(originalOnClick, undefined, []);
            }
          }
        });
      });

    const openChangeHandler = (next: boolean) => {
      if (!next) {
        isOpen.value = false;
        return;
      }

      setOpen(true);
      void nextTick(() => {
        if (entries.value.length === 0) return;
        activeIndex.value = Math.max(0, selectedIndex.value);
      });
    };

    return () => {
      const rootChildren: Array<VNode | null> = [];

      if (props.label) {
        rootChildren.push(
          h('span', { class: classes.value.label }, props.label)
        );
      }

      rootChildren.push(
        h(
          StDropdown,
          {
            className: classes.value.dropdownRoot,
            panelClassName: classes.value.dropdownPanel,
            placement: props.placement,
            width: 'full',
            offset: props.offset,
            open: isOpen.value,
            closeOnOutsideClick: true,
            triggerAsChild: true,
            'onUpdate:open': openChangeHandler
          },
          {
            trigger: ({
              open,
              attrs: triggerAria,
              setTriggerEl: dropdownSetTriggerEl
            }: {
              open: boolean;
              attrs: Record<string, unknown>;
              setTriggerEl: Function;
            }) =>
              h(
                'button',
                {
                  ref: (element: Element | { $el?: unknown } | null) => {
                    dropdownSetTriggerEl(element);
                    setTriggerEl(element);
                  },
                  type: 'button',
                  class: classes.value.trigger,
                  disabled: props.disabled,
                  'aria-invalid': isValid.value ? undefined : 'true',
                  ...triggerAria,
                  onClick: () => setOpen(!open),
                  onKeydown: onTriggerKeyDown,
                  onBlur: onTriggerBlur
                },
                [
                  hasIcon.value
                    ? h(
                        'div',
                        {
                          class: classes.value.iconContainer,
                          'aria-hidden': 'true'
                        },
                        [
                          h(StIcon, {
                            name: props.icon as string,
                            size: 2,
                            ariaLabel: 'icon'
                          })
                        ]
                      )
                    : null,
                  h(
                    'span',
                    {
                      class: mergeClasses(
                        classes.value.value,
                        hasValue.value ? undefined : classes.value.placeholder
                      )
                    },
                    selectedLabel.value || props.placeholder
                  ),
                  h(StIcon, {
                    name: 'chevron-down',
                    size: 2,
                    className: classes.value.chevron,
                    'aria-hidden': 'true'
                  })
                ].filter(Boolean)
              ),
            default: () =>
              h('div', { class: classes.value.options }, [
                ...renderPropOptions(),
                ...renderSlotOptions().filter(Boolean)
              ])
          }
        )
      );

      if (props.name) {
        rootChildren.push(
          h('input', {
            type: 'hidden',
            name: props.name,
            value: currentValue.value
          })
        );
      }

      if (isValid.value && !props.messageSuccess && props.messageInfo) {
        rootChildren.push(
          h('span', { class: classes.value.messageInfo }, props.messageInfo)
        );
      }
      if (!isValid.value && props.messageDanger) {
        rootChildren.push(
          h('span', { class: classes.value.messageDanger }, props.messageDanger)
        );
      }
      if (isValid.value && props.messageSuccess) {
        rootChildren.push(
          h(
            'span',
            { class: classes.value.messageSuccess },
            props.messageSuccess
          )
        );
      }

      return h(
        'div',
        { class: classes.value.wrapper, ...filteredAttrs.value },
        rootChildren.filter(Boolean)
      );
    };
  }
});
</script>
