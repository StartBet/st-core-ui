import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';

import StSwitch from './StSwitch.vue';

describe('StSwitch', () => {
  const getInput = (wrapper: ReturnType<typeof mount>) =>
    wrapper.find('input[type="checkbox"]');

  it('renderiza label via prop e aplica role switch', () => {
    const wrapper = mount(StSwitch, { props: { label: 'Ativo' } });

    expect(wrapper.text()).toContain('Ativo');
    expect(getInput(wrapper).attributes('role')).toBe('switch');
    expect(getInput(wrapper).attributes('aria-checked')).toBe('false');
  });

  it('renderiza label via slot quando fornecido', () => {
    const wrapper = mount(StSwitch, { slots: { default: 'Slot label' } });

    expect(wrapper.text()).toContain('Slot label');
  });

  it('suporta modo não controlado via defaultChecked', async () => {
    const wrapper = mount(StSwitch, {
      props: { defaultChecked: true, label: 'Ativo' }
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
    const wrapper = mount(StSwitch, {
      props: { checked: false, label: 'Ativo' }
    });
    const input = getInput(wrapper);

    expect((input.element as HTMLInputElement).checked).toBe(false);

    await input.setValue(true);

    expect(wrapper.emitted('update:checked')?.[0]).toEqual([true]);

    await wrapper.setProps({ checked: true });

    expect((input.element as HTMLInputElement).checked).toBe(true);
  });

  it('desabilita o input quando disabled=true', () => {
    const wrapper = mount(StSwitch, {
      props: { disabled: true, label: 'Ativo' }
    });

    expect(getInput(wrapper).attributes('disabled')).toBeDefined();
  });

  it('renderiza iconOff e iconOn quando fornecidos', () => {
    const wrapper = mount(StSwitch, {
      props: {
        iconOff: 'xmark',
        iconOn: 'check'
      }
    });

    expect(wrapper.find('[data-switch-icon-off]').exists()).toBe(true);
    expect(wrapper.find('[data-switch-icon-on]').exists()).toBe(true);
  });

  it('encaminha class/style para o wrapper e demais attrs para o input', () => {
    const wrapper = mount(StSwitch, {
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
  });

  it('aplica classes base e className customizado', () => {
    const wrapper = mount(StSwitch, {
      props: { label: 'Ativo', className: 'custom-switch' }
    });
    const classList = wrapper.attributes('class')?.split(/\s+/) ?? [];

    expect(classList).toContain('inline-flex');
    expect(classList).toContain('gap-st-1');
    expect(classList).toContain('custom-switch');
    expect(wrapper.find('span[aria-hidden="true"]').classes()).toContain(
      'w-[56px]'
    );
  });
});
