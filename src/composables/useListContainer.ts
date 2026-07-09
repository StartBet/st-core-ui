import {
  computed,
  inject,
  normalizeClass,
  provide,
  reactive,
  useAttrs,
  watch
} from 'vue';

import type {
  StListContextValue,
  StListNavOrientation
} from '../components/list/StList.interface';
import { stListContextKey } from '../components/list/styleStList';

type ListContainerProps = {
  className?: string;
  orientation?: StListNavOrientation;
};

export const useListContainer = <T extends ListContainerProps>(
  props: T,
  buildClasses: (props: T, renderOrientation: StListNavOrientation) => string
) => {
  const attrs = useAttrs();
  const parentContext = inject(stListContextKey, null);

  const navOrientation = computed<StListNavOrientation>(
    () => parentContext?.navOrientation ?? props.orientation ?? 'vertical'
  );
  const renderOrientation = computed<StListNavOrientation>(() =>
    parentContext ? 'vertical' : navOrientation.value
  );
  const level = computed(() => (parentContext?.level ?? 0) + 1);

  const context = reactive<StListContextValue>({
    navOrientation: navOrientation.value,
    level: level.value
  });

  watch(
    navOrientation,
    (nextOrientation) => {
      context.navOrientation = nextOrientation;
    },
    { immediate: true }
  );

  watch(
    level,
    (nextLevel) => {
      context.level = nextLevel;
    },
    { immediate: true }
  );

  provide(stListContextKey, context);

  const classes = computed(() => buildClasses(props, renderOrientation.value));
  const wrapperClass = computed(() =>
    normalizeClass([classes.value, attrs.class])
  );
  const wrapperStyle = computed(() => attrs.style);

  const listAttrs = computed(() => {
    const next: Record<string, unknown> = { ...attrs };
    delete next.class;
    delete next.style;
    return next;
  });

  return {
    classes,
    wrapperClass,
    wrapperStyle,
    listAttrs
  };
};
