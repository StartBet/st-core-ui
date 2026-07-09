<script setup lang="ts">
import type { StUnorderedListProps } from '../StList.interface';
import { buildUnorderedListClasses } from '../styleStList';
import { useListContainer } from '../useListContainer';

defineOptions({ name: 'StUnorderedList', inheritAttrs: false });

const props = withDefaults(defineProps<StUnorderedListProps>(), {
  dense: false,
  orientation: 'vertical',
  className: ''
});

const { wrapperClass, wrapperStyle, listAttrs } = useListContainer(
  props,
  buildUnorderedListClasses
);
</script>

<template>
  <ul :class="wrapperClass" :style="wrapperStyle" v-bind="listAttrs">
    <slot />
  </ul>
</template>
