import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent } from 'vue';

import { useCheckableControl } from './useCheckableControl';

const TestHarness = defineComponent({
  name: 'TestHarness',
  inheritAttrs: false,
  props: {
    checked: {
      type: Boolean,
      default: undefined
    },
    defaultChecked: {
      type: Boolean,
      default: undefined
    },
    label: {
      type: String,
      default: undefined
    }
  },
  emits: ['update:checked', 'change'],
  setup(props, { emit }) {
    return useCheckableControl(props, {
      updateChecked: (checked) => emit('update:checked', checked),
      change: (event) => emit('change', event)
    });
  },
  template: `
    <label :class="attrs.class" :style="attrs.style">
      <input
        type="checkbox"
        :checked="checkedValue"
        v-bind="inputAttrs"
        @change="handleChange"
      />
      <span data-testid="checked">{{ checkedValue }}</span>
      <span data-testid="has-label">{{ hasLabel }}</span>
      <span v-if="hasLabel">
        <slot>{{ label }}</slot>
      </span>
    </label>
  `
});

describe('useCheckableControl', () => {
  const getInput = (wrapper: ReturnType<typeof mount>) =>
    wrapper.find('input[type="checkbox"]');
  const getInputElement = (wrapper: ReturnType<typeof mount>) =>
    getInput(wrapper).element as HTMLInputElement;

  it('suporta modo não controlado com defaultChecked', async () => {
    const wrapper = mount(TestHarness, {
      props: { defaultChecked: true, label: 'Ativo' }
    });

    expect(getInputElement(wrapper).checked).toBe(true);
    expect(wrapper.get('[data-testid="checked"]').text()).toBe('true');
    expect(wrapper.get('[data-testid="has-label"]').text()).toBe('true');

    await getInput(wrapper).setValue(false);

    expect(getInputElement(wrapper).checked).toBe(false);
    expect(wrapper.get('[data-testid="checked"]').text()).toBe('false');
    expect(wrapper.emitted('update:checked')?.[0]).toEqual([false]);
    expect(wrapper.emitted('change')).toHaveLength(1);
  });

  it('suporta modo controlado sem mutar o estado interno', async () => {
    const wrapper = mount(TestHarness, {
      props: { checked: false, label: 'Ativo' }
    });

    expect(getInputElement(wrapper).checked).toBe(false);

    await getInput(wrapper).setValue(true);

    expect(wrapper.emitted('update:checked')?.[0]).toEqual([true]);
    expect(wrapper.get('[data-testid="checked"]').text()).toBe('false');

    await wrapper.setProps({ checked: true });

    expect(getInputElement(wrapper).checked).toBe(true);
    expect(wrapper.get('[data-testid="checked"]').text()).toBe('true');
  });

  it('encaminha attrs para o input e preserva class/style para o wrapper', () => {
    const wrapper = mount(TestHarness, {
      props: { label: 'Ativo' },
      attrs: {
        name: 'notifications',
        'aria-label': 'switch',
        class: 'outer',
        style: 'opacity: 0.5'
      }
    });

    expect(wrapper.attributes('class')).toContain('outer');
    expect(wrapper.attributes('style')).toContain('opacity');
    expect(getInput(wrapper).attributes('name')).toBe('notifications');
    expect(getInput(wrapper).attributes('aria-label')).toBe('switch');
    expect(getInput(wrapper).attributes('class')).toBeUndefined();
    expect(getInput(wrapper).attributes('style')).toBeUndefined();
  });

  it('considera o slot padrão como label quando a prop não é informada', () => {
    const wrapper = mount(TestHarness, {
      slots: {
        default: 'Label via slot'
      }
    });

    expect(wrapper.get('[data-testid="has-label"]').text()).toBe('true');
    expect(wrapper.text()).toContain('Label via slot');
  });
});
