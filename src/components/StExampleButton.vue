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
  primary: 'bg-st-primary text-st-content-bright hover:bg-st-hover',
  secondary:
    'bg-st-surface-0 text-st-content-default ring-1 ring-inset ring-st-border-1 hover:bg-st-surface-1'
};

const resolvedVariantClass = computed(
  () => variantClasses[props.variant as Variant] ?? variantClasses.primary
);
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center justify-center rounded-st-1 px-st-4 py-st-2 text-st-body-small font-st-highlight font-medium transition-colors"
    :class="resolvedVariantClass"
  >
    <slot>
      {{ props.label }}
    </slot>
  </button>
</template>
