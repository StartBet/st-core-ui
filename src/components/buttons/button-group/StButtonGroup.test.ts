import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { h, nextTick } from 'vue';

import StButton from '../button/StButton.vue';
import StButtonGroup from './StButtonGroup.vue';
import {
  buildButtonGroupClasses,
  buildButtonGroupItemClasses,
  computeActiveProps,
  isSelected,
  normalizeButtonGroupValue
} from './styleStButtonGroup';

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

  it('usa o índice como fallback de value e preserva onClick customizado do filho', async () => {
    const onValueChange = vi.fn();
    const childClick = vi.fn();

    const wrapper = mount(StButtonGroup, {
      props: { defaultValue: '1', onValueChange },
      slots: {
        default: () => [
          h(StButton, { onClick: childClick }, () => 'Primeiro'),
          h(
            StButton,
            {
              variant: 'text',
              color: 'negative',
              size: 'large',
              className: 'custom-child'
            },
            () => 'Segundo'
          )
        ]
      }
    });

    const buttons = wrapper.findAll('button');

    expect(buttons[1].attributes('aria-pressed')).toBe('true');
    expect(buttons[1].attributes('class')).toContain('custom-child');
    expect(buttons[1].attributes('class')).toContain('h-12');
    expect(buttons[1].attributes('class')).toContain(
      'text-st-content-negative'
    );

    await buttons[0].trigger('click');

    expect(childClick).toHaveBeenCalled();
    expect(onValueChange).toHaveBeenCalledWith('0');
    const updateValueEvents = wrapper.emitted('update:value') ?? [];
    expect(
      (
        updateValueEvents as unknown[][] & {
          at(index: number): unknown[] | undefined;
        }
      ).at(-1)
    ).toEqual(['0']);
  });

  it('navega com teclado na orientação horizontal', async () => {
    const wrapper = mount(StButtonGroup, {
      attachTo: document.body,
      slots: {
        default: () => [
          h(StButton, { value: 'a' }, () => 'A'),
          h(StButton, { value: 'b' }, () => 'B'),
          h(StButton, { value: 'c' }, () => 'C')
        ]
      }
    });

    await nextTick();

    const buttons = wrapper.findAll('button');
    buttons[0].element.focus();
    await nextTick();

    await wrapper.trigger('keydown', { key: 'ArrowRight' });
    expect(document.activeElement).toBe(buttons[1].element);

    await wrapper.trigger('keydown', { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(buttons[0].element);
    wrapper.unmount();
  });

  it('navega com teclado na orientação vertical e faz wrap', async () => {
    const wrapper = mount(StButtonGroup, {
      attachTo: document.body,
      props: { orientation: 'vertical' },
      slots: {
        default: () => [
          h(StButton, { value: 'a' }, () => 'A'),
          h(StButton, { value: 'b' }, () => 'B'),
          h(StButton, { value: 'c' }, () => 'C')
        ]
      }
    });

    await nextTick();

    const buttons = wrapper.findAll('button');
    buttons[0].element.focus();
    await nextTick();

    await wrapper.trigger('keydown', { key: 'ArrowUp' });
    expect(document.activeElement).toBe(buttons[2].element);

    await wrapper.trigger('keydown', { key: 'ArrowDown' });
    expect(document.activeElement).toBe(buttons[0].element);
    wrapper.unmount();
  });

  it('normaliza value para single e multiple', () => {
    expect(normalizeButtonGroupValue(undefined, false)).toEqual([]);
    expect(normalizeButtonGroupValue('a', false)).toEqual(['a']);
    expect(normalizeButtonGroupValue(['a', 'b'], false)).toEqual(['a']);
    expect(normalizeButtonGroupValue('a', true)).toEqual(['a']);
    expect(normalizeButtonGroupValue(['a', 'b'], true)).toEqual(['a', 'b']);
  });

  it('verifica seleção de itens', () => {
    expect(isSelected(['a', 'b'], 'a')).toBe(true);
    expect(isSelected(['a', 'b'], 'c')).toBe(false);
  });

  it('calcula active props para cores primárias e secundárias', () => {
    expect(computeActiveProps('primary', 'solid')).toEqual({
      color: 'secondary',
      variant: 'solid'
    });
    expect(computeActiveProps('secondary', 'outline')).toEqual({
      color: 'primary',
      variant: 'outline'
    });
  });

  it('calcula active props para cores positivas e negativas invertendo variante quando aplicável', () => {
    expect(computeActiveProps('positive', 'solid')).toEqual({
      color: 'positive',
      variant: 'outline'
    });
    expect(computeActiveProps('negative', 'outline')).toEqual({
      color: 'negative',
      variant: 'solid'
    });
    expect(computeActiveProps('positive', 'text')).toEqual({
      color: 'positive',
      variant: 'text'
    });
  });

  it('mantém fallback defensivo para valores inesperados em runtime', () => {
    expect(computeActiveProps('custom' as never, 'custom' as never)).toEqual({
      color: 'custom',
      variant: 'custom'
    });
  });

  it('monta classes do grupo horizontal e vertical', () => {
    expect(buildButtonGroupClasses({})).toBe(
      'inline-flex items-stretch flex-row'
    );
    expect(
      buildButtonGroupClasses({
        orientation: 'vertical',
        className: 'extra-class'
      })
    ).toBe('inline-flex items-stretch flex-col extra-class');
  });

  it('monta classes dos itens para grupo horizontal e vertical', () => {
    expect(buildButtonGroupItemClasses('horizontal')).toContain(
      'first:rounded-l-st-1'
    );
    expect(buildButtonGroupItemClasses('vertical')).toContain(
      'first:rounded-t-st-1'
    );
  });
});
