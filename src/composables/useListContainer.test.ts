import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, inject } from 'vue';

import { stListContextKey } from '../components/list/styleStList';
import type { StListNavOrientation } from '../components/list/StList.interface';
import { useListContainer } from './useListContainer';

const ContextProbe = defineComponent({
  name: 'ContextProbe',
  setup() {
    const context = inject(stListContextKey, null);

    return { context };
  },
  template: `
    <span data-testid="context">
      {{ context?.navOrientation ?? 'none' }}:{{ context?.level ?? 0 }}
    </span>
  `
});

const TestHarness = defineComponent({
  name: 'TestHarness',
  components: { ContextProbe },
  inheritAttrs: false,
  props: {
    className: {
      type: String,
      default: ''
    },
    orientation: {
      type: String as () => StListNavOrientation,
      default: 'vertical'
    }
  },
  setup(props) {
    return useListContainer(props, (nextProps, renderOrientation) =>
      [`render-${renderOrientation}`, nextProps.className]
        .filter(Boolean)
        .join(' ')
    );
  },
  template: `
    <div
      :class="wrapperClass"
      :style="wrapperStyle"
      v-bind="listAttrs"
    >
      <span data-testid="classes">{{ classes }}</span>
      <slot />
    </div>
  `
});

describe('useListContainer', () => {
  it('usa a orientação própria quando não existe contexto pai', () => {
    const wrapper = mount(TestHarness, {
      props: {
        orientation: 'horizontal',
        className: 'internal'
      },
      slots: {
        default: '<ContextProbe />'
      },
      global: {
        components: { ContextProbe }
      }
    });

    expect(wrapper.attributes('class')).toContain('render-horizontal');
    expect(wrapper.attributes('class')).toContain('internal');
    expect(wrapper.get('[data-testid="context"]').text()).toBe('horizontal:1');
  });

  it('força render vertical em listas filhas e mantém a orientação de navegação do pai', () => {
    const Host = defineComponent({
      name: 'Host',
      components: { TestHarness, ContextProbe },
      template: `
        <TestHarness orientation="horizontal" data-testid="parent">
          <TestHarness orientation="vertical" data-testid="child">
            <ContextProbe />
          </TestHarness>
        </TestHarness>
      `
    });

    const wrapper = mount(Host);
    const parent = wrapper.get('[data-testid="parent"]');
    const child = wrapper.get('[data-testid="child"]');

    expect(parent.attributes('class')).toContain('render-horizontal');
    expect(child.attributes('class')).toContain('render-vertical');
    expect(child.get('[data-testid="context"]').text()).toBe('horizontal:2');
  });

  it('encaminha attrs comuns e normaliza class/style no wrapper', () => {
    const wrapper = mount(TestHarness, {
      props: {
        className: 'internal'
      },
      attrs: {
        class: ['external', { active: true, hidden: false }],
        style: 'opacity: 0.5',
        'data-role': 'list'
      }
    });

    expect(wrapper.attributes('class')).toContain('internal');
    expect(wrapper.attributes('class')).toContain('external');
    expect(wrapper.attributes('class')).toContain('active');
    expect(wrapper.attributes('class')).not.toContain('[object Object]');
    expect(wrapper.attributes('style')).toContain('opacity');
    expect(wrapper.attributes('data-role')).toBe('list');
  });
});
