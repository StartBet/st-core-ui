import { library } from '@fortawesome/fontawesome-svg-core';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import type { StStepperStep } from './StStepper.interface';
import StStepper from './StStepper.vue';
import {
  clampStepIndex,
  resolveStepBulletContent,
  resolveStepperIconSize,
  resolveStepState,
  resolveStepTone
} from './styleStStepper';

library.add(faStar);

const steps: StStepperStep[] = [
  { title: 'Cadastro', description: 'Dados pessoais do jogador.' },
  { title: 'Endereco', description: 'CEP e cidade.' },
  { title: 'Documentos', description: 'Envio dos anexos.' }
];

type StepperExposed = {
  activeIndex: number;
  activeStep: StStepperStep | undefined;
  total: number;
  canGoNext: boolean;
  canGoPrev: boolean;
  goTo: (index: number) => number;
  next: () => number;
  prev: () => number;
  reset: () => number;
};

const mountStepper = (props: Record<string, unknown> = {}) =>
  mount(StStepper, { props: { steps, ...props } });

const exposed = (wrapper: ReturnType<typeof mountStepper>) =>
  wrapper.vm as unknown as StepperExposed;

const states = (wrapper: ReturnType<typeof mountStepper>) =>
  wrapper.findAll('li').map((item) => item.attributes('data-st-step-state'));

const bullets = (wrapper: ReturnType<typeof mountStepper>) =>
  wrapper.findAll('[data-st-step-bullet]');

describe('styleStStepper', () => {
  it('limita o indice ativo ao intervalo de passos', () => {
    expect(clampStepIndex(-3, 3)).toBe(0);
    expect(clampStepIndex(9, 3)).toBe(2);
    expect(clampStepIndex(1.7, 3)).toBe(1);
    expect(clampStepIndex(Number.NaN, 3)).toBe(0);
    expect(clampStepIndex(undefined, 3)).toBe(0);
    expect(clampStepIndex(1, 0)).toBe(0);
  });

  it('resolve o estado de cada passo pelo indice ativo', () => {
    expect(resolveStepState(0, 1)).toBe('completed');
    expect(resolveStepState(1, 1)).toBe('active');
    expect(resolveStepState(2, 1)).toBe('upcoming');
  });

  it('resolve a familia de cor do passo', () => {
    expect(resolveStepTone('active')).toBe('variant');
    expect(resolveStepTone('completed')).toBe('muted');
    expect(resolveStepTone('upcoming')).toBe('idle');
    expect(resolveStepTone('upcoming', true)).toBe('variant');
  });

  it('usa a cor de feedback em todos os passos quando nao e interativo', () => {
    expect(resolveStepTone('completed', false, false)).toBe('variant');
    expect(resolveStepTone('upcoming', false, false)).toBe('variant');
  });

  it('resolve o conteudo do bullet por tamanho e interatividade', () => {
    const step = { title: 'Passo' };

    expect(
      resolveStepBulletContent({ step, state: 'active', position: 2 })
    ).toEqual({ label: '2' });

    expect(
      resolveStepBulletContent({ step, state: 'completed', position: 1 })
    ).toEqual({ icon: 'check' });

    expect(
      resolveStepBulletContent({
        step,
        state: 'active',
        position: 2,
        size: 'small'
      })
    ).toEqual({});

    expect(
      resolveStepBulletContent({
        step,
        state: 'completed',
        position: 1,
        interactive: false
      })
    ).toEqual({ label: '1' });

    expect(
      resolveStepBulletContent({
        step: { title: 'Passo', icon: 'star' },
        state: 'upcoming',
        position: 3,
        interactive: false
      })
    ).toEqual({ icon: 'star' });

    expect(
      resolveStepBulletContent({
        step: { title: 'Passo', label: 'A' },
        state: 'active',
        position: 3
      })
    ).toEqual({ label: 'A' });
  });

  it('deixa o bullet vazio no tamanho small mesmo com icon ou label', () => {
    const cases = [
      { title: 'Passo' },
      { title: 'Passo', icon: 'star' },
      { title: 'Passo', label: 'A' }
    ];

    cases.forEach((step) => {
      expect(
        resolveStepBulletContent({
          step,
          state: 'completed',
          position: 1,
          size: 'small'
        })
      ).toEqual({});
    });
  });

  it('resolve o tamanho do icone do bullet', () => {
    expect(resolveStepperIconSize()).toBe(3);
    expect(resolveStepperIconSize('medium')).toBe(3);
    expect(resolveStepperIconSize('small')).toBe(2);
  });
});

describe('StStepper', () => {
  it('renderiza uma lista de passos com o primeiro ativo por padrao', () => {
    const wrapper = mountStepper();

    expect(wrapper.element.tagName).toBe('OL');
    expect(wrapper.attributes('aria-label')).toBe('Progresso das etapas');
    expect(wrapper.findAll('li')).toHaveLength(3);
    expect(states(wrapper)).toEqual(['active', 'upcoming', 'upcoming']);
    expect(wrapper.findAll('li')[0].attributes('aria-current')).toBe('step');
  });

  it('nao renderiza nada quando nao existem passos', () => {
    const wrapper = mount(StStepper, { props: { steps: [] } });

    expect(wrapper.find('ol').exists()).toBe(false);
  });

  it('desativa os passos anteriores quando o ativo nao e o primeiro', () => {
    const wrapper = mountStepper({ modelValue: 2 });

    expect(states(wrapper)).toEqual(['completed', 'completed', 'active']);
    expect(bullets(wrapper)[0].classes()).toContain('bg-st-content-disable');
    expect(bullets(wrapper)[1].classes()).toContain('bg-st-content-disable');
  });

  it('exibe icone de check nos passos concluidos e a posicao nos demais', () => {
    const wrapper = mountStepper({ modelValue: 1 });
    const list = bullets(wrapper);

    expect(list[0].find('svg').exists()).toBe(true);
    expect(list[1].text()).toBe('2');
    expect(list[2].text()).toBe('3');
  });

  it('mantem a posicao numerica quando completedIcon esta vazio', () => {
    const wrapper = mountStepper({ modelValue: 1, completedIcon: '' });

    expect(bullets(wrapper)[0].text()).toBe('1');
  });

  it('usa label e icone informados no passo', () => {
    const wrapper = mount(StStepper, {
      props: {
        steps: [
          { title: 'Com label', label: 'A' },
          { title: 'Com icone', icon: 'star' }
        ]
      }
    });
    const list = bullets(wrapper);

    expect(list[0].text()).toBe('A');
    expect(list[1].find('svg').exists()).toBe(true);
  });

  it('aplica a cor de feedback do passo ativo', () => {
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
      const wrapper = mountStepper({ variant });
      expect(bullets(wrapper)[0].classes()).toContain(expected);
    });
  });

  it('respeita a cor de feedback declarada no passo', () => {
    const wrapper = mount(StStepper, {
      props: {
        steps: [
          { title: 'Ativo' },
          { title: 'Erro', variant: 'negative' as const }
        ]
      }
    });

    expect(bullets(wrapper)[0].classes()).toContain('bg-st-primary');
    expect(bullets(wrapper)[1].classes()).toContain('bg-st-negative');
  });

  it('limita o modelValue recebido ao total de passos', () => {
    expect(states(mountStepper({ modelValue: 90 }))).toEqual([
      'completed',
      'completed',
      'active'
    ]);
    expect(states(mountStepper({ modelValue: -4 }))).toEqual([
      'active',
      'upcoming',
      'upcoming'
    ]);
  });

  it('na horizontal mantem a descricao fora do fluxo e dentro do tooltip', async () => {
    const wrapper = mountStepper();

    expect(wrapper.find('[data-st-step-description]').exists()).toBe(false);
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false);

    await wrapper.find('[data-st-step-tooltip="0"]').trigger('mouseenter');

    expect(wrapper.find('[role="tooltip"]').text()).toBe(
      'Dados pessoais do jogador.'
    );
  });

  it('na vertical mostra a descricao como texto corrido abaixo do titulo', async () => {
    const wrapper = mountStepper({ orientation: 'vertical' });
    const descriptions = wrapper.findAll('[data-st-step-description]');

    expect(descriptions).toHaveLength(3);
    expect(descriptions[0].text()).toBe('Dados pessoais do jogador.');

    await wrapper.find('[data-st-step-tooltip="0"]').trigger('mouseenter');

    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false);
  });

  it('emite o passo ativo ao selecionar um passo', async () => {
    const wrapper = mountStepper();

    await wrapper.findAll('button')[2].trigger('click');

    expect(wrapper.emitted('update:modelValue')).toEqual([[2]]);
    expect(wrapper.emitted('change')).toEqual([[2, steps[2]]]);
    expect(wrapper.emitted('step-click')).toEqual([[2, steps[2]]]);
    expect(states(wrapper)).toEqual(['completed', 'completed', 'active']);
  });

  it('nao emite mudanca ao clicar no passo ja ativo', async () => {
    const wrapper = mountStepper();

    await wrapper.findAll('button')[0].trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(wrapper.emitted('change')).toBeUndefined();
    expect(wrapper.emitted('step-click')).toEqual([[0, steps[0]]]);
  });

  it('bloqueia a selecao de passos desabilitados', async () => {
    const wrapper = mount(StStepper, {
      props: {
        steps: [{ title: 'Um' }, { title: 'Dois', disabled: true }]
      }
    });
    const disabledStep = wrapper.findAll('li')[1];

    expect(disabledStep.find('button').exists()).toBe(false);

    await disabledStep.find('div').trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('avanca e regride pelas funcoes expostas', async () => {
    const wrapper = mountStepper();
    const api = exposed(wrapper);

    expect(api.canGoPrev).toBe(false);
    expect(api.canGoNext).toBe(true);

    api.next();
    await wrapper.vm.$nextTick();

    expect(exposed(wrapper).activeIndex).toBe(1);
    expect(exposed(wrapper).activeStep).toEqual(steps[1]);
    expect(states(wrapper)).toEqual(['completed', 'active', 'upcoming']);

    api.prev();
    await wrapper.vm.$nextTick();

    expect(exposed(wrapper).activeIndex).toBe(0);

    api.goTo(2);
    await wrapper.vm.$nextTick();

    expect(exposed(wrapper).activeIndex).toBe(2);
    expect(exposed(wrapper).canGoNext).toBe(false);

    api.reset();
    await wrapper.vm.$nextTick();

    expect(exposed(wrapper).activeIndex).toBe(0);
    expect(exposed(wrapper).total).toBe(3);
  });

  it('nao passa dos limites ao avancar ou regredir', async () => {
    const wrapper = mountStepper({ modelValue: 2 });

    exposed(wrapper).next();
    await wrapper.vm.$nextTick();

    expect(exposed(wrapper).activeIndex).toBe(2);
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('sincroniza com o modelValue recebido do pai', async () => {
    const wrapper = mountStepper();

    await wrapper.setProps({ modelValue: 2 });

    expect(exposed(wrapper).activeIndex).toBe(2);
  });

  it('reajusta o passo ativo quando a lista diminui', async () => {
    const wrapper = mountStepper({ modelValue: 2 });

    await wrapper.setProps({ steps: steps.slice(0, 2) });

    expect(exposed(wrapper).activeIndex).toBe(1);
  });

  it('fica apenas visual quando interactive e false', async () => {
    const wrapper = mountStepper({ interactive: false, modelValue: 1 });
    const api = exposed(wrapper);

    expect(wrapper.findAll('button')).toHaveLength(0);
    expect(api.canGoNext).toBe(false);
    expect(api.canGoPrev).toBe(false);

    api.next();
    api.prev();
    api.goTo(2);
    await wrapper.vm.$nextTick();

    expect(exposed(wrapper).activeIndex).toBe(1);
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(states(wrapper)).toEqual(['completed', 'active', 'upcoming']);
  });

  it('nao mostra status quando interactive e false', () => {
    const wrapper = mountStepper({ interactive: false, modelValue: 1 });

    bullets(wrapper).forEach((bullet, index) => {
      expect(bullet.text()).toBe(String(index + 1));
      expect(bullet.find('svg').exists()).toBe(false);
      expect(bullet.classes()).toContain('bg-st-primary');
    });

    wrapper.findAll('span[aria-hidden="true"]').forEach((connector) => {
      expect(connector.classes()).toContain('bg-st-border-2');
    });

    expect(wrapper.find('[aria-current="step"]').exists()).toBe(false);
  });

  it('mantem a variant escolhida em todos os passos do modo visual', () => {
    const wrapper = mountStepper({
      interactive: false,
      variant: 'positive',
      modelValue: 2
    });

    bullets(wrapper).forEach((bullet) => {
      expect(bullet.classes()).toContain('bg-st-positive');
    });
  });

  it('renderiza o tamanho medium por padrao', () => {
    const wrapper = mountStepper();

    expect(bullets(wrapper)[0].classes()).toContain('h-st-4');
    expect(bullets(wrapper)[0].classes()).toContain('text-st-base');
    expect(
      wrapper.findAll('li')[0].find('span[aria-hidden="true"]').classes()
    ).toContain('top-[15px]');
  });

  it('reduz bullet, fonte e conector no tamanho small', () => {
    const wrapper = mountStepper({ size: 'small', modelValue: 1 });
    const list = bullets(wrapper);

    expect(list[1].classes()).toContain('h-st-1');
    expect(list[1].classes()).toContain('w-st-1');
    expect(list[1].classes()).toContain('text-st-xs');
    expect(
      wrapper.findAll('li')[1].find('span[aria-hidden="true"]').classes()
    ).toContain('top-[3px]');
  });

  it('deixa o bullet solido no tamanho small, sem numero nem icone', () => {
    const interactiveStepper = mountStepper({ size: 'small', modelValue: 1 });
    const visualStepper = mountStepper({
      size: 'small',
      modelValue: 1,
      interactive: false
    });

    [interactiveStepper, visualStepper].forEach((wrapper) => {
      bullets(wrapper).forEach((bullet) => {
        expect(bullet.text()).toBe('');
        expect(bullet.find('svg').exists()).toBe(false);
      });
    });
  });

  it('mantem a posicao numerica no medium apenas visual', () => {
    const wrapper = mountStepper({ interactive: false, modelValue: 2 });

    expect(bullets(wrapper).map((bullet) => bullet.text())).toEqual([
      '1',
      '2',
      '3'
    ]);
  });

  it('aplica o tamanho small no titulo e na descricao', () => {
    const wrapper = mountStepper({ size: 'small', orientation: 'vertical' });

    expect(
      wrapper.findAll('li')[0].find('[data-st-step-description]').classes()
    ).toContain('text-st-xs');
  });

  it('centraliza o bullet com a primeira linha do titulo na vertical', () => {
    const medium = mountStepper({ orientation: 'vertical' });
    const small = mountStepper({ orientation: 'vertical', size: 'small' });

    expect(bullets(medium)[0].classes()).toContain('mt-0');
    expect(bullets(small)[0].classes()).toContain('mt-[5px]');
  });

  it('nao desloca o bullet na horizontal', () => {
    const small = mountStepper({ size: 'small' });

    expect(bullets(small)[0].classes()).not.toContain('mt-[5px]');
  });

  it('usa conector vertical alinhado ao bullet em cada tamanho', () => {
    const medium = mountStepper({ orientation: 'vertical' });
    const small = mountStepper({ orientation: 'vertical', size: 'small' });

    const mediumConnector = medium.find('span[aria-hidden="true"]').classes();
    const smallConnector = small.find('span[aria-hidden="true"]').classes();

    expect(mediumConnector).toContain('left-[15px]');
    expect(mediumConnector).toContain('top-st-4');
    expect(mediumConnector).toContain('bottom-0');
    expect(smallConnector).toContain('left-[3px]');
    expect(smallConnector).toContain('top-[13px]');
    expect(smallConnector).toContain('bottom-[-5px]');
  });

  it('renderiza a orientacao vertical com conector vertical', () => {
    const wrapper = mountStepper({ orientation: 'vertical' });

    expect(wrapper.classes()).toContain('flex-col');
    expect(wrapper.find('span[aria-hidden="true"]').classes()).toContain(
      'left-[15px]'
    );
  });

  it('marca os conectores concluidos ate o passo ativo', () => {
    const wrapper = mountStepper({ modelValue: 1 });
    const connectors = wrapper
      .findAll('li')[1]
      .findAll('span[aria-hidden="true"]');

    expect(connectors[0].classes()).toContain('bg-st-content-disable');
    expect(connectors[1].classes()).toContain('bg-st-border-2');
  });

  it('anexa className e stepClassName', () => {
    const wrapper = mountStepper({
      className: 'custom-root',
      stepClassName: 'custom-step'
    });

    expect(wrapper.classes()).toContain('custom-root');
    expect(wrapper.findAll('li')[0].classes()).toContain('custom-step');
  });

  it('encaminha class, style e demais attrs para a lista', () => {
    const wrapper = mount(StStepper, {
      props: { steps },
      attrs: {
        class: 'attr-x',
        style: 'max-width: 320px',
        'data-testid': 'stepper'
      }
    });

    expect(wrapper.attributes('class')).toContain('attr-x');
    expect(wrapper.attributes('style')).toContain('max-width: 320px');
    expect(wrapper.attributes('data-testid')).toBe('stepper');
  });
});
