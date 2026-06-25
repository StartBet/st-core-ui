<script setup lang="ts">
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
  primary: 'bg-slate-900 text-white hover:bg-slate-700',
  secondary:
    'bg-white text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50'
};
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
    :class="variantClasses[props.variant]"
  >
    <slot>
      {{ props.label }}
    </slot>
  </button>
</template>
