import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import StButton from './StButton.vue';

describe('StButton', () => {
  const classList = (cls: string | undefined) =>
    (cls ?? '').trim().split(/\s+/).filter(Boolean);

  it('renderiza slot e aplica defaults', () => {
    const wrapper = mount(StButton, { slots: { default: 'Salvar' } });

    expect(wrapper.element.tagName.toLowerCase()).toBe('button');
    expect(wrapper.text()).toContain('Salvar');

    const list = classList(wrapper.attributes('class'));
    expect(list).toContain('rounded-st-1');
    expect(list).toContain('h-10');
    expect(list).toContain('bg-st-primary');
    expect(list).toContain('text-st-content-bright');
  });

  it('aplica variant outline + color secondary', () => {
    const wrapper = mount(StButton, {
      props: { variant: 'outline', color: 'secondary' }
    });
    const list = classList(wrapper.attributes('class'));

    expect(list).toContain('bg-transparent');
    expect(list).toContain('border-st-secondary');
    expect(list).toContain('text-st-content-secondary');
  });

  it('aplica size small', () => {
    const wrapper = mount(StButton, {
      props: { size: 'small' },
      slots: { default: 'Ok' }
    });
    const list = classList(wrapper.attributes('class'));

    expect(list).toContain('h-8');
    expect(list).toContain('text-st-sm');
  });

  it('entra em modo icon only quando nao ha slot e existe iconLeft', () => {
    const wrapper = mount(StButton, { props: { iconLeft: '+' } });
    const list = classList(wrapper.attributes('class'));

    expect(list).toContain('w-10');
    expect(list).toContain('px-0');

    const icon = wrapper.find('[aria-label="icon"]');
    expect(icon.exists()).toBe(true);
    expect(icon.text()).toBe('+');
  });

  it('aplica disabled e sobrescreve estilos', () => {
    const wrapper = mount(StButton, {
      props: { disabled: true, variant: 'solid', color: 'negative' }
    });
    const list = classList(wrapper.attributes('class'));

    expect(list).toContain('bg-st-surface-3');
    expect(list).toContain('text-st-content-disable');
    expect(list).toContain('border-st-border-2');
    expect(wrapper.attributes('disabled')).toBeDefined();
  });

  it('aplica fullWidth', () => {
    const wrapper = mount(StButton, {
      props: { fullWidth: true },
      slots: { default: 'Continuar' }
    });
    const list = classList(wrapper.attributes('class'));

    expect(list).toContain('w-full');
  });
});
