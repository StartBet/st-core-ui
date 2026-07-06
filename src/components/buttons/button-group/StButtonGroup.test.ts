import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';

import StButton from '../button/StButton.vue';
import StButtonGroup from './StButtonGroup.vue';

describe('StButtonGroup', () => {
  it('aplica classes base e orientação horizontal por padrão', () => {
    const wrapper = mount(StButtonGroup, {
      slots: {
        default: () => [
          h(StButton, { value: 'a' }, () => 'A'),
          h(StButton, { value: 'b' }, () => 'B')
        ]
      }
    });

    expect(wrapper.attributes('class')).toContain('inline-flex');
    expect(wrapper.attributes('class')).toContain('flex-row');
  });

  it('marca o item selecionado via defaultValue e aplica active props para primary', async () => {
    const wrapper = mount(StButtonGroup, {
      props: { defaultValue: 'b', color: 'primary', variant: 'solid' },
      slots: {
        default: () => [
          h(StButton, { value: 'a' }, () => 'A'),
          h(StButton, { value: 'b' }, () => 'B')
        ]
      }
    });

    const buttons = wrapper.findAll('button');

    expect(buttons[0].attributes('aria-pressed')).toBe('false');
    expect(buttons[1].attributes('aria-pressed')).toBe('true');
    expect(buttons[1].attributes('class')).toContain('bg-st-secondary');

    await buttons[0].trigger('click');

    expect(buttons[0].attributes('aria-pressed')).toBe('true');
  });

  it('suporta multiple e alterna seleção', async () => {
    const wrapper = mount(StButtonGroup, {
      props: { defaultValue: ['a'], multiple: true },
      slots: {
        default: () => [
          h(StButton, { value: 'a' }, () => 'A'),
          h(StButton, { value: 'b' }, () => 'B')
        ]
      }
    });

    const buttons = wrapper.findAll('button');

    expect(buttons[0].attributes('aria-pressed')).toBe('true');
    expect(buttons[1].attributes('aria-pressed')).toBe('false');

    await buttons[1].trigger('click');

    expect(buttons[1].attributes('aria-pressed')).toBe('true');

    await buttons[0].trigger('click');

    expect(buttons[0].attributes('aria-pressed')).toBe('false');
  });

  it('aplica orientação vertical e classes de item', () => {
    const wrapper = mount(StButtonGroup, {
      props: { orientation: 'vertical' },
      slots: {
        default: () => [
          h(StButton, { value: 'a' }, () => 'A'),
          h(StButton, { value: 'b' }, () => 'B')
        ]
      }
    });

    expect(wrapper.attributes('class')).toContain('flex-col');

    const buttons = wrapper.findAll('button');

    expect(buttons[0].attributes('class')).toContain('rounded-none');
    expect(buttons[0].attributes('class')).toContain('first:rounded-t-st-1');
  });

  it('não altera seleção quando disabled=true', async () => {
    const wrapper = mount(StButtonGroup, {
      props: { defaultValue: 'a', disabled: true },
      slots: {
        default: () => [
          h(StButton, { value: 'a' }, () => 'A'),
          h(StButton, { value: 'b' }, () => 'B')
        ]
      }
    });

    const buttons = wrapper.findAll('button');

    expect(buttons[0].attributes('aria-pressed')).toBe('true');

    await buttons[1].trigger('click');

    expect(buttons[0].attributes('aria-pressed')).toBe('true');
    expect(buttons[1].attributes('aria-pressed')).toBe('false');
  });
});
