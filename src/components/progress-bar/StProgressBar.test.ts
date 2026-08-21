import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import StProgressBar from './StProgressBar.vue';

describe('StProgressBar', () => {
  const track = (wrapper: ReturnType<typeof mount>) =>
    wrapper.find('[role="progressbar"]');
  const fill = (wrapper: ReturnType<typeof mount>) =>
    wrapper.find('[data-progress-fill]');

  it('aplica defaults de variante, tamanho e percentual', () => {
    const wrapper = mount(StProgressBar);

    expect(track(wrapper).classes()).toContain('h-[4px]');
    expect(track(wrapper).attributes('aria-valuenow')).toBe('0');
    expect(track(wrapper).attributes('aria-valuemin')).toBe('0');
    expect(track(wrapper).attributes('aria-valuemax')).toBe('100');
    expect(fill(wrapper).classes()).toContain('bg-st-primary');
    expect(fill(wrapper).attributes('style')).toContain('width: 0%');
  });

  it('aplica o percentual informado na largura do fill', () => {
    const wrapper = mount(StProgressBar, { props: { percent: 42 } });

    expect(fill(wrapper).attributes('style')).toContain('width: 42%');
    expect(track(wrapper).attributes('aria-valuenow')).toBe('42');
  });

  it('limita percentual abaixo de 0 e acima de 100', () => {
    const below = mount(StProgressBar, { props: { percent: -20 } });
    const above = mount(StProgressBar, { props: { percent: 180 } });

    expect(fill(below).attributes('style')).toContain('width: 0%');
    expect(fill(above).attributes('style')).toContain('width: 100%');
  });

  it('aplica a cor de cada variante no fill', () => {
    const variants = [
      ['primary', 'bg-st-primary'],
      ['secondary', 'bg-st-secondary'],
      ['info', 'bg-st-info'],
      ['system', 'bg-st-system'],
      ['warning', 'bg-st-warning'],
      ['positive', 'bg-st-positive'],
      ['negative', 'bg-st-negative']
    ] as const;

    variants.forEach(([variant, expected]) => {
      const wrapper = mount(StProgressBar, { props: { variant } });
      expect(fill(wrapper).classes()).toContain(expected);
    });
  });

  it('aplica size=large', () => {
    const wrapper = mount(StProgressBar, { props: { size: 'large' } });
    expect(track(wrapper).classes()).toContain('h-[8px]');
  });

  it('nao renderiza texto quando text esta vazio', () => {
    const wrapper = mount(StProgressBar);

    expect(wrapper.find('span').exists()).toBe(false);
    expect(track(wrapper).attributes('aria-describedby')).toBeUndefined();
  });

  it('renderiza texto abaixo da barra e conecta via aria-describedby', () => {
    const wrapper = mount(StProgressBar, {
      props: { text: 'Carregando arquivos' }
    });
    const label = wrapper.find('span');

    expect(label.text()).toBe('Carregando arquivos');
    expect(track(wrapper).attributes('aria-describedby')).toBe(
      label.attributes('id')
    );
  });

  it('anexa className ao container', () => {
    const wrapper = mount(StProgressBar, { props: { className: 'custom-x' } });
    expect(wrapper.attributes('class')).toContain('custom-x');
  });

  it('encaminha class e style para o container e demais attrs para a barra', () => {
    const wrapper = mount(StProgressBar, {
      attrs: {
        class: 'attr-x',
        style: 'max-width: 200px',
        'aria-label': 'Progresso'
      }
    });

    expect(wrapper.attributes('class')).toContain('attr-x');
    expect(wrapper.attributes('style')).toContain('max-width: 200px');
    expect(track(wrapper).attributes('aria-label')).toBe('Progresso');
    expect(track(wrapper).attributes('class')).not.toContain('attr-x');
  });
});
