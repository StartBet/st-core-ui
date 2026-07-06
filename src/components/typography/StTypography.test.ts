import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import StTypography from './StTypography.vue';

describe('StTypography', () => {
  const classList = (cls: string | undefined) =>
    (cls ?? '').trim().split(/\s+/).filter(Boolean);

  it('renderiza slot e aplica defaults', () => {
    const wrapper = mount(StTypography, { slots: { default: 'Texto' } });
    expect(wrapper.element.tagName.toLowerCase()).toBe('p');
    expect(wrapper.text()).toBe('Texto');

    const list = classList(wrapper.attributes('class'));
    expect(list).toContain('m-0');
    expect(list).toContain('p-0');
    expect(list).toContain('text-st-content-default');
    expect(list).toContain('font-st-body');
    expect(list).toContain('text-st-body-medium');
  });

  it('aplica variant e troca o elemento via as', () => {
    const wrapper = mount(StTypography, {
      props: { as: 'h2', variant: 'heading-3' },
      slots: { default: 'Titulo' }
    });
    expect(wrapper.element.tagName.toLowerCase()).toBe('h2');

    const list = classList(wrapper.attributes('class'));
    expect(list).toContain('font-st-heading');
    expect(list).toContain('text-st-heading-3');
  });

  it('aplica overrides de size/weight/family/lineHeight/letterSpacing/align', () => {
    const wrapper = mount(StTypography, {
      props: {
        variant: 'body-small',
        size: 6,
        weight: 'bold',
        family: 'heading',
        lineHeight: 'loose',
        letterSpacing: 'wide',
        align: 'center'
      },
      slots: { default: 'Teste' }
    });

    const list = classList(wrapper.attributes('class'));
    expect(list).toContain('text-st-body-small');
    expect(list).toContain('text-st-xl');
    expect(list).toContain('font-bold');
    expect(list).toContain('font-st-heading');
    expect(list).toContain('leading-st-loose');
    expect(list).toContain('tracking-st-wide');
    expect(list).toContain('text-center');
  });

  it('aplica estilos e transformacoes', () => {
    const wrapper = mount(StTypography, {
      props: {
        italic: true,
        underline: true,
        strikethrough: true,
        uppercase: true
      },
      slots: { default: 'Teste' }
    });

    const list = classList(wrapper.attributes('class'));
    expect(list).toContain('italic');
    expect(list).toContain('underline');
    expect(list).toContain('line-through');
    expect(list).toContain('uppercase');
  });

  it('aplica truncate e maxLines', () => {
    const wrapper = mount(StTypography, {
      props: { truncate: true, maxLines: 3 },
      slots: { default: 'Texto longo' }
    });

    const cls = wrapper.attributes('class');
    expect(cls).toContain('truncate');
    expect(cls).toContain('[-webkit-line-clamp:3]');
  });

  it('quebra o texto em multiplas linhas quando lines e definido', () => {
    const wrapper = mount(StTypography, {
      props: { as: 'h1', variant: 'hero-title', lines: 2 },
      slots: { default: 'Um dois tres quatro cinco' }
    });

    const spans = wrapper.findAll('span');
    expect(spans).toHaveLength(2);
    expect(wrapper.find('br').exists()).toBe(true);
    expect(spans[0].classes()).not.toContain('text-st-content-secondary');
    expect(spans[1].classes()).toContain('text-st-content-secondary');
  });
});
