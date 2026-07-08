import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick, ref } from 'vue';

import StOption from '../option/StOption.vue';
import StSelect from './StSelect.vue';

describe('StSelect', () => {
  const getTriggerButton = (wrapper: ReturnType<typeof mount>) =>
    wrapper.find('button[type="button"]');

  const waitForDropdown = async () => {
    await nextTick();
    await nextTick();
  };

  it('renderiza label e placeholder', () => {
    const wrapper = mount(StSelect, {
      props: { label: 'Select', placeholder: 'Pick' }
    });

    expect(wrapper.text()).toContain('Select');
    expect(wrapper.text()).toContain('Pick');
  });

  it('abre ao clicar no trigger e renderiza options via prop', async () => {
    const wrapper = mount(StSelect, {
      props: {
        options: [
          { name: 'A', value: 'a' },
          { name: 'B', value: 'b' }
        ]
      },
      attachTo: document.body
    });

    expect(wrapper.find('dialog').exists()).toBe(false);

    await getTriggerButton(wrapper).trigger('click');
    await waitForDropdown();

    expect(wrapper.find('dialog').exists()).toBe(true);
    expect(wrapper.text()).toContain('A');
    expect(wrapper.text()).toContain('B');

    wrapper.unmount();
  });

  it('não-controlado: seleciona opção, emite update:value e fecha com closeOnSelect=true', async () => {
    const onValueChange = vi.fn();
    const wrapper = mount(StSelect, {
      props: {
        defaultValue: 'a',
        onValueChange,
        options: [
          { name: 'A', value: 'a' },
          { name: 'B', value: 'b' }
        ],
        closeOnSelect: true
      },
      attachTo: document.body
    });

    await getTriggerButton(wrapper).trigger('click');
    await waitForDropdown();

    const buttons = wrapper.findAll('button[type="button"]');
    const optionB = buttons.find((button) => button.text().includes('B'));

    expect(optionB).toBeDefined();

    await optionB!.trigger('click');
    await waitForDropdown();

    expect(onValueChange).toHaveBeenCalledWith('b');
    expect(wrapper.emitted('update:value')?.[0]).toEqual(['b']);
    expect(wrapper.emitted('value-change')?.[0]).toEqual(['b']);
    expect(wrapper.find('dialog').exists()).toBe(false);

    wrapper.unmount();
  });

  it('controlado: ao selecionar emite update:value e reflete após atualizar value', async () => {
    const Host = defineComponent({
      components: { StSelect },
      setup() {
        const value = ref<string | number>('a');
        return { value };
      },
      template: `
        <StSelect
          v-model:value="value"
          :options="[
            { name: 'A', value: 'a' },
            { name: 'B', value: 'b' }
          ]"
        />
      `
    });

    const wrapper = mount(Host, { attachTo: document.body });

    await wrapper.find('button[type="button"]').trigger('click');
    await waitForDropdown();

    const optionB = wrapper
      .findAll('button[type="button"]')
      .find((button) => button.text().includes('B'));

    expect(optionB).toBeDefined();

    await optionB!.trigger('click');
    await waitForDropdown();

    expect(wrapper.text()).toContain('B');

    wrapper.unmount();
  });

  it('renderiza opções via slot e seleciona ao clicar', async () => {
    const wrapper = mount(StSelect, {
      slots: {
        default: () => [
          h(StOption, { value: 'a' }, { default: () => 'A' }),
          h(StOption, { value: 'b' }, { default: () => 'B' })
        ]
      },
      attachTo: document.body
    });

    await getTriggerButton(wrapper).trigger('click');
    await waitForDropdown();

    const optionB = wrapper
      .findAll('button[type="button"]')
      .find((button) => button.text().includes('B'));

    expect(optionB).toBeDefined();

    await optionB!.trigger('click');
    await waitForDropdown();

    expect(wrapper.emitted('update:value')?.[0]).toEqual(['b']);

    wrapper.unmount();
  });

  it('disabled: não abre e não permite alterar valor', async () => {
    const wrapper = mount(StSelect, {
      props: {
        disabled: true,
        options: [{ name: 'A', value: 'a' }]
      }
    });

    await getTriggerButton(wrapper).trigger('click');
    await waitForDropdown();

    expect(wrapper.find('dialog').exists()).toBe(false);
    expect(wrapper.emitted('update:value')).toBeUndefined();
  });

  it('renderiza input hidden quando name é informado', () => {
    const wrapper = mount(StSelect, {
      props: {
        name: 'sport',
        defaultValue: 'casino',
        options: [{ name: 'Cassino', value: 'casino' }]
      }
    });

    const hiddenInput = wrapper.find('input[type="hidden"]');

    expect(hiddenInput.exists()).toBe(true);
    expect(hiddenInput.attributes('name')).toBe('sport');
    expect(hiddenInput.element.getAttribute('value')).toBe('casino');
  });
});
