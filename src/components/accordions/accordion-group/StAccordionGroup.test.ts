import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import StAccordionGroup from './StAccordionGroup.vue';
import {
  normalizeOpenValues,
  toModelValue,
  toggleOpenValue
} from './styleStAccordionGroup';
import StAccordion from '../accordion/StAccordion.vue';

const items = [
  { value: 'resultado', title: 'Resultado final' },
  { value: 'gols', title: 'Total de gols' },
  { value: 'ambas', title: 'Ambas as equipes marcam' }
];

const mountGroup = (
  props: Record<string, unknown> = {},
  itemProps: Record<string, Record<string, unknown>> = {}
) =>
  mount(
    {
      components: { StAccordionGroup, StAccordion },
      props: ['groupProps', 'items', 'itemProps'],
      template: `
        <StAccordionGroup v-bind="groupProps">
          <StAccordion
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            :title="item.title"
            v-bind="itemProps[item.value] || {}"
          >
            conteudo de {{ item.title }}
          </StAccordion>
        </StAccordionGroup>
      `
    },
    { props: { groupProps: props, items, itemProps } }
  );

const triggers = (wrapper: ReturnType<typeof mountGroup>) =>
  wrapper.findAll('button');

const headers = (wrapper: ReturnType<typeof mountGroup>) =>
  wrapper.findAll('[data-st-accordion-header]');

const openFlags = (wrapper: ReturnType<typeof mountGroup>) =>
  wrapper
    .findAll('[data-st-accordion-open]')
    .map((item) => item.attributes('data-st-accordion-open'));

describe('styleStAccordionGroup', () => {
  it('normaliza o modelValue recebido', () => {
    expect(normalizeOpenValues(undefined)).toEqual([]);
    expect(normalizeOpenValues(null)).toEqual([]);
    expect(normalizeOpenValues('resultado')).toEqual(['resultado']);
    expect(normalizeOpenValues(['a', 'b'], true)).toEqual(['a', 'b']);
    expect(normalizeOpenValues(['a', 'b'])).toEqual(['a']);
  });

  it('alterna respeitando o modo do grupo', () => {
    expect(toggleOpenValue([], 'a')).toEqual(['a']);
    expect(toggleOpenValue(['a'], 'a')).toEqual([]);
    expect(toggleOpenValue(['a'], 'b')).toEqual(['b']);
    expect(toggleOpenValue(['a'], 'b', true)).toEqual(['a', 'b']);
    expect(toggleOpenValue(['a', 'b'], 'a', true)).toEqual(['b']);
  });

  it('devolve o payload no formato do modelValue', () => {
    expect(toModelValue([])).toBeNull();
    expect(toModelValue(['a'])).toBe('a');
    expect(toModelValue([], true)).toEqual([]);
    expect(toModelValue(['a', 'b'], true)).toEqual(['a', 'b']);
  });
});

describe('StAccordionGroup', () => {
  it('comeca com todos os itens colapsados', () => {
    const wrapper = mountGroup();

    expect(openFlags(wrapper)).toEqual(['false', 'false', 'false']);
  });

  it('abre um de cada vez por padrao', async () => {
    const wrapper = mountGroup();

    await triggers(wrapper)[0].trigger('click');
    expect(openFlags(wrapper)).toEqual(['true', 'false', 'false']);

    await triggers(wrapper)[1].trigger('click');
    expect(openFlags(wrapper)).toEqual(['false', 'true', 'false']);
  });

  it('fecha o item aberto quando clicado de novo', async () => {
    const wrapper = mountGroup();

    await triggers(wrapper)[0].trigger('click');
    await triggers(wrapper)[0].trigger('click');

    expect(openFlags(wrapper)).toEqual(['false', 'false', 'false']);
  });

  it('permite varios itens abertos com multiple', async () => {
    const wrapper = mountGroup({ multiple: true });

    await triggers(wrapper)[0].trigger('click');
    await triggers(wrapper)[2].trigger('click');

    expect(openFlags(wrapper)).toEqual(['true', 'false', 'true']);
  });

  it('define o estado inicial pelo modelValue', () => {
    expect(openFlags(mountGroup({ modelValue: 'gols' }))).toEqual([
      'false',
      'true',
      'false'
    ]);
    expect(
      openFlags(
        mountGroup({ multiple: true, modelValue: ['resultado', 'ambas'] })
      )
    ).toEqual(['true', 'false', 'true']);
    expect(openFlags(mountGroup({ modelValue: null }))).toEqual([
      'false',
      'false',
      'false'
    ]);
  });

  it('emite o payload no formato do modo', async () => {
    const single = mountGroup();
    await triggers(single)[1].trigger('click');

    const group = single.findComponent(StAccordionGroup);
    expect(group.emitted('update:modelValue')?.[0]).toEqual(['gols']);
    expect(group.emitted('change')?.[0]).toEqual(['gols']);

    const multi = mountGroup({ multiple: true });
    await triggers(multi)[0].trigger('click');
    await triggers(multi)[1].trigger('click');

    const multiGroup = multi.findComponent(StAccordionGroup);
    expect(multiGroup.emitted('update:modelValue')?.[1]).toEqual([
      ['resultado', 'gols']
    ]);
  });

  it('emite null ao fechar o unico item aberto', async () => {
    const wrapper = mountGroup();

    await triggers(wrapper)[0].trigger('click');
    await triggers(wrapper)[0].trigger('click');

    const group = wrapper.findComponent(StAccordionGroup);
    expect(group.emitted('update:modelValue')?.[1]).toEqual([null]);
  });

  it('honra o defaultOpen do item quando o grupo nao esta controlado', () => {
    const wrapper = mountGroup({}, { gols: { defaultOpen: true } });

    expect(openFlags(wrapper)).toEqual(['false', 'true', 'false']);
  });

  it('mantem apenas o primeiro defaultOpen no modo unico', () => {
    const wrapper = mountGroup(
      {},
      { resultado: { defaultOpen: true }, ambas: { defaultOpen: true } }
    );

    expect(openFlags(wrapper)).toEqual(['true', 'false', 'false']);
  });

  it('aceita varios defaultOpen no modo multiple', () => {
    const wrapper = mountGroup(
      { multiple: true },
      { resultado: { defaultOpen: true }, ambas: { defaultOpen: true } }
    );

    expect(openFlags(wrapper)).toEqual(['true', 'false', 'true']);
  });

  it('ignora o defaultOpen do item quando o grupo esta controlado', () => {
    const wrapper = mountGroup(
      { modelValue: 'resultado' },
      { gols: { defaultOpen: true } }
    );

    expect(openFlags(wrapper)).toEqual(['true', 'false', 'false']);
  });

  it('propaga tamanho, superficies e disabled para os itens', () => {
    const wrapper = mountGroup({
      size: 'large',
      headerSurface: 'surface-3',
      contentSurface: 'surface-4',
      disabled: true
    });

    expect(headers(wrapper)[0].classes()).toContain('py-st-3');
    expect(wrapper.find('[data-st-accordion-open]').html()).toContain(
      'bg-st-surface-3'
    );
    expect(wrapper.find('[data-st-accordion-region]').classes()).toContain(
      'bg-st-surface-4'
    );
    expect(triggers(wrapper)[0].attributes('disabled')).toBeDefined();
  });

  it('deixa o item sobrescrever o que vem do grupo', () => {
    const wrapper = mountGroup({ size: 'small' }, { gols: { size: 'large' } });

    expect(headers(wrapper)[0].classes()).toContain('py-st-1');
    expect(headers(wrapper)[1].classes()).toContain('py-st-3');
  });

  it('nao alterna itens quando o grupo esta desabilitado', async () => {
    const wrapper = mountGroup({ disabled: true });

    await triggers(wrapper)[0].trigger('click');

    expect(openFlags(wrapper)).toEqual(['false', 'false', 'false']);
  });

  it('mantem apenas o primeiro aberto ao sair do modo multiple', async () => {
    const wrapper = mountGroup({ multiple: true });

    await triggers(wrapper)[0].trigger('click');
    await triggers(wrapper)[1].trigger('click');
    expect(openFlags(wrapper)).toEqual(['true', 'true', 'false']);

    await wrapper.setProps({ groupProps: { multiple: false } });

    expect(openFlags(wrapper)).toEqual(['true', 'false', 'false']);
  });

  it('colapsa tudo pelo metodo exposto', async () => {
    const wrapper = mountGroup({ multiple: true });

    await triggers(wrapper)[0].trigger('click');
    await triggers(wrapper)[1].trigger('click');

    const group = wrapper.findComponent(StAccordionGroup);
    (group.vm as unknown as { collapseAll: () => void }).collapseAll();
    await wrapper.vm.$nextTick();

    expect(openFlags(wrapper)).toEqual(['false', 'false', 'false']);
  });

  it('aplica gap e className no container', () => {
    const wrapper = mountGroup({ gap: 3, className: 'grupo-x' });
    const group = wrapper.findComponent(StAccordionGroup);

    expect(group.classes()).toContain('gap-st-3');
    expect(group.classes()).toContain('grupo-x');
  });

  it('vira um grupo rotulado quando recebe ariaLabel', () => {
    const semLabel = mountGroup().findComponent(StAccordionGroup);
    const comLabel = mountGroup({
      ariaLabel: 'Mercados da partida'
    }).findComponent(StAccordionGroup);

    expect(semLabel.attributes('role')).toBeUndefined();
    expect(comLabel.attributes('role')).toBe('group');
    expect(comLabel.attributes('aria-label')).toBe('Mercados da partida');
  });
});
