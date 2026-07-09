<script setup lang="ts">
import type { StOrderedListProps } from '../StList.interface';
import { buildOrderedListClasses } from '../styleStList';
import { useListContainer } from '../useListContainer';

defineOptions({ name: 'StOrderedList', inheritAttrs: false });

const props = withDefaults(defineProps<StOrderedListProps>(), {
  dense: false,
  orientation: 'vertical',
  className: ''
});

const { wrapperClass, wrapperStyle, listAttrs } = useListContainer(
  props,
  buildOrderedListClasses
);
</script>

<template>
  <ol :class="wrapperClass" :style="wrapperStyle" v-bind="listAttrs">
    <slot />
  </ol>
</template>
