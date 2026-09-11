import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import StSuperOddsCard from './StSuperOddsCard.vue';
import {
  buildSuperOddsCardClasses,
  formatSuperOddsDate,
  resolveSuperOddsAction,
  formatSuperOddsOdd,
  resolveSuperOddsSteps
} from './styleStSuperOddsCard';

const card = {
  type: 'Turbinada',
  competition: 'Libertadores',
  home: 'Independiente',
  away: 'Flamengo',
  homeLogo: 'https://cdn.exemplo.com/independiente.png',
  awayLogo: 'https://cdn.exemplo.com/flamengo.png',
  selections: [
    { selection: 'Mais de 0.5', market: 'Chutes ao gol - Pedro (FLA)' },
    { selection: 'Mais de 1.5', market: 'Chutes ao gol - Pedro (FLA)' },
    { selection: 'Menos de 8.5', market: 'Total de escanteios' }
  ],
  price: 2,
  boostedPrice: 3
};

const mountCard = (props: Record<string, unknown> = {}, options = {}) =>
  mount(StSuperOddsCard, { props: { ...card, ...props }, ...options });

const acao = (wrapper: ReturnType<typeof mountCard>) =>
  wrapper.find('[data-st-super-odds-action]');

describe('styleStSuperOddsCard', () => {
  it('formata a data no padrao da plataforma', () => {
    expect(formatSuperOddsDate('2026-09-10T22:00:00')).toBe('10/09 • 22:00');
  });

  it('devolve vazio para data ausente, zerada ou invalida', () => {
    expect(formatSuperOddsDate()).toBe('');
    expect(formatSuperOddsDate('')).toBe('');
    expect(formatSuperOddsDate('0001-01-01T00:00:00')).toBe('');
    expect(formatSuperOddsDate('nao e data')).toBe('');
  });

  it('formata a odd com duas casas', () => {
    expect(formatSuperOddsOdd(3)).toBe('3.00');
    expect(formatSuperOddsOdd(2.5)).toBe('2.50');
    expect(formatSuperOddsOdd(1.789)).toBe('1.79');
  });

  it('passa strings ja formatadas e ignora valores vazios', () => {
    expect(formatSuperOddsOdd('3.00')).toBe('3.00');
    expect(formatSuperOddsOdd()).toBe('');
    expect(formatSuperOddsOdd('')).toBe('');
    expect(formatSuperOddsOdd(Number.NaN)).toBe('');
  });

  it('converte selecoes em passos do stepper', () => {
    expect(
      resolveSuperOddsSteps([
        { selection: 'Mais de 0.5', market: 'Chutes ao gol' }
      ])
    ).toEqual([{ title: 'Mais de 0.5', description: 'Chutes ao gol' }]);
  });

  it('descarta selecoes sem conteudo', () => {
    expect(resolveSuperOddsSteps([])).toEqual([]);
    expect(resolveSuperOddsSteps([{}, { selection: 'Vale' }])).toEqual([
      { title: 'Vale', description: undefined }
    ]);
  });
});

describe('estado no bilhete', () => {
  it('resolve a acao por estado', () => {
    expect(resolveSuperOddsAction(false)).toEqual({
      variant: 'ghost',
      color: 'primary'
    });
    expect(resolveSuperOddsAction(true)).toEqual({
      variant: 'solid',
      color: 'secondary'
    });
    expect(resolveSuperOddsAction()).toEqual(resolveSuperOddsAction(false));
  });

  it('nao mostra o indicador fora do bilhete', () => {
    const wrapper = mountCard();

    expect(wrapper.find('[data-st-super-odds-active]').exists()).toBe(false);
  });

  it('mostra o indicador no bilhete, antes da data', () => {
    const wrapper = mountCard({
      active: true,
      startDate: '2026-09-10T22:00:00'
    });
    const indicador = wrapper.find('[data-st-super-odds-active]');

    expect(indicador.exists()).toBe(true);
    expect(
      indicador.element.nextElementSibling?.getAttribute(
        'data-st-super-odds-date'
      )
    ).not.toBeUndefined();
  });

  it('usa o badge positivo com pulse, sem texto', () => {
    const indicador = mountCard({ active: true }).find(
      '[data-st-super-odds-active]'
    );

    expect(indicador.text()).toBe('');
    expect(indicador.classes()).toContain('bg-st-positive');
    expect(indicador.find('.animate-ping').exists()).toBe(true);
  });

  it('leva o estado ao leitor de tela pelo rotulo', () => {
    const padrao = mountCard({ active: true }).find(
      '[data-st-super-odds-active]'
    );
    const proprio = mountCard({ active: true, activeLabel: 'Na aposta' }).find(
      '[data-st-super-odds-active]'
    );

    expect(padrao.attributes('role')).toBe('img');
    expect(padrao.attributes('aria-label')).toBe('No bilhete');
    expect(proprio.attributes('aria-label')).toBe('Na aposta');
  });

  it('mantem o icone de destaque nos dois estados', () => {
    expect(mountCard().find('[data-st-super-odds-highlight]').exists()).toBe(
      true
    );
    expect(
      mountCard({ active: true })
        .find('[data-st-super-odds-highlight]')
        .exists()
    ).toBe(true);
  });

  it('troca o botao entre ghost e solido', () => {
    const fora = mountCard();
    const dentro = mountCard({ active: true });

    expect(acao(fora).classes()).toContain('text-st-content-primary');
    expect(acao(fora).classes()).toContain('bg-[--st-color-shadow-1]');
    expect(acao(dentro).classes()).toContain('bg-st-secondary');
    expect(acao(dentro).classes()).not.toContain('bg-[--st-color-shadow-1]');
  });
});

describe('altura igual entre cards', () => {
  it('nao declara altura na raiz, para nao sair do stretch do container', () => {
    // `align-items: stretch` so estica item com altura `auto`: um `h-full`
    // aqui devolveria o card para a altura do proprio conteudo.
    const { root } = buildSuperOddsCardClasses({});

    expect(root).not.toContain('h-full');
    expect(root.split(' ').filter((cls) => cls.startsWith('h-'))).toEqual([]);
  });

  it('faz o corpo absorver a altura extra', () => {
    expect(buildSuperOddsCardClasses({}).body).toContain('flex-1');
  });

  it('empurra o rodape para a base pelo divisor final', () => {
    const classes = buildSuperOddsCardClasses({});

    expect(classes.footerDivider).toContain('mt-auto');
    expect(classes.divider).not.toContain('mt-auto');
  });

  it('mantem o divisor final mesmo sem selecoes', () => {
    const wrapper = mountCard({ selections: [] });

    expect(wrapper.findAll('.mt-auto')).toHaveLength(1);
  });
});

describe('StSuperOddsCard', () => {
  it('monta o cabecalho com tipo, data e destaque', () => {
    const wrapper = mountCard({ startDate: '2026-09-10T22:00:00' });

    expect(wrapper.find('[data-st-super-odds-type]').text()).toContain(
      'Turbinada'
    );
    expect(wrapper.find('[data-st-super-odds-date]').text()).toBe(
      '10/09 • 22:00'
    );
    expect(wrapper.find('[data-st-super-odds-highlight]').exists()).toBe(true);
  });

  it('prioriza a data ja formatada sobre o startDate', () => {
    const wrapper = mountCard({
      date: '11/09 • 16:30',
      startDate: '2026-09-10T22:00:00'
    });

    expect(wrapper.find('[data-st-super-odds-date]').text()).toBe(
      '11/09 • 16:30'
    );
  });

  it('esconde data e destaque quando nao se aplicam', () => {
    const wrapper = mountCard({ hideHighlight: true });

    expect(wrapper.find('[data-st-super-odds-date]').exists()).toBe(false);
    expect(wrapper.find('[data-st-super-odds-highlight]').exists()).toBe(false);
  });

  it('renderiza campeonato, times e escudos', () => {
    const wrapper = mountCard();
    const avatares = wrapper.findAll('[data-st-avatar-content]');

    expect(wrapper.find('[data-st-super-odds-competition]').text()).toBe(
      'Libertadores'
    );
    expect(wrapper.find('[data-st-super-odds-teams]').text()).toContain(
      'Independiente'
    );
    expect(wrapper.find('[data-st-super-odds-teams]').text()).toContain(
      'Flamengo'
    );
    expect(avatares).toHaveLength(2);
    expect(avatares[0].attributes('data-st-avatar-content')).toBe('image');
  });

  it('cai para as iniciais quando o escudo nao vem', () => {
    const wrapper = mountCard({ homeLogo: null, awayLogo: null });
    const avatares = wrapper.findAll('[data-st-avatar-content]');

    expect(avatares[0].attributes('data-st-avatar-content')).toBe('initials');
    expect(avatares[0].text()).toBe('I');
  });

  it('usa o eventName quando nao ha times', () => {
    const wrapper = mountCard({
      home: '',
      away: '',
      eventName: 'Independiente x Flamengo'
    });

    expect(wrapper.find('[data-st-super-odds-teams]').exists()).toBe(false);
    expect(wrapper.find('[data-st-super-odds-event]').text()).toBe(
      'Independiente x Flamengo'
    );
  });

  it('lista as selecoes no stepper visual', () => {
    const wrapper = mountCard();
    const passos = wrapper.findAll('[data-st-accordion-open], li');

    expect(wrapper.find('[data-st-super-odds-selections]').exists()).toBe(true);
    expect(passos.length).toBeGreaterThanOrEqual(3);
    expect(wrapper.text()).toContain('Mais de 0.5');
    expect(wrapper.text()).toContain('Chutes ao gol - Pedro (FLA)');
    expect(wrapper.text()).toContain('Total de escanteios');
  });

  it('nao renderiza o stepper sem selecoes', () => {
    const wrapper = mountCard({ selections: [] });

    expect(wrapper.find('[data-st-super-odds-selections]').exists()).toBe(
      false
    );
  });

  it('mostra a odd original riscada e a turbinada em destaque', () => {
    const wrapper = mountCard();

    expect(acao(wrapper).text()).toContain('2.00');
    expect(acao(wrapper).text()).toContain('3.00');
  });

  it('mostra so a odd quando nao ha turbinada', () => {
    const wrapper = mountCard({ boostedPrice: undefined });

    expect(acao(wrapper).text()).toContain('2.00');
    expect(acao(wrapper).text()).not.toContain('3.00');
  });

  it('emite select no clique do botao', async () => {
    const wrapper = mountCard();

    await acao(wrapper).trigger('click');

    expect(wrapper.emitted('select')).toHaveLength(1);
  });

  it('nao emite select quando desabilitado', async () => {
    const wrapper = mountCard({ disabled: true });

    expect(acao(wrapper).attributes('disabled')).toBeDefined();

    await acao(wrapper).trigger('click');

    expect(wrapper.emitted('select')).toBeUndefined();
  });

  it('permite trocar o selo e a acao pelos slots', () => {
    const wrapper = mountCard(
      {},
      {
        slots: {
          type: '<span class="selo-custom">BB</span>',
          action: '<a class="acao-custom" href="/bilhete">Apostar</a>'
        }
      }
    );

    expect(wrapper.find('.selo-custom').text()).toBe('BB');
    expect(wrapper.find('.acao-custom').exists()).toBe(true);
    expect(acao(wrapper).exists()).toBe(false);
  });

  it('rotula o card pelos times e aceita rotulo proprio', () => {
    expect(mountCard().attributes('aria-label')).toBe(
      'Independiente x Flamengo'
    );
    expect(
      mountCard({ ariaLabel: 'Odd turbinada' }).attributes('aria-label')
    ).toBe('Odd turbinada');
  });

  it('anexa className e encaminha class, style e demais attrs', () => {
    const wrapper = mountCard(
      { className: 'custom-x' },
      {
        attrs: { class: 'attr-x', style: 'max-width: 320px', 'data-id': 'abc' }
      }
    );

    expect(wrapper.classes()).toContain('custom-x');
    expect(wrapper.classes()).toContain('attr-x');
    expect(wrapper.attributes('style')).toContain('max-width: 320px');
    expect(wrapper.attributes('data-id')).toBe('abc');
  });
});
