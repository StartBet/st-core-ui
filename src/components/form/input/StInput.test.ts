import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import type { StInputRef } from './StInput.interface';
import StInput from './StInput.vue';

library.add(faUser);

describe('StInput', () => {
  const getInput = (wrapper: ReturnType<typeof mount>) => wrapper.find('input');

  it('renderiza label quando fornecido', () => {
    const wrapper = mount(StInput, { props: { label: 'Username' } });

    expect(wrapper.text()).toContain('Username');
    expect(getInput(wrapper).exists()).toBe(true);
  });

  it('suporta modo não controlado via defaultValue', () => {
    const wrapper = mount(StInput, { props: { defaultValue: 'hello' } });

    expect((getInput(wrapper).element as HTMLInputElement).value).toBe('hello');
  });

  it('emite update:value no modo controlado e reflete após atualizar props', async () => {
    const wrapper = mount(StInput, { props: { value: '' } });

    await getInput(wrapper).setValue('abc');

    expect(wrapper.emitted('update:value')?.[0]).toEqual(['abc']);

    await wrapper.setProps({ value: 'abc' });

    expect((getInput(wrapper).element as HTMLInputElement).value).toBe('abc');
  });

  it('aplica máscara phone-br e emite valor formatado', async () => {
    const wrapper = mount(StInput, {
      props: { mask: 'phone-br', type: 'tel' }
    });

    await getInput(wrapper).setValue('31995555555');

    expect(wrapper.emitted('update:value')?.[0]).toEqual(['(31) 99555-5555']);
    expect((getInput(wrapper).element as HTMLInputElement).value).toBe(
      '(31) 99555-5555'
    );
  });

  it('renderiza contador quando maxLength é number e aplica classes de warn/negative', async () => {
    const wrapper = mount(StInput, { props: { maxLength: 10 } });
    const counter = () => wrapper.find('span.absolute');

    await getInput(wrapper).setValue('abc');
    expect(counter().text()).toBe('7');

    await getInput(wrapper).setValue('12345678');
    expect(counter().text()).toBe('2');
    expect(counter().attributes('class')).toContain('text-st-content-warning');

    await getInput(wrapper).setValue('1234567890');
    expect(counter().text()).toBe('0');
    expect(counter().attributes('class')).toContain('text-st-content-negative');
  });

  it('mostra messageInfo quando válido e messageDanger quando inválido', async () => {
    const wrapper = mount(StInput, {
      props: { required: true, messageInfo: 'info', messageDanger: 'danger' }
    });

    expect(wrapper.text()).toContain('info');
    expect(wrapper.text()).not.toContain('danger');

    await getInput(wrapper).trigger('blur');
    await nextTick();

    expect(wrapper.text()).toContain('danger');
    expect(wrapper.text()).not.toContain('info');
  });

  it('renderiza ícone quando a prop icon é informada', () => {
    const wrapper = mount(StInput, {
      props: { icon: 'user' }
    });

    expect(wrapper.find('svg').exists()).toBe(true);
  });

  it('expõe métodos imperativos', async () => {
    const wrapper = mount(StInput, {
      props: { required: true, messageDanger: 'danger' },
      attachTo: document.body
    });
    const api = wrapper.vm as unknown as StInputRef;

    api.focus();
    await nextTick();
    expect(document.activeElement).toBe(getInput(wrapper).element);

    api.blur();
    await nextTick();

    api.setInvalidity();
    await nextTick();
    expect(wrapper.text()).toContain('danger');

    api.setValidity();
    await nextTick();
    expect(wrapper.text()).not.toContain('danger');

    await getInput(wrapper).setValue('abc');
    api.clear();
    await nextTick();
    expect(wrapper.emitted('update:value')?.[1]).toEqual(['']);

    api.reportValidity();
    await nextTick();
    expect(wrapper.text()).toContain('danger');

    wrapper.unmount();
  });
});
