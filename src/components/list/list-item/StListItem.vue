<script setup lang="ts">
import {
  cloneVNode,
  computed,
  defineComponent,
  h,
  inject,
  isVNode,
  ref,
  useAttrs,
  useSlots,
  type PropType,
  type VNode
} from 'vue';

import StButton from '../../buttons/button/StButton.vue';
import StDropdown from '../../dropdown/StDropdown.vue';
import type { StListItemProps } from '../StList.interface';
import { buildListItemClasses, stListContextKey } from '../styleStList';

defineOptions({ name: 'StListItem', inheritAttrs: false });

const props = withDefaults(defineProps<StListItemProps>(), {
  dense: false,
  divider: false,
  selected: false,
  disabled: false,
  clickable: false,
  size: 'medium',
  className: '',
  onClick: undefined,
  defaultExpanded: false,
  expanded: undefined,
  onExpandedChange: undefined
});

const attrs = useAttrs();
const slots = useSlots();

const listContext = inject(stListContextKey, null);
const navOrientation = computed(
  () => listContext?.navOrientation ?? 'vertical'
);

const internalExpanded = ref(props.defaultExpanded ?? false);
const isExpandedControlled = computed(() => props.expanded !== undefined);
const expandedValue = computed(() =>
  isExpandedControlled.value ? Boolean(props.expanded) : internalExpanded.value
);

const isListElement = (node: VNode) => {
  const type = node.type as { name?: string; __name?: string };
  const displayName = type?.name ?? type?.__name;

  return displayName === 'StUnorderedList' || displayName === 'StOrderedList';
};

const childrenParts = computed(() => {
  const nodes = slots.default?.() ?? [];
  const listIndex = nodes.findIndex(
    (node) => isVNode(node) && isListElement(node as VNode)
  );

  if (listIndex < 0) {
    return {
      contentNodes: nodes.filter((node) => isVNode(node)) as VNode[],
      subListNode: null as VNode | null
    };
  }

  return {
    contentNodes: nodes.filter(
      (node, index) => index !== listIndex && isVNode(node)
    ) as VNode[],
    subListNode: nodes[listIndex] as VNode
  };
});

const startAdornmentNodes = computed<VNode[]>(
  () => (slots.startAdornment?.() ?? []) as VNode[]
);
const endAdornmentNodes = computed<VNode[]>(
  () => (slots.endAdornment?.() ?? []) as VNode[]
);
const hasSubItems = computed(() => Boolean(childrenParts.value.subListNode));

const setExpanded = (next: boolean) => {
  if (!isExpandedControlled.value) internalExpanded.value = next;
  props.onExpandedChange?.(next);
};

const classes = computed(() =>
  buildListItemClasses(props, {
    hasSubItems: hasSubItems.value,
    expanded: expandedValue.value,
    navOrientation: navOrientation.value
  })
);

const wrapperClass = computed(() =>
  [classes.value.listItem, attrs.class].filter(Boolean).join(' ')
);
const wrapperStyle = computed(() => attrs.style);

const liAttrs = computed(() => {
  const next: Record<string, unknown> = { ...attrs };
  delete next.class;
  delete next.style;
  delete next.onClick;
  delete next.onKeydown;
  delete next.onKeyDown;
  return next;
});

const onMainClick = (event: MouseEvent) => {
  if (props.disabled) {
    event.preventDefault();
    return;
  }

  props.onClick?.(event);
};

const toggleExpanded = () => {
  setExpanded(!expandedValue.value);
};

const RenderNode = defineComponent({
  name: 'StRenderNode',
  props: {
    node: {
      type: Object as PropType<VNode | null>,
      default: null
    }
  },
  setup(renderProps) {
    return () => (renderProps.node ? cloneVNode(renderProps.node) : null);
  }
});

const RenderMainContent = defineComponent({
  name: 'StListItemMainContent',
  props: {
    startNodes: {
      type: Array as PropType<VNode[]>,
      required: true
    },
    endNodes: {
      type: Array as PropType<VNode[]>,
      required: true
    },
    contentNodes: {
      type: Array as PropType<VNode[]>,
      required: true
    },
    startClass: {
      type: String,
      required: true
    },
    endClass: {
      type: String,
      required: true
    },
    contentClass: {
      type: String,
      required: true
    }
  },
  setup(renderProps) {
    return () => [
      renderProps.startNodes.length > 0
        ? h('span', { class: renderProps.startClass }, renderProps.startNodes)
        : null,
      h('span', { class: renderProps.contentClass }, renderProps.contentNodes),
      renderProps.endNodes.length > 0
        ? h('span', { class: renderProps.endClass }, renderProps.endNodes)
        : null
    ];
  }
});
</script>

<template>
  <li :class="wrapperClass" :style="wrapperStyle" v-bind="liAttrs">
    <div :class="classes.main">
      <button
        v-if="props.clickable"
        type="button"
        :class="classes.mainActionInteractive"
        :disabled="props.disabled"
        @click="onMainClick"
      >
        <RenderMainContent
          :start-nodes="startAdornmentNodes"
          :end-nodes="endAdornmentNodes"
          :content-nodes="childrenParts.contentNodes"
          :start-class="classes.startAdornment"
          :end-class="classes.endAdornment"
          :content-class="classes.content"
        />
      </button>

      <div v-else :class="classes.mainActionBase">
        <RenderMainContent
          :start-nodes="startAdornmentNodes"
          :end-nodes="endAdornmentNodes"
          :content-nodes="childrenParts.contentNodes"
          :start-class="classes.startAdornment"
          :end-class="classes.endAdornment"
          :content-class="classes.content"
        />
      </div>

      <StDropdown
        v-if="hasSubItems && navOrientation === 'horizontal'"
        placement="bottom"
        :offset="6"
        triggerAsChild
        width="fit-content"
        :panel-class-name="classes.subMenuPanel"
      >
        <template
          #trigger="{ open, toggle, setTriggerEl, attrs: triggerAttrs }"
        >
          <StButton
            :ref="setTriggerEl"
            v-bind="triggerAttrs"
            size="medium"
            :variant="open ? 'solid' : 'text'"
            :icon-left="open ? 'chevron-up' : 'chevron-down'"
            :class-name="classes.subMenuButton"
            aria-label="Abrir submenu"
            :aria-expanded="open"
            :data-open="open ? 'true' : undefined"
            @click.stop="toggle"
          />
        </template>

        <RenderNode :node="childrenParts.subListNode" />
      </StDropdown>

      <StButton
        v-if="hasSubItems && navOrientation !== 'horizontal'"
        size="medium"
        variant="text"
        :color="expandedValue ? 'secondary' : 'primary'"
        :icon-left="expandedValue ? 'chevron-up' : 'chevron-down'"
        :class-name="classes.subMenuButton"
        :aria-label="expandedValue ? 'Fechar submenu' : 'Abrir submenu'"
        :aria-expanded="expandedValue"
        :disabled="props.disabled"
        :data-open="expandedValue ? 'true' : undefined"
        @click.stop="toggleExpanded"
      />
    </div>

    <div
      v-if="hasSubItems && navOrientation !== 'horizontal'"
      :class="classes.subList"
    >
      <RenderNode :node="childrenParts.subListNode" />
    </div>
  </li>
</template>
