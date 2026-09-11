import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import StAccordion from './StAccordion.vue';
import {
  buildAccordionClasses,
  resolveAccordionIconSize
} from './styleStAccordion';

const mountAccordion = (props: Record<string, unknown> = {}, options = {}) =>
  mount(StAccordion, {
    props: { title: 'Resultado final', ...props },
    slots: { default: '<p>Vitoria, empate ou derrota</p>' },
    ...options
  });

const trigger = (wrapper: ReturnType<typeof mountAccordion>) =>
  wrapper.find('button');

const region = (wrapper: ReturnType<typeof mountAccordion>) =>
  wrapper.find('[data-st-accordion-region]');

const header = (wrapper: ReturnType<typeof mountAccordion>) =>
  wrapper.find('[data-st-accordion-header]');

describe('styleStAccordion', () => {
  it('anima por grid-template-rows entre 0fr e 1fr', () => {
    const closed = buildAccordionClasses({ open: false });
    const open = buildAccordionClasses({ open: true });

    expect(closed.region).toContain('grid-rows-[0fr]');
    expect(open.region).toContain('grid-rows-[1fr]');
    expect(open.region).toContain('transition-[grid-template-rows]');
    expect(open.regionInner).toContain('overflow-hidden');
  });

  it('deixa o icone indicador transparente a ponteiro', () => {
    // o rotate cria stacking context e pintaria o icone acima do gatilho
    expect(buildAccordionClasses({}).expandIcon).toContain(
      'pointer-events-none'
    );
  });

  it('gira o icone indicador quando aberto', () => {
    expect(buildAccordionClasses({ open: false }).expandIcon).toContain(
      'rotate-0'
    );
    expect(buildAccordionClasses({ open: true }).expandIcon).toContain(
      'rotate-180'
    );
  });

  it('aplica as superficies de cabecalho e conteudo', () => {
    const classes = buildAccordionClasses({
      headerSurface: 'surface-3',
      contentSurface: 'surface-primary'
    });

    expect(classes.header).toContain('bg-st-surface-3');
    expect(classes.region).toContain('bg-st-surface-primary');
  });

  it('aceita superficie transparente', () => {
    const classes = buildAccordionClasses({
      headerSurface: 'transparent',
      contentSurface: 'transparent'
    });

    expect(classes.header).toContain('bg-transparent');
    expect(classes.region).toContain('bg-transparent');
  });

  it('resolve o tamanho do icone por escala', () => {
    expect(resolveAccordionIconSize()).toBe(3);
    expect(resolveAccordionIconSize('small')).toBe(2);
    expect(resolveAccordionIconSize('large')).toBe(4);
  });
});

describe('StAccordion', () => {
  it('comeca fechado e renderiza titulo e conteudo', () => {
    const wrapper = mountAccordion();

    expect(wrapper.text()).toContain('Resultado final');
    expect(wrapper.text()).toContain('Vitoria, empate ou derrota');
    expect(trigger(wrapper).attributes('aria-expanded')).toBe('false');
    expect(region(wrapper).classes()).toContain('grid-rows-[0fr]');
    expect(wrapper.attributes('data-st-accordion-open')).toBe('false');
  });

  it('abre e fecha no clique do cabecalho', async () => {
    const wrapper = mountAccordion();

    await trigger(wrapper).trigger('click');

    expect(trigger(wrapper).attributes('aria-expanded')).toBe('true');
    expect(region(wrapper).classes()).toContain('grid-rows-[1fr]');
    expect(wrapper.emitted('toggle')?.[0]).toEqual([true]);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);

    await trigger(wrapper).trigger('click');

    expect(trigger(wrapper).attributes('aria-expanded')).toBe('false');
    expect(wrapper.emitted('toggle')?.[1]).toEqual([false]);
  });

  it('abre na montagem com defaultOpen', () => {
    const wrapper = mountAccordion({ defaultOpen: true });

    expect(trigger(wrapper).attributes('aria-expanded')).toBe('true');
    expect(region(wrapper).classes()).toContain('grid-rows-[1fr]');
  });

  it('respeita o modelValue quando controlado', async () => {
    const wrapper = mountAccordion({ modelValue: false });

    await trigger(wrapper).trigger('click');

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
    expect(trigger(wrapper).attributes('aria-expanded')).toBe('false');

    await wrapper.setProps({ modelValue: true });

    expect(trigger(wrapper).attributes('aria-expanded')).toBe('true');
  });

  it('nao abre quando esta desabilitado', async () => {
    const wrapper = mountAccordion({ disabled: true });

    expect(trigger(wrapper).attributes('disabled')).toBeDefined();

    await trigger(wrapper).trigger('click');

    expect(trigger(wrapper).attributes('aria-expanded')).toBe('false');
    expect(wrapper.emitted('toggle')).toBeUndefined();
  });

  it('conecta cabecalho e regiao por aria', () => {
    const wrapper = mountAccordion();
    const regionId = region(wrapper).attributes('id');

    expect(trigger(wrapper).attributes('aria-controls')).toBe(regionId);
    expect(region(wrapper).attributes('aria-labelledby')).toBe(
      trigger(wrapper).attributes('id')
    );
    expect(region(wrapper).attributes('role')).toBe('region');
  });

  it('marca a regiao como inert enquanto esta fechada', async () => {
    const wrapper = mountAccordion();

    expect(region(wrapper).attributes('inert')).toBeDefined();

    await trigger(wrapper).trigger('click');

    expect(region(wrapper).attributes('inert')).toBeUndefined();
  });

  it('renderiza o icone do cabecalho apenas quando informado', () => {
    const semIcone = mountAccordion();
    const comIcone = mountAccordion({ icon: 'chevron-down' });

    expect(semIcone.findAll('svg')).toHaveLength(1);
    expect(comIcone.findAll('svg')).toHaveLength(2);
  });

  it('esconde o icone indicador com hideExpandIcon', () => {
    const wrapper = mountAccordion({ hideExpandIcon: true });

    expect(wrapper.find('[data-st-accordion-expand-icon]').exists()).toBe(
      false
    );
  });

  it('mantem o endAdornment fora do botao do cabecalho', () => {
    const wrapper = mountAccordion(
      {},
      {
        slots: {
          default: '<p>conteudo</p>',
          endAdornment: '<button class="acao">Editar</button>'
        }
      }
    );

    expect(wrapper.find('.acao').exists()).toBe(true);
    expect(trigger(wrapper).find('.acao').exists()).toBe(false);
  });

  it('posiciona o endAdornment antes do icone indicador', () => {
    const wrapper = mountAccordion(
      {},
      {
        slots: {
          default: '<p>conteudo</p>',
          endAdornment: '<span class="marcador">$ 5.000</span>'
        }
      }
    );

    const filhos = [...header(wrapper).element.children];
    const posAdornment = filhos.findIndex((el) =>
      el.querySelector('.marcador')
    );
    const posChevron = filhos.findIndex((el) =>
      el.hasAttribute('data-st-accordion-expand-icon')
    );

    expect(posAdornment).toBeGreaterThan(-1);
    expect(posChevron).toBeGreaterThan(posAdornment);
  });

  it('cobre a linha inteira com o gatilho e rotula pelo titulo', () => {
    const wrapper = mountAccordion();

    expect(trigger(wrapper).classes()).toContain('absolute');
    expect(trigger(wrapper).classes()).toContain('inset-0');
    expect(trigger(wrapper).attributes('aria-labelledby')).toBe(
      wrapper.find('[id$="-title"]').attributes('id')
    );
  });

  it('deixa o endAdornment acima do gatilho', () => {
    const wrapper = mountAccordion(
      {},
      {
        slots: {
          default: '<p>conteudo</p>',
          endAdornment: '<button class="acao">Editar</button>'
        }
      }
    );

    const adornment = wrapper.find('.acao').element.parentElement;

    expect(adornment?.className).toContain('z-[1]');
    expect(adornment?.className).toContain('relative');
  });

  it('usa os slots de titulo e icone', () => {
    const wrapper = mountAccordion(
      { title: 'Ignorado' },
      {
        slots: {
          default: '<p>conteudo</p>',
          title: '<span class="titulo-custom">Total de gols</span>',
          icon: '<span class="icone-custom">*</span>'
        }
      }
    );

    expect(wrapper.find('.titulo-custom').text()).toBe('Total de gols');
    expect(wrapper.find('.icone-custom').exists()).toBe(true);
  });

  it('aplica os tamanhos disponiveis', () => {
    const sizes = [
      ['small', 'py-st-1', 'text-st-body-small'],
      ['medium', 'py-st-2', 'text-st-body-medium'],
      ['large', 'py-st-3', 'text-st-body-large']
    ] as const;

    sizes.forEach(([size, padding, text]) => {
      const wrapper = mountAccordion({ size });

      expect(header(wrapper).classes()).toContain(padding);
      expect(
        wrapper.find('[data-st-accordion-region] div div').classes()
      ).toContain(text);
    });
  });

  it('anexa className, headerClassName e contentClassName', () => {
    const wrapper = mountAccordion({
      className: 'raiz-x',
      headerClassName: 'cabecalho-x',
      contentClassName: 'conteudo-x'
    });

    expect(wrapper.classes()).toContain('raiz-x');
    expect(wrapper.find('.cabecalho-x').exists()).toBe(true);
    expect(wrapper.find('.conteudo-x').exists()).toBe(true);
  });

  it('encaminha class, style e demais attrs para a raiz', () => {
    const wrapper = mountAccordion(
      {},
      {
        attrs: { class: 'attr-x', style: 'max-width: 300px', 'data-id': 'abc' }
      }
    );

    expect(wrapper.classes()).toContain('attr-x');
    expect(wrapper.attributes('style')).toContain('max-width: 300px');
    expect(wrapper.attributes('data-id')).toBe('abc');
  });
});
