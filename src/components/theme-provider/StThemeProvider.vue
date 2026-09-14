<script setup lang="ts">
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  watch
} from 'vue';

import type {
  StThemeContext,
  StThemeMode,
  StThemeProviderProps,
  StThemeSetting
} from './StThemeProvider.interface';
import {
  ST_THEME_ATTRIBUTE,
  buildThemeProviderClasses,
  resolveThemeMode,
  stThemeContextKey,
  toggleThemeMode
} from './styleStThemeProvider';
import { subscribeSystemTheme, useSystemThemeState } from './systemTheme';

defineOptions({ name: 'StThemeProvider' });

const props = withDefaults(defineProps<StThemeProviderProps>(), {
  theme: 'inherit',
  as: 'div',
  root: false,
  inline: false,
  className: ''
});

const emit = defineEmits<{
  'update:theme': [theme: StThemeSetting];
  change: [theme: StThemeMode];
}>();

defineSlots<{ default?: () => unknown }>();

const parent = inject(stThemeContextKey, null);

/**
 * Tema escolhido por `setTheme`. Volta a `null` quando a prop muda, para que
 * o valor vindo de fora - inclusive por `v-model:theme` - tenha a palavra final.
 */
const localTheme = ref<StThemeSetting | null>(null);

watch(
  () => props.theme,
  () => {
    localTheme.value = null;
  }
);

const theme = computed<StThemeSetting>(() => localTheme.value ?? props.theme);

const systemThemeState = useSystemThemeState();
const systemTheme = computed<StThemeMode | null>(() => systemThemeState.value);

const resolvedTheme = computed<StThemeMode>(() =>
  resolveThemeMode(theme.value, {
    parentTheme: parent?.resolvedTheme.value ?? null,
    systemTheme: systemTheme.value
  })
);

const setTheme = (next: StThemeSetting) => {
  localTheme.value = next;
  emit('update:theme', next);
};

const toggle = () => setTheme(toggleThemeMode(resolvedTheme.value));

watch(resolvedTheme, (mode) => emit('change', mode));

const context: StThemeContext = {
  theme,
  resolvedTheme,
  systemTheme,
  setTheme,
  toggle
};

provide(stThemeContextKey, context);

/** Guarda o valor original do `<html>` para restaurar ao desmontar. */
let documentThemeBackup: string | null = null;
let documentPatched = false;

const restoreDocumentTheme = () => {
  if (!documentPatched || typeof document === 'undefined') return;

  const root = document.documentElement;

  if (documentThemeBackup === null) root.removeAttribute(ST_THEME_ATTRIBUTE);
  else root.setAttribute(ST_THEME_ATTRIBUTE, documentThemeBackup);

  documentThemeBackup = null;
  documentPatched = false;
};

const applyDocumentTheme = () => {
  if (typeof document === 'undefined') return;

  if (!props.root) {
    restoreDocumentTheme();
    return;
  }

  const root = document.documentElement;

  if (!documentPatched) {
    documentThemeBackup = root.getAttribute(ST_THEME_ATTRIBUTE);
    documentPatched = true;
  }

  root.setAttribute(ST_THEME_ATTRIBUTE, resolvedTheme.value);
};

let releaseSystemTheme: (() => void) | null = null;

onMounted(() => {
  releaseSystemTheme = subscribeSystemTheme();

  applyDocumentTheme();
});

watch([resolvedTheme, () => props.root], applyDocumentTheme);

onBeforeUnmount(() => {
  releaseSystemTheme?.();
  releaseSystemTheme = null;

  restoreDocumentTheme();
});

const providerClasses = computed(
  () =>
    buildThemeProviderClasses({
      inline: props.inline,
      className: props.className
    }) || undefined
);

defineExpose({ theme, resolvedTheme, systemTheme, setTheme, toggle });
</script>

<template>
  <component
    :is="props.as"
    :class="providerClasses"
    :data-theme="resolvedTheme"
  >
    <slot />
  </component>
</template>
