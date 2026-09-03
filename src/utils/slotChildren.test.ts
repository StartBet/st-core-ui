import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, Fragment, h, useSlots } from 'vue';

import { flattenSlotChildren } from './slotChildren';

const host = defineComponent({
  setup() {
    const slots = useSlots();

    return () => {
      const children = flattenSlotChildren(slots.default?.());

      return h(
        'div',
        children.map((child, index) =>
          h('span', { key: index, 'data-slide': index }, [child])
        )
      );
    };
  }
});

const mountHost = (template: string) =>
  mount(host, { slots: { default: template } });

describe('flattenSlotChildren', () => {
  it('retorna lista vazia sem conteudo', () => {
    expect(flattenSlotChildren(undefined)).toEqual([]);
    expect(flattenSlotChildren([])).toEqual([]);
  });

  it('trata cada filho de nivel raiz como um item', () => {
    const wrapper = mountHost('<div>a</div><div>b</div><article>c</article>');

    expect(wrapper.findAll('[data-slide]')).toHaveLength(3);
  });

  it('achata fragmentos e listas geradas por v-for', () => {
    const wrapper = mount(host, {
      slots: {
        default: () => [
          h(Fragment, [h('div', 'a'), h('div', 'b')]),
          [h('div', 'c'), h('div', 'd')],
          h('div', 'e')
        ]
      }
    });

    expect(wrapper.findAll('[data-slide]')).toHaveLength(5);
  });

  it('descarta comentarios e espacos em branco', () => {
    const wrapper = mountHost(`
      <!-- comentario -->
      <div>a</div>

      <div v-if="false">oculto</div>
      <div>b</div>
    `);

    expect(wrapper.findAll('[data-slide]')).toHaveLength(2);
  });

  it('mantem textos com conteudo', () => {
    const wrapper = mountHost('texto solto<div>a</div>');

    expect(wrapper.findAll('[data-slide]')).toHaveLength(2);
  });
});
