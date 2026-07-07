import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';

import StCheckbox from './StCheckbox.vue';

describe('StCheckbox', () => {
  const getInput = (wrapper: ReturnType<typeof mount>) =>
    wrapper.find('input[type="checkbox"]');

  it('renderiza label via prop e aplica input type=checkbox', () => {
    const wrapper = mount(StCheckbox, { props: { label: 'Option' } });

    expect(wrapper.text()).toContain('Option');
    expect(getInput(wrapper).exists()).toBe(true);
  });

  it('renderiza label via slot quando fornecido', () => {
    const wrapper = mount(StCheckbox, { slots: { default: 'Slot label' } });

    expect(wrapper.text()).toContain('Slot label');
  });

  it('suporta modo não controlado via defaultChecked', async () => {
    const wrapper = mount(StCheckbox, {
      props: { defaultChecked: true, label: 'X' }
    });
    const input = getInput(wrapper);

    expect((input.element as HTMLInputElement).checked).toBe(true);

    await input.setValue(false);
    await nextTick();

    expect((input.element as HTMLInputElement).checked).toBe(false);
    expect(wrapper.emitted('update:checked')?.[0]).toEqual([false]);
    expect(wrapper.emitted('change')).toHaveLength(1);
  });

  it('suporta modo controlado via checked', async () => {
    const wrapper = mount(StCheckbox, {
      props: { checked: false, label: 'X' }
    });
    const input = getInput(wrapper);

    expect((input.element as HTMLInputElement).checked).toBe(false);

    await input.setValue(true);

    expect(wrapper.emitted('update:checked')?.[0]).toEqual([true]);

    await wrapper.setProps({ checked: true });

    expect((input.element as HTMLInputElement).checked).toBe(true);
  });

  it('desabilita o input quando disabled=true', () => {
    const wrapper = mount(StCheckbox, {
      props: { disabled: true, label: 'X' }
    });

    expect(getInput(wrapper).attributes('disabled')).toBeDefined();
  });

  it('encaminha class/style para o wrapper e demais attrs para o input', () => {
    const wrapper = mount(StCheckbox, {
      props: { label: 'X' },
      attrs: {
        name: 'example',
        'aria-label': 'checkbox',
        class: 'outer',
        style: 'opacity: 0.5'
      }
    });

    expect(wrapper.attributes('class')).toContain('outer');
    expect(wrapper.attributes('style')).toContain('opacity');
    expect(getInput(wrapper).attributes('name')).toBe('example');
    expect(getInput(wrapper).attributes('aria-label')).toBe('checkbox');
  });

  it('aplica classes base e className customizado', () => {
    const wrapper = mount(StCheckbox, {
      props: { label: 'X', className: 'custom-checkbox' }
    });
    const classList = wrapper.attributes('class')?.split(/\s+/) ?? [];

    expect(classList).toContain('inline-flex');
    expect(classList).toContain('gap-st-1');
    expect(classList).toContain('custom-checkbox');
    expect(wrapper.find('span[aria-hidden="true"]').classes()).toContain(
      'border-st-border-1'
    );
  });
});
