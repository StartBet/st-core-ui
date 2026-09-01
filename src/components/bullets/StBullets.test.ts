import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import StBullets from './StBullets.vue';
import { buildBulletsClasses } from './styleStBullets';

describe('styleStBullets', () => {
  it('aplica larguras diferentes para o bullet ativo e os demais', () => {
    const classes = buildBulletsClasses({ size: 'medium' });

    expect(classes.bulletActive).toContain('w-[24px]');
    expect(classes.bulletIdle).toContain('w-[8px]');
    expect(classes.bulletBase).toContain('h-[4px]');
  });

  it('respeita o tamanho informado', () => {
    expect(buildBulletsClasses({ size: 'large' }).bulletActive).toContain(
      'w-[32px]'
    );
    expect(buildBulletsClasses({ size: 'small' }).bulletBase).toContain(
      'h-[3px]'
    );
  });

  it('aplica o alinhamento no container', () => {
    expect(buildBulletsClasses({ align: 'left' }).container).toContain(
      'justify-start'
    );
    expect(buildBulletsClasses({ align: 'right' }).container).toContain(
      'justify-end'
    );
  });

  it('remove afordancias de clique quando nao e interativo', () => {
    const classes = buildBulletsClasses({ interactive: false });

    expect(classes.bulletBase).not.toContain('cursor-pointer');
    expect(classes.bulletIdle).not.toContain('hover:');
  });
});

describe('StBullets', () => {
  it('renderiza um bullet por item e marca o ativo', () => {
    const wrapper = mount(StBullets, { props: { total: 4, modelValue: 2 } });
    const bullets = wrapper.findAll('button');

    expect(bullets).toHaveLength(4);
    expect(bullets[2].attributes('data-st-bullet-active')).toBe('true');
    expect(bullets[2].attributes('aria-current')).toBe('true');
    expect(bullets[0].attributes('aria-current')).toBeUndefined();
  });

  it('emite a selecao ao clicar em um bullet inativo', async () => {
    const wrapper = mount(StBullets, { props: { total: 3, modelValue: 0 } });

    await wrapper.findAll('button')[2].trigger('click');

    expect(wrapper.emitted('update:modelValue')).toEqual([[2]]);
    expect(wrapper.emitted('select')).toEqual([[2]]);
  });

  it('nao emite ao clicar no bullet ja ativo', async () => {
    const wrapper = mount(StBullets, { props: { total: 3, modelValue: 1 } });

    await wrapper.findAll('button')[1].trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('renderiza elementos decorativos quando nao e interativo', () => {
    const wrapper = mount(StBullets, {
      props: { total: 3, interactive: false }
    });

    expect(wrapper.findAll('button')).toHaveLength(0);
    expect(wrapper.findAll('span[aria-hidden="true"]')).toHaveLength(3);
  });

  it('usa o rotulo customizado de cada bullet', () => {
    const wrapper = mount(StBullets, {
      props: {
        total: 2,
        itemAriaLabel: (position: number, total: number) =>
          `Pagina ${position}/${total}`
      }
    });

    expect(wrapper.findAll('button')[0].attributes('aria-label')).toBe(
      'Pagina 1/2'
    );
  });

  it('nao renderiza nada sem bullets', () => {
    const wrapper = mount(StBullets, { props: { total: 0 } });

    expect(wrapper.find('div').exists()).toBe(false);
  });
});
