import { mount, type VueWrapper } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick, onMounted, ref } from 'vue';

import StOption from '../option/StOption.vue';
import StSelect from './StSelect.vue';
import type { StSelectRef } from './StSelect.interface';

describe('StSelect', () => {
  const getTriggerButton = (wrapper: VueWrapper) =>
    wrapper.find('button[type="button"]');

  const waitForDropdown = async () => {
    await nextTick();
    await nextTick();
  };

  const optionItems = [
    { name: 'A', value: 'a' },
    { name: 'B', value: 'b' },
    { name: 'C', value: 'c' }
  ];

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
        options: optionItems,
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

  it('em opções via slot exibe o label do slot e mantém o value lógico emitido', async () => {
    const wrapper = mount(StSelect, {
      slots: {
        default: () => [
          h(
            StOption,
            { value: 'profile' },
            {
              startAdornment: () =>
                h('span', { class: 'text-st-content-primary' }, 'P'),
              default: () => 'Perfil'
            }
          )
        ]
      },
      attachTo: document.body
    });

    await getTriggerButton(wrapper).trigger('click');
    await waitForDropdown();

    const option = wrapper
      .findAll('button[type="button"]')
      .find((button) => button.text().includes('Perfil'));

    expect(option).toBeDefined();

    await option!.trigger('click');
    await waitForDropdown();

    expect(wrapper.emitted('update:value')?.[0]).toEqual(['profile']);
    expect(getTriggerButton(wrapper).text()).toContain('Perfil');
    expect(getTriggerButton(wrapper).text()).not.toContain('profile');

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

  it('preserva valores numéricos em onValueChange e nos eventos emitidos', async () => {
    const onValueChange = vi.fn();
    const wrapper = mount(StSelect, {
      props: {
        defaultValue: 1,
        onValueChange,
        options: [
          { name: 'One', value: 1 },
          { name: 'Two', value: 2 }
        ]
      },
      attachTo: document.body
    });

    expect(wrapper.text()).toContain('One');

    await getTriggerButton(wrapper).trigger('click');
    await waitForDropdown();

    const optionTwo = wrapper
      .findAll('button[type="button"]')
      .find((button) => button.text().includes('Two'));

    expect(optionTwo).toBeDefined();

    await optionTwo!.trigger('click');
    await waitForDropdown();

    expect(onValueChange).toHaveBeenCalledWith(2);
    expect(wrapper.emitted('update:value')?.[0]).toEqual([2]);
    expect(wrapper.emitted('value-change')?.[0]).toEqual([2]);

    wrapper.unmount();
  });

  it('mantém o painel aberto quando closeOnSelect=false', async () => {
    const wrapper = mount(StSelect, {
      props: {
        options: optionItems,
        closeOnSelect: false
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

    expect(wrapper.find('dialog').exists()).toBe(true);

    wrapper.unmount();
  });

  it('processa mouseenter nas opções geradas por prop', async () => {
    const wrapper = mount(StSelect, {
      props: {
        options: optionItems
      },
      attachTo: document.body
    });

    await getTriggerButton(wrapper).trigger('click');
    await waitForDropdown();

    const optionB = wrapper
      .findAll('button[type="button"]')
      .find((button) => button.text().includes('B'));

    expect(optionB).toBeDefined();

    await optionB!.trigger('mouseenter');
    await optionB!.trigger('click');
    await waitForDropdown();

    expect(wrapper.emitted('update:value')?.[0]).toEqual(['b']);

    wrapper.unmount();
  });

  it('readOnly: não abre e não altera o valor ao interagir', async () => {
    const wrapper = mount(StSelect, {
      props: {
        readOnly: true,
        defaultValue: 'a',
        options: optionItems
      }
    });

    await getTriggerButton(wrapper).trigger('click');
    await getTriggerButton(wrapper).trigger('keydown', { key: 'ArrowDown' });
    await waitForDropdown();

    expect(wrapper.find('dialog').exists()).toBe(false);
    expect(wrapper.text()).toContain('A');
    expect(wrapper.emitted('update:value')).toBeUndefined();
  });

  it('renderiza mensagens info, danger e success conforme validade', async () => {
    const infoWrapper = mount(StSelect, {
      props: {
        defaultValue: 'a',
        options: optionItems,
        messageInfo: 'Info'
      }
    });

    expect(infoWrapper.text()).toContain('Info');

    const dangerWrapper = mount(StSelect, {
      props: {
        required: true,
        options: optionItems,
        messageDanger: 'Danger'
      }
    });

    expect(dangerWrapper.text()).toContain('Danger');
    expect(getTriggerButton(dangerWrapper).attributes('aria-invalid')).toBe(
      'true'
    );

    const successWrapper = mount(StSelect, {
      props: {
        defaultValue: 'a',
        options: optionItems,
        messageInfo: 'Info',
        messageSuccess: 'Success'
      }
    });

    expect(successWrapper.text()).toContain('Success');
    expect(successWrapper.text()).not.toContain('Info');

    await getTriggerButton(dangerWrapper).trigger('blur');
    expect(dangerWrapper.text()).toContain('Danger');
  });

  it('abre, navega por teclado e seleciona com Enter', async () => {
    const wrapper = mount(StSelect, {
      props: {
        options: optionItems,
        defaultValue: 'b'
      },
      attachTo: document.body
    });

    const trigger = getTriggerButton(wrapper);

    await trigger.trigger('keydown', { key: 'ArrowDown' });
    await waitForDropdown();
    expect(wrapper.find('dialog').exists()).toBe(true);

    await trigger.trigger('keydown', { key: 'ArrowUp' });
    await trigger.trigger('keydown', { key: 'Enter' });
    await waitForDropdown();

    expect(wrapper.emitted('update:value')?.[0]).toEqual(['a']);
    expect(wrapper.find('dialog').exists()).toBe(false);

    wrapper.unmount();
  });

  it('suporta Home, End e Escape no teclado', async () => {
    const wrapper = mount(StSelect, {
      props: {
        options: optionItems
      },
      attachTo: document.body
    });

    const trigger = getTriggerButton(wrapper);

    await trigger.trigger('keydown', { key: 'Home' });
    await waitForDropdown();
    expect(wrapper.find('dialog').exists()).toBe(true);

    await trigger.trigger('keydown', { key: 'End' });
    await trigger.trigger('keydown', { key: ' ' });
    await waitForDropdown();
    expect(wrapper.emitted('update:value')?.[0]).toEqual(['c']);

    await trigger.trigger('click');
    await waitForDropdown();
    expect(wrapper.find('dialog').exists()).toBe(true);

    await trigger.trigger('keydown', { key: 'Escape' });
    await waitForDropdown();
    expect(wrapper.find('dialog').exists()).toBe(false);

    await trigger.trigger('keydown', { key: 'Tab' });
    expect(wrapper.emitted('update:value')?.length).toBe(1);

    wrapper.unmount();
  });

  it('mantém o fluxo estável quando não existem opções', async () => {
    const wrapper = mount(StSelect, {
      props: {
        placeholder: 'Empty'
      },
      attachTo: document.body
    });

    const trigger = getTriggerButton(wrapper);

    await trigger.trigger('keydown', { key: 'ArrowDown' });
    await waitForDropdown();
    expect(wrapper.find('dialog').exists()).toBe(true);

    await trigger.trigger('keydown', { key: 'Enter' });
    await trigger.trigger('keydown', { key: 'Home' });
    await trigger.trigger('keydown', { key: 'End' });
    await trigger.trigger('keydown', { key: 'Escape' });
    await waitForDropdown();

    expect(wrapper.find('dialog').exists()).toBe(false);
    expect(wrapper.emitted('update:value')).toBeUndefined();

    wrapper.unmount();
  });

  it('executa handlers originais dos slots e usa fallback de texto como value', async () => {
    const onClick = vi.fn();
    const onMouseenter = vi.fn();
    const wrapper = mount(StSelect, {
      slots: {
        default: () => [
          h('button', { type: 'button', onClick, onMouseenter }, 'Alpha'),
          h(
            StOption,
            { value: 'beta', selected: true },
            { default: () => 'Beta' }
          )
        ]
      },
      attachTo: document.body
    });

    await getTriggerButton(wrapper).trigger('click');
    await waitForDropdown();

    const alphaOption = wrapper
      .findAll('button[type="button"]')
      .find((button) => button.text().includes('Alpha'));

    expect(alphaOption).toBeDefined();

    await alphaOption!.trigger('mouseenter');
    await alphaOption!.trigger('click');
    await waitForDropdown();

    expect(onMouseenter).toHaveBeenCalled();
    expect(onClick).toHaveBeenCalled();
    expect(wrapper.emitted('update:value')?.[0]).toEqual(['Alpha']);

    wrapper.unmount();
  });

  it('expõe métodos imperativos e permite controlar a validade manualmente', async () => {
    const wrapper = mount(StSelect, {
      props: {
        required: true,
        defaultValue: 'b',
        options: optionItems,
        name: 'category',
        messageDanger: 'Danger'
      },
      attachTo: document.body
    });

    const api = wrapper.vm as unknown as StSelectRef;
    const trigger = getTriggerButton(wrapper).element as HTMLButtonElement;

    api.focus();
    expect(document.activeElement).toBe(trigger);

    api.blur();
    expect(document.activeElement).not.toBe(trigger);

    api.clear();
    await waitForDropdown();
    expect(
      wrapper.find('input[type="hidden"]').element.getAttribute('value')
    ).toBe('');

    api.setValidity();
    await nextTick();
    expect(
      getTriggerButton(wrapper).attributes('aria-invalid')
    ).toBeUndefined();

    api.setInvalidity();
    await nextTick();
    expect(getTriggerButton(wrapper).attributes('aria-invalid')).toBe('true');
    expect(wrapper.text()).toContain('Danger');

    api.setValidity();
    api.reportValidity();
    await nextTick();
    expect(getTriggerButton(wrapper).attributes('aria-invalid')).toBe('true');

    wrapper.unmount();
  });

  it('processa onUpdate:open do dropdown para abrir e fechar o painel', async () => {
    const StDropdownStub = defineComponent({
      name: 'StDropdown',
      props: {
        open: { type: Boolean, default: false }
      },
      setup(props, { attrs, slots }) {
        onMounted(() => {
          const onUpdateOpen = attrs['onUpdate:open'] as
            | ((next: boolean) => void)
            | undefined;

          onUpdateOpen?.(true);
          onUpdateOpen?.(false);
        });

        return () =>
          h('div', [
            slots.trigger?.({
              open: props.open,
              attrs: {},
              setTriggerEl: () => undefined
            }),
            props.open ? slots.default?.() : null
          ]);
      }
    });

    const wrapper = mount(StSelect, {
      props: {
        options: optionItems,
        defaultValue: 'b'
      },
      attachTo: document.body,
      global: {
        stubs: {
          StDropdown: StDropdownStub
        }
      }
    });

    await waitForDropdown();
    expect(wrapper.find('dialog').exists()).toBe(false);

    wrapper.unmount();
  });
});
