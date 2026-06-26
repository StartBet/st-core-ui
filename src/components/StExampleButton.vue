<script setup lang="ts">
import { computed } from 'vue';

type Variant = 'primary' | 'secondary';

type Props = {
  label?: string;
  variant?: Variant;
};

const props = withDefaults(defineProps<Props>(), {
  label: 'Example button',
  variant: 'primary'
});

const variantClasses: Record<Variant, string> = {
  primary: 'bg-primary text-content-bright hover:bg-hover',
  secondary:
    'bg-surface-0 text-content-default ring-1 ring-inset ring-border-1 hover:bg-surface-1'
};

const resolvedVariantClass = computed(
  () => variantClasses[props.variant as Variant] ?? variantClasses.primary
);
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center justify-center rounded-ds-1 px-ds-4 py-ds-2 text-body-small font-medium transition-colors"
    :class="resolvedVariantClass"
  >
    <slot>
      {{ props.label }}
    </slot>
  </button>
</template>
