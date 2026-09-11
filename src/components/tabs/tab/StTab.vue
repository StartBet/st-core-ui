<script setup lang="ts">
import { computed, inject, normalizeClass, useAttrs, useSlots } from 'vue';

import type { StTabProps } from '../tabs/StTabs.interface';
import {
  buildTabClasses,
  resolveTabIconSize,
  stTabsContextKey
} from '../tabs/styleStTabs';
import StIcon from '../../icon/StIcon.vue';

defineOptions({ name: 'StTab', inheritAttrs: false });

const props = withDefaults(defineProps<StTabProps>(), {
  label: '',
  icon: undefined,
  disabled: false,
  className: ''
});

defineSlots<{ default?: () => unknown }>();

const attrs = useAttrs();
const slots = useSlots();

const tabs = inject(stTabsContextKey, null);

const isActive = computed(() => Boolean(tabs?.isActive(props.value)));

const isDisabled = computed(() => props.disabled || Boolean(tabs?.disabled));

const iconSize = computed(() => resolveTabIconSize(tabs?.size));

const classes = computed(() =>
  buildTabClasses({
    variant: tabs?.variant,
    size: tabs?.size,
    color: tabs?.color,
    active: isActive.value,
    disabled: isDisabled.value,
    fullWidth: tabs?.fullWidth,
    className: props.className
  })
);

const tabClass = computed(() =>
  normalizeClass([classes.value.tab, attrs.class])
);

const tabStyle = computed(() => attrs.style);

const tabAttrs = computed(() => {
  const next: Record<string, unknown> = { ...attrs };
  delete next.class;
  delete next.style;
  return next;
});

const hasContent = computed(
  () => Boolean(slots.default) || Boolean(props.label)
);

const onClick = () => {
  if (isDisabled.value) return;

  tabs?.select(props.value);
};
</script>

<template>
  <button
    type="button"
    role="tab"
    :id="tabs?.tabId(props.value)"
    :class="tabClass"
    :style="tabStyle"
    :disabled="isDisabled"
    :aria-selected="isActive"
    :aria-controls="tabs?.panelId(props.value)"
    :tabindex="isActive ? 0 : -1"
    :data-st-tab-value="props.value"
    :data-st-tab-active="isActive"
    v-bind="tabAttrs"
    @click="onClick"
  >
    <StIcon
      v-if="props.icon"
      :name="props.icon"
      :size="iconSize"
      class="shrink-0"
      aria-hidden="true"
      data-st-tab-icon
    />

    <span v-if="hasContent">
      <slot>{{ props.label }}</slot>
    </span>
  </button>
</template>
