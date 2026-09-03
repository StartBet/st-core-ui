import {
  Comment,
  Fragment,
  Text,
  type VNode,
  type VNodeArrayChildren,
  type VNodeChild
} from 'vue';

const isRenderableText = (node: VNode) =>
  node.type === Text &&
  typeof node.children === 'string' &&
  node.children.trim().length > 0;

const isSkippablePrimitive = (
  child: VNodeChild
): child is null | undefined | boolean =>
  child === null || child === undefined || typeof child === 'boolean';

const makeTextVNode = (value: string | number): VNode | undefined => {
  const text = String(value);
  return text.trim().length > 0
    ? ({ type: Text, children: text } as VNode)
    : undefined;
};

const processVNode = (node: VNode): VNode[] => {
  if (node.type === Comment) return [];

  if (node.type === Fragment) {
    return flattenSlotChildren(node.children as VNodeArrayChildren | undefined);
  }

  if (node.type === Text && !isRenderableText(node)) return [];

  return [node];
};

const processChild = (
  child: Exclude<VNodeChild, null | undefined | boolean>
): VNode[] => {
  if (Array.isArray(child)) {
    return flattenSlotChildren(child);
  }

  if (typeof child === 'string' || typeof child === 'number') {
    const textNode = makeTextVNode(child);
    return textNode ? [textNode] : [];
  }

  return processVNode(child as VNode);
};

export const flattenSlotChildren = (
  children: VNodeArrayChildren | undefined
): VNode[] => {
  if (!children) return [];

  const flattened: VNode[] = [];

  for (const child of children) {
    if (isSkippablePrimitive(child)) continue;
    flattened.push(...processChild(child));
  }

  return flattened;
};
