import { mount } from '@vue/test-utils';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';

import StButton from './StButton.vue';

library.add(faPlus, faChevronRight);

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
    expect(list).toContain('overflow-hidden');
    expect(list).toContain('hover:shadow-st-action-hover');
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
    const wrapper = mount(StButton, { props: { iconLeft: 'plus' } });
    const list = classList(wrapper.attributes('class'));

    expect(list).toContain('w-10');
    expect(list).toContain('px-0');

    const icon = wrapper.find('[aria-label="icon"]');
    expect(icon.exists()).toBe(true);
    expect(icon.find('svg').exists()).toBe(true);
  });

  it('aplica disabled e sobrescreve estilos', () => {
    const wrapper = mount(StButton, {
      props: { disabled: true, variant: 'solid', color: 'negative' }
    });
    const list = classList(wrapper.attributes('class'));

    expect(list).toContain('bg-st-surface-3');
    expect(list).toContain('text-st-content-disable');
    expect(list).toContain('border-st-border-2');
    expect(list).not.toContain('hover:shadow-st-action-hover');
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

  it('ignora slot default com apenas espaços e mantém modo icon only', () => {
    const wrapper = mount(StButton, {
      props: { iconRight: 'chevron-right' },
      slots: { default: '   ' }
    });
    const list = classList(wrapper.attributes('class'));

    expect(list).toContain('w-10');
    expect(wrapper.find('[aria-label="icon"]').find('svg').exists()).toBe(true);
    expect(wrapper.text()).not.toContain('   ');
  });

  it('renderiza StIcon nos adornos esquerdo e direito quando os nomes existem na library', () => {
    const wrapper = mount(StButton, {
      props: {
        iconLeft: 'plus',
        iconRight: 'chevron-right'
      },
      slots: { default: 'Continuar' }
    });

    const icons = wrapper.findAll('svg');

    expect(icons).toHaveLength(2);
    expect(wrapper.find('[aria-label="icon-left"]').exists()).toBe(true);
    expect(wrapper.find('[aria-label="icon-right"]').exists()).toBe(true);
  });

  it('renderiza adornos por slot e considera conteúdo vnode como conteúdo válido', () => {
    const wrapper = mount(StButton, {
      slots: {
        default: () => h('strong', 'Apostar'),
        startAdornment: () => h('span', { class: 'slot-start' }, 'S'),
        endAdornment: () => h('span', { class: 'slot-end' }, 'E')
      }
    });
    const list = classList(wrapper.attributes('class'));

    expect(list).not.toContain('w-10');
    expect(wrapper.find('.slot-start').exists()).toBe(true);
    expect(wrapper.find('.slot-end').exists()).toBe(true);
    expect(wrapper.text()).toContain('Apostar');
  });
});
