import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import StTabs from './StTabs.vue';
import {
  buildTabClasses,
  buildTabsClasses,
  resolveNextTabIndex,
  resolveTabIconSize
} from './styleStTabs';
import StTabPanel from '../tab-panel/StTabPanel.vue';
import StTab from '../tab/StTab.vue';

const mercados = [
  { value: 'aovivo', label: 'Ao vivo' },
  { value: 'prejogo', label: 'Pre-jogo' },
  { value: 'bilhetes', label: 'Meus bilhetes' }
];

const mountTabs = (
  props: Record<string, unknown> = {},
  tabProps: Record<string, Record<string, unknown>> = {}
) =>
  mount(
    {
      components: { StTabs, StTab, StTabPanel },
      props: ['tabsProps', 'mercados', 'tabProps'],
      template: `
        <StTabs v-bind="tabsProps">
          <template #tabs>
            <StTab
              v-for="item in mercados"
              :key="item.value"
              :value="item.value"
              :label="item.label"
              v-bind="tabProps[item.value] || {}"
            />
          </template>

          <StTabPanel
            v-for="item in mercados"
            :key="item.value"
            :value="item.value"
          >
            conteudo de {{ item.label }}
          </StTabPanel>
        </StTabs>
      `
    },
    { props: { tabsProps: props, mercados, tabProps }, attachTo: document.body }
  );

const tabs = (wrapper: ReturnType<typeof mountTabs>) =>
  wrapper.findAll('[role="tab"]');

const panels = (wrapper: ReturnType<typeof mountTabs>) =>
  wrapper.findAll('[role="tabpanel"]');

const actives = (wrapper: ReturnType<typeof mountTabs>) =>
  tabs(wrapper).map((tab) => tab.attributes('data-st-tab-active'));

describe('styleStTabs', () => {
  it('circula pelas abas com as setas', () => {
    expect(resolveNextTabIndex(0, 3, 'ArrowRight')).toBe(1);
    expect(resolveNextTabIndex(2, 3, 'ArrowRight')).toBe(0);
    expect(resolveNextTabIndex(0, 3, 'ArrowLeft')).toBe(2);
    expect(resolveNextTabIndex(1, 3, 'ArrowLeft')).toBe(0);
  });

  it('vai para as pontas com Home e End', () => {
    expect(resolveNextTabIndex(1, 3, 'Home')).toBe(0);
    expect(resolveNextTabIndex(1, 3, 'End')).toBe(2);
  });

  it('parte do inicio quando nao ha aba focada', () => {
    expect(resolveNextTabIndex(-1, 3, 'ArrowRight')).toBe(1);
    expect(resolveNextTabIndex(-1, 0, 'ArrowRight')).toBe(-1);
  });

  it('resolve o tamanho do icone por escala', () => {
    expect(resolveTabIconSize()).toBe(3);
    expect(resolveTabIconSize('small')).toBe(2);
    expect(resolveTabIconSize('large')).toBe(4);
  });

  it('usa trilho na underline e fundo na pill', () => {
    expect(buildTabsClasses({ variant: 'underline' }).list).toContain(
      'border-b border-st-border-2'
    );
    expect(buildTabsClasses({ variant: 'pill' }).list).toContain(
      'rounded-full bg-st-surface-2'
    );
  });

  it('mantem a borda inferior reservada na underline', () => {
    expect(buildTabClasses({ variant: 'underline' }).tab).toContain(
      'border-b-transparent'
    );
    expect(
      buildTabClasses({ variant: 'underline', active: true }).tab
    ).toContain('border-b-st-primary');
  });

  it('nao emite utilitario conflitante entre forma e estado', () => {
    // bg-transparent / border-b-transparent junto do destaque deixaria a
    // decisao para a ordem do CSS, e o ativo perderia a cor.
    const pillAtiva = buildTabClasses({ variant: 'pill', active: true }).tab;
    const underlineAtiva = buildTabClasses({
      variant: 'underline',
      active: true
    }).tab;

    expect(pillAtiva).toContain('bg-st-primary');
    expect(pillAtiva).not.toContain('bg-transparent');
    expect(underlineAtiva).toContain('border-b-st-primary');
    expect(underlineAtiva).not.toContain('border-b-transparent');
  });

  it('aplica a cor de destaque por variante', () => {
    expect(
      buildTabClasses({ variant: 'pill', active: true, color: 'primary' }).tab
    ).toContain('bg-st-primary');
    expect(
      buildTabClasses({ variant: 'pill', active: true, color: 'secondary' }).tab
    ).toContain('bg-st-secondary');
    expect(
      buildTabClasses({
        variant: 'underline',
        active: true,
        color: 'secondary'
      }).tab
    ).toContain('border-b-st-secondary');
  });

  it('nao aplica hover em aba desabilitada', () => {
    expect(buildTabClasses({ disabled: true }).tab).not.toContain('hover:');
    expect(buildTabClasses({ disabled: true }).tab).toContain(
      'cursor-not-allowed'
    );
  });

  it('estica as abas com fullWidth', () => {
    expect(buildTabClasses({ fullWidth: true }).tab).toContain('flex-1');
    expect(buildTabClasses({}).tab).not.toContain('flex-1');
  });
});

describe('StTabs', () => {
  it('renderiza a lista com as abas e nenhum painel ativo sem modelValue', () => {
    const wrapper = mountTabs();

    expect(wrapper.find('[role="tablist"]').exists()).toBe(true);
    expect(tabs(wrapper)).toHaveLength(3);
    expect(actives(wrapper)).toEqual(['false', 'false', 'false']);
    expect(panels(wrapper)).toHaveLength(0);
  });

  it('ativa a aba do modelValue e mostra so o painel dela', () => {
    const wrapper = mountTabs({ modelValue: 'prejogo' });

    expect(actives(wrapper)).toEqual(['false', 'true', 'false']);
    expect(panels(wrapper)).toHaveLength(1);
    expect(panels(wrapper)[0].text()).toContain('conteudo de Pre-jogo');
  });

  it('troca de aba no clique e emite o valor', async () => {
    const wrapper = mountTabs({ modelValue: 'aovivo' });

    await tabs(wrapper)[2].trigger('click');

    const tabsComponent = wrapper.findComponent(StTabs);

    expect(actives(wrapper)).toEqual(['false', 'false', 'true']);
    expect(tabsComponent.emitted('update:modelValue')?.[0]).toEqual([
      'bilhetes'
    ]);
    expect(tabsComponent.emitted('change')?.[0]).toEqual(['bilhetes']);
  });

  it('nao emite ao clicar na aba ja ativa', async () => {
    const wrapper = mountTabs({ modelValue: 'aovivo' });

    await tabs(wrapper)[0].trigger('click');

    expect(
      wrapper.findComponent(StTabs).emitted('update:modelValue')
    ).toBeUndefined();
  });

  it('acompanha a mudanca externa do modelValue', async () => {
    const wrapper = mountTabs({ modelValue: 'aovivo' });

    await wrapper.setProps({ tabsProps: { modelValue: 'bilhetes' } });

    expect(actives(wrapper)).toEqual(['false', 'false', 'true']);
  });

  it('conecta aba e painel por aria', () => {
    const wrapper = mountTabs({ modelValue: 'aovivo' });
    const tab = tabs(wrapper)[0];
    const panel = panels(wrapper)[0];

    expect(tab.attributes('aria-selected')).toBe('true');
    expect(tab.attributes('aria-controls')).toBe(panel.attributes('id'));
    expect(panel.attributes('aria-labelledby')).toBe(tab.attributes('id'));
  });

  it('usa tabindex rotativo entre as abas', () => {
    const wrapper = mountTabs({ modelValue: 'prejogo' });

    expect(tabs(wrapper).map((tab) => tab.attributes('tabindex'))).toEqual([
      '-1',
      '0',
      '-1'
    ]);
  });

  it('nao seleciona aba desabilitada', async () => {
    const wrapper = mountTabs(
      { modelValue: 'aovivo' },
      { prejogo: { disabled: true } }
    );

    expect(tabs(wrapper)[1].attributes('disabled')).toBeDefined();

    await tabs(wrapper)[1].trigger('click');

    expect(actives(wrapper)).toEqual(['true', 'false', 'false']);
  });

  it('bloqueia todas as abas com disabled no container', async () => {
    const wrapper = mountTabs({ modelValue: 'aovivo', disabled: true });

    tabs(wrapper).forEach((tab) => {
      expect(tab.attributes('disabled')).toBeDefined();
    });

    await tabs(wrapper)[1].trigger('click');

    expect(actives(wrapper)).toEqual(['true', 'false', 'false']);
  });

  it('propaga variante, tamanho e cor para as abas', () => {
    const wrapper = mountTabs({
      modelValue: 'aovivo',
      variant: 'pill',
      size: 'large',
      color: 'secondary'
    });

    expect(tabs(wrapper)[0].classes()).toContain('bg-st-secondary');
    expect(tabs(wrapper)[0].classes()).toContain('h-st-6');
    expect(wrapper.find('[data-st-tabs-list]').classes()).toContain(
      'rounded-full'
    );
  });

  it('renderiza icone e slot no lugar do label', () => {
    const wrapper = mount(
      {
        components: { StTabs, StTab },
        template: `
          <StTabs model-value="a">
            <template #tabs>
              <StTab value="a" icon="futbol" label="Com icone" />
              <StTab value="b"><span class="custom">Livre</span></StTab>
            </template>
          </StTabs>
        `
      },
      { attachTo: document.body }
    );

    expect(wrapper.find('[data-st-tab-icon]').exists()).toBe(true);
    expect(wrapper.find('.custom').text()).toBe('Livre');
  });

  it('mantem o painel montado e escondido com keepAlive', () => {
    const wrapper = mount(
      {
        components: { StTabs, StTab, StTabPanel },
        template: `
          <StTabs model-value="a">
            <template #tabs>
              <StTab value="a" label="A" />
              <StTab value="b" label="B" />
            </template>
            <StTabPanel value="a" keep-alive>painel A</StTabPanel>
            <StTabPanel value="b" keep-alive>painel B</StTabPanel>
          </StTabs>
        `
      },
      { attachTo: document.body }
    );

    const list = wrapper.findAll('[role="tabpanel"]');

    expect(list).toHaveLength(2);
    expect(list[0].attributes('hidden')).toBeUndefined();
    expect(list[1].attributes('hidden')).toBeDefined();
  });

  it('anexa className e listClassName', () => {
    const wrapper = mountTabs({
      className: 'raiz-x',
      listClassName: 'lista-x'
    });

    expect(wrapper.findComponent(StTabs).classes()).toContain('raiz-x');
    expect(wrapper.find('[data-st-tabs-list]').classes()).toContain('lista-x');
  });
});

describe('StTabs — teclado', () => {
  const press = async (wrapper: ReturnType<typeof mountTabs>, key: string) => {
    await wrapper.find('[data-st-tabs-list]').trigger('keydown', { key });
  };

  it('anda com as setas a partir da aba focada', async () => {
    const wrapper = mountTabs({ modelValue: 'aovivo' });

    (tabs(wrapper)[0].element as HTMLButtonElement).focus();

    await press(wrapper, 'ArrowRight');
    expect(actives(wrapper)).toEqual(['false', 'true', 'false']);

    await press(wrapper, 'ArrowRight');
    expect(actives(wrapper)).toEqual(['false', 'false', 'true']);
  });

  it('circula do fim para o inicio', async () => {
    const wrapper = mountTabs({ modelValue: 'bilhetes' });

    (tabs(wrapper)[2].element as HTMLButtonElement).focus();

    await press(wrapper, 'ArrowRight');

    expect(actives(wrapper)).toEqual(['true', 'false', 'false']);
  });

  it('vai para as pontas com Home e End', async () => {
    const wrapper = mountTabs({ modelValue: 'prejogo' });

    (tabs(wrapper)[1].element as HTMLButtonElement).focus();

    await press(wrapper, 'End');
    expect(actives(wrapper)).toEqual(['false', 'false', 'true']);

    await press(wrapper, 'Home');
    expect(actives(wrapper)).toEqual(['true', 'false', 'false']);
  });

  it('pula abas desabilitadas', async () => {
    const wrapper = mountTabs(
      { modelValue: 'aovivo' },
      { prejogo: { disabled: true } }
    );

    (tabs(wrapper)[0].element as HTMLButtonElement).focus();

    await press(wrapper, 'ArrowRight');

    expect(actives(wrapper)).toEqual(['false', 'false', 'true']);
  });

  it('ignora teclas fora da navegacao', async () => {
    const wrapper = mountTabs({ modelValue: 'aovivo' });

    await press(wrapper, 'ArrowDown');

    expect(actives(wrapper)).toEqual(['true', 'false', 'false']);
  });
});
