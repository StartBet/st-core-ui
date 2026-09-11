import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import StStepper from './StStepper.vue';
import StButton from '../buttons/button/StButton.vue';

library.add(faXmark);

const variantOptions = [
  'primary',
  'secondary',
  'info',
  'system',
  'warning',
  'positive',
  'negative'
] as const;

const steps = [
  {
    title: 'Dados pessoais',
    description: 'Nome completo, CPF e data de nascimento do jogador.'
  },
  {
    title: 'Endereco',
    description: 'CEP, cidade e estado usados na confirmacao de cadastro.'
  },
  {
    title: 'Documentos',
    description: 'Envio da foto do documento e do comprovante de residencia.'
  },
  {
    title: 'Confirmacao',
    description: 'Revisao final antes de concluir o cadastro.'
  }
];

const meta = {
  title: 'Components/StStepper',
  component: StStepper,
  tags: ['autodocs'],
  args: {
    steps,
    modelValue: 1,
    variant: 'primary',
    orientation: 'horizontal',
    size: 'medium',
    interactive: true,
    completedIcon: 'check',
    tooltipPlacement: 'top',
    ariaLabel: 'Progresso das etapas',
    className: '',
    stepClassName: ''
  },
  argTypes: {
    variant: {
      control: 'select',
      options: variantOptions
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical']
    },
    size: {
      control: 'radio',
      options: ['small', 'medium']
    },
    interactive: {
      control: 'boolean'
    },
    modelValue: {
      control: { type: 'number', min: 0, max: 3, step: 1 }
    },
    tooltipPlacement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right']
    },
    completedIcon: {
      control: 'text'
    },
    className: {
      control: 'text'
    },
    stepClassName: {
      control: 'text'
    }
  },
  render: (args) => ({
    components: { StStepper },
    setup() {
      const current = ref(args.modelValue ?? 0);

      return { args, current };
    },
    template: `
      <div class="flex w-full max-w-st-96 flex-col gap-st-3 p-st-3">
        <StStepper v-bind="args" v-model="current" />
        <span class="font-st-body text-st-base text-st-content-default">
          Passo ativo: {{ current }} - {{ args.steps[current]?.title }}
        </span>
      </div>
    `
  })
} satisfies Meta<typeof StStepper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Horizontal: Story = {
  render: () => ({
    components: { StStepper },
    setup() {
      return { steps };
    },
    template: `
      <div class="flex w-full max-w-st-96 flex-col gap-st-6 p-st-3">
        <StStepper :steps="steps" :model-value="0" />
        <StStepper :steps="steps" :model-value="2" />
        <StStepper :steps="steps" :model-value="3" />
      </div>
    `
  })
};

export const Sizes: Story = {
  render: () => ({
    components: { StStepper },
    setup() {
      return { steps };
    },
    template: `
      <div class="flex w-full max-w-st-96 flex-col gap-st-6 p-st-3">
        <StStepper :steps="steps" size="small" :model-value="2" />
        <StStepper :steps="steps" size="medium" :model-value="2" />

        <div class="flex gap-st-8">
          <StStepper
            :steps="steps"
            size="small"
            orientation="vertical"
            :model-value="2"
          />
          <StStepper
            :steps="steps"
            size="medium"
            orientation="vertical"
            :model-value="2"
          />
        </div>
      </div>
    `
  })
};

export const Vertical: Story = {
  render: () => ({
    components: { StStepper },
    setup() {
      return { steps };
    },
    template: `
      <div class="flex w-full max-w-st-64 p-st-3">
        <StStepper :steps="steps" orientation="vertical" :model-value="2" />
      </div>
    `
  })
};

export const ExternalNavigation: Story = {
  render: () => ({
    components: { StStepper, StButton },
    setup() {
      const stepper = ref<InstanceType<typeof StStepper> | null>(null);
      const current = ref(0);

      const advance = () => stepper.value?.next();
      const regress = () => stepper.value?.prev();

      return { steps, stepper, current, advance, regress };
    },
    template: `
      <div class="flex w-full max-w-st-96 flex-col gap-st-3 p-st-3">
        <StStepper ref="stepper" v-model="current" :steps="steps" />

        <div class="flex items-center gap-st-1">
          <StButton
            variant="outline"
            size="small"
            :disabled="!stepper?.canGoPrev"
            @click="regress"
          >
            Voltar
          </StButton>
          <StButton
            size="small"
            :disabled="!stepper?.canGoNext"
            @click="advance"
          >
            Avancar
          </StButton>
        </div>

        <span class="font-st-body text-st-base text-st-content-default">
          Passo ativo: {{ current }} - {{ steps[current]?.title }}
        </span>
      </div>
    `
  })
};

export const VisualOnly: Story = {
  render: () => ({
    components: { StStepper },
    setup() {
      return { steps };
    },
    template: `
      <div class="flex w-full max-w-st-96 flex-col gap-st-6 p-st-3">
        <StStepper :steps="steps" :interactive="false" />
        <StStepper :steps="steps" :interactive="false" size="small" />

        <div class="flex gap-st-8">
          <StStepper
            :steps="steps"
            :interactive="false"
            orientation="vertical"
          />
          <StStepper
            :steps="steps"
            :interactive="false"
            orientation="vertical"
            size="small"
            variant="positive"
          />
        </div>
      </div>
    `
  })
};

export const Variants: Story = {
  render: () => ({
    components: { StStepper },
    setup() {
      return { steps, variantOptions };
    },
    template: `
      <div class="flex w-full max-w-st-96 flex-col gap-st-6 p-st-3">
        <StStepper
          v-for="variant in variantOptions"
          :key="variant"
          :steps="steps"
          :variant="variant"
          :model-value="2"
          :interactive="false"
        />
      </div>
    `
  })
};

export const StepStates: Story = {
  render: () => ({
    components: { StStepper },
    setup() {
      const customSteps = [
        { title: 'Cadastro', description: 'Concluido sem pendencias.' },
        {
          title: 'Pagamento',
          description: 'Cartao recusado pela operadora.',
          variant: 'negative' as const,
          icon: 'xmark'
        },
        {
          title: 'Analise',
          description: 'Aguardando revisao do time de risco.',
          disabled: true
        },
        { title: 'Liberacao', description: 'Conta liberada para apostas.' }
      ];

      return { customSteps };
    },
    template: `
      <div class="flex w-full max-w-st-96 flex-col gap-st-6 p-st-3">
        <StStepper :steps="customSteps" :model-value="2" />
        <StStepper
          :steps="customSteps"
          orientation="vertical"
          :model-value="2"
        />
      </div>
    `
  })
};
