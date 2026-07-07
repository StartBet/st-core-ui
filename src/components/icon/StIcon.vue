<script setup lang="ts">
import {
  findIconDefinition,
  type IconName,
  type IconDefinition
} from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';

import type { StIconLibrary, StIconSize } from './StIcon.interface';
import { buildIconClasses } from './styleStIcon';

const props = withDefaults(
  defineProps<{
    name: string;
    lib?: StIconLibrary;
    size?: StIconSize;
    ariaLabel?: string;
    className?: string;
  }>(),
  {
    lib: 'fa',
    className: ''
  }
);

const classes = computed(() => buildIconClasses(props));

const normalizeName = (name: string) =>
  name.trim().toLowerCase().split('_').join('-');

const parseIcon = (value: string, fallbackLib: StIconLibrary) => {
  const raw = value.trim();
  const index = raw.indexOf(':');

  if (index <= 0) return { lib: fallbackLib, name: raw };

  const lib = normalizeName(raw.slice(0, index)) as StIconLibrary;
  const name = raw.slice(index + 1);

  return { lib, name };
};

const icon = computed<IconDefinition | undefined>(() => {
  const parsed = parseIcon(props.name, props.lib);
  const iconName = normalizeName(parsed.name);
  const prefix = parsed.lib === 'fab' ? 'fab' : 'fas';
  const definition = findIconDefinition({
    prefix,
    iconName: iconName as IconName
  });

  return definition ?? undefined;
});
</script>

<template>
  <span
    :class="classes.container"
    :aria-label="props.ariaLabel"
    v-bind="$attrs"
  >
    <FontAwesomeIcon
      v-if="icon"
      :icon="icon"
      :class="classes.glyph"
      :aria-label="props.ariaLabel"
    />
  </span>
</template>
