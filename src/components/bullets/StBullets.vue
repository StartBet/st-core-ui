<script setup lang="ts">
import { computed, normalizeClass, useAttrs } from 'vue';

import type { StBulletsProps } from './StBullets.interface';
import { buildBulletsClasses } from './styleStBullets';

defineOptions({ name: 'StBullets', inheritAttrs: false });

const props = withDefaults(defineProps<StBulletsProps>(), {
  total: 0,
  modelValue: 0,
  size: 'medium',
  align: 'center',
  interactive: true,
  ariaLabel: 'Navegacao de slides',
  itemAriaLabel: undefined,
  className: ''
});

const emit = defineEmits<{
  'update:modelValue': [index: number];
  select: [index: number];
}>();

const attrs = useAttrs();

const classes = computed(() => buildBulletsClasses(props));

const containerClass = computed(() =>
  normalizeClass([classes.value.container, attrs.class])
);

const containerStyle = computed(() => attrs.style);

const containerAttrs = computed(() => {
  const next: Record<string, unknown> = { ...attrs };
  delete next.class;
  delete next.style;
  return next;
});

const bullets = computed(() =>
  Array.from({ length: Math.max(0, Math.trunc(props.total)) }, (_, index) => {
    const isActive = index === props.modelValue;
    const position = index + 1;

    return {
      index,
      isActive,
      label:
        props.itemAriaLabel?.(position, props.total) ??
        `Ir para o slide ${position} de ${props.total}`,
      class: [
        classes.value.bulletBase,
        isActive ? classes.value.bulletActive : classes.value.bulletIdle
      ].join(' ')
    };
  })
);

const select = (index: number) => {
  if (!props.interactive || index === props.modelValue) return;

  emit('update:modelValue', index);
  emit('select', index);
};
</script>

<template>
  <div
    v-if="bullets.length > 0"
    :class="containerClass"
    :style="containerStyle"
    role="group"
    :aria-label="props.ariaLabel"
    v-bind="containerAttrs"
  >
    <template v-if="props.interactive">
      <button
        v-for="bullet in bullets"
        :key="bullet.index"
        type="button"
        :class="bullet.class"
        :aria-label="bullet.label"
        :aria-current="bullet.isActive ? 'true' : undefined"
        :data-st-bullet-active="bullet.isActive"
        @click="select(bullet.index)"
      />
    </template>

    <template v-else>
      <span
        v-for="bullet in bullets"
        :key="bullet.index"
        :class="bullet.class"
        :data-st-bullet-active="bullet.isActive"
        aria-hidden="true"
      />
    </template>
  </div>
</template>
