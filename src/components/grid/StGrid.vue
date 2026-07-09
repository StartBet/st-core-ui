<script setup lang="ts">
import { computed } from 'vue';

import type { StGridProps } from './StGrid.interface';
import { buildGridClasses } from './styleStGrid';

defineOptions({ name: 'StGrid' });

const props = withDefaults(defineProps<StGridProps>(), {
  cols: 1,
  gap: undefined,
  gapX: undefined,
  gapY: undefined,
  smCols: undefined,
  mdCols: undefined,
  lgCols: undefined,
  padding: undefined,
  smPadding: undefined,
  mdPadding: undefined,
  lgPadding: undefined,
  margin: undefined,
  smMargin: undefined,
  mdMargin: undefined,
  lgMargin: undefined,
  className: ''
});

const gridClasses = computed(() => buildGridClasses(props));
</script>

<template>
  <div :class="gridClasses">
    <slot />
  </div>
</template>
