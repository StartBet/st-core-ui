import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick, ref } from 'vue';

import StRadio from '../radio/StRadio.vue';
import StRadioGroup from './StRadioGroup.vue';

describe('StRadioGroup', () => {
  it('renderiza com role="radiogroup" e aplica orientação', () => {
    const wrapper = mount(StRadioGroup, {
      props: { orientation: 'horizontal' },
      slots: {
        default: '<div data-testid="child" />'
      }
    });

    expect(wrapper.attributes('role')).toBe('radiogroup');
    expect(wrapper.find('[data-testid="child"]').exists()).toBe(true);
    expect(wrapper.attributes('class')).toContain('flex-row');
  });

  it('não-controlado: atualiza estado interno e emite update:value/value-change', async () => {
    const onValueChange = vi.fn();
    const wrapper = mount(StRadioGroup, {
      props: { defaultValue: 'a', onValueChange },
      slots: {
        default:
          '<StRadio value="a" label="A" /><StRadio value="b" label="B" /><StRadio value="c" label="C" />'
      },
      global: { components: { StRadio } },
      attachTo: document.body
    });

    const inputs = wrapper.findAll('input[type="radio"]');
    expect((inputs[0].element as HTMLInputElement).checked).toBe(true);

    await inputs[1].setValue(true);
    await nextTick();

    expect(onValueChange).toHaveBeenCalledWith('b');
    expect(wrapper.emitted('value-change')?.[0]).toEqual(['b']);
    expect(wrapper.emitted('update:value')?.[0]).toEqual(['b']);
    expect((inputs[1].element as HTMLInputElement).checked).toBe(true);

    wrapper.unmount();
  });

  it('controlado: emite update:value, mas checked reflete prop value', async () => {
    const Host = defineComponent({
      components: { StRadioGroup, StRadio },
      setup() {
        const value = ref('a');
        return { value };
      },
      template: `
        <StRadioGroup v-model:value="value">
          <StRadio value="a" label="A" />
          <StRadio value="b" label="B" />
        </StRadioGroup>
      `
    });

    const wrapper = mount(Host, { attachTo: document.body });
    const inputs = wrapper.findAll('input[type="radio"]');

    expect((inputs[0].element as HTMLInputElement).checked).toBe(true);
    expect((inputs[1].element as HTMLInputElement).checked).toBe(false);

    await inputs[1].setValue(true);
    await nextTick();

    expect((inputs[0].element as HTMLInputElement).checked).toBe(false);
    expect((inputs[1].element as HTMLInputElement).checked).toBe(true);

    wrapper.unmount();
  });

  it('propaga disabled para os radios filhos', () => {
    const wrapper = mount(StRadioGroup, {
      props: { disabled: true },
      slots: {
        default:
          '<StRadio value="a" label="A" /><StRadio value="b" label="B" />'
      },
      global: { components: { StRadio } }
    });

    const inputs = wrapper.findAll('input[type="radio"]');
    expect(inputs.length).toBe(2);
    expect(inputs[0].attributes('disabled')).toBeDefined();
    expect(inputs[1].attributes('disabled')).toBeDefined();
  });
});
