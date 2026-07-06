import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import StBadge from './StBadge.vue';

describe('StBadge', () => {
  const classList = (cls: string | undefined) =>
    (cls ?? '').trim().split(/\s+/).filter(Boolean);

  it('renderiza como dot por padrao e aplica defaults', () => {
    const wrapper = mount(StBadge);
    const cls = wrapper.attributes('class');
    const list = classList(cls);

    expect(list).toContain('bg-st-info');
    expect(list).toContain('h-2.5');
    expect(list).toContain('w-2.5');
    expect(list).toContain('min-w-2.5');
    expect(list).toContain('p-0');
    expect(wrapper.text()).toBe('');

    const ring = wrapper.find('[aria-hidden="true"]');
    expect(ring.exists()).toBe(true);
    expect(ring.attributes('class')).toContain('border-st-info');
  });

  it('renderiza value numerico e remove estilo de dot', () => {
    const wrapper = mount(StBadge, { props: { value: 7 } });
    const cls = wrapper.attributes('class');
    const list = classList(cls);

    expect(wrapper.text()).toBe('7');
    expect(list).toContain('bg-st-info');
    expect(list).toContain('h-[12px]');
    expect(list).not.toContain('w-2.5');
    expect(list).not.toContain('p-0');
  });

  it('formata value numerico acima de 99 como 99+', () => {
    const wrapper = mount(StBadge, { props: { value: 120 } });
    expect(wrapper.text()).toBe('99+');
  });

  it('trunca value string acima de 4 caracteres com ellipsis', () => {
    const wrapper = mount(StBadge, { props: { value: '12345' } });
    expect(wrapper.text()).toBe('1234…');
  });

  it('aplica pulse no ring quando pulse=true', () => {
    const wrapper = mount(StBadge, { props: { pulse: true } });
    const ring = wrapper.find('[aria-hidden="true"]');
    expect(ring.attributes('class')).toContain('animate-ping');
  });

  it('aplica size=medium', () => {
    const wrapper = mount(StBadge, { props: { size: 'medium' } });
    const list = classList(wrapper.attributes('class'));
    expect(list).toContain('h-3');
    expect(list).toContain('w-3');
  });

  it('anexa className ao container', () => {
    const wrapper = mount(StBadge, { props: { className: 'custom-x' } });
    expect(wrapper.attributes('class')).toContain('custom-x');
  });
});
