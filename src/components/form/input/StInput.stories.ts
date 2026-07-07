import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faIdCard, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';

import StInput from './StInput.vue';

library.add(faUser, faPhone, faIdCard);

const typeOptions = [
  'text',
  'password',
  'email',
  'search',
  'tel',
  'url',
  'number',
  'date',
  'datetime',
  'datetime-local',
  'month',
  'week',
  'time'
] as const;

const meta = {
  title: 'Components/StInput',
  component: StInput,
  tags: ['autodocs'],
  args: {
    defaultValue: '',
    label: 'Nome',
    type: 'text',
    placeholder: 'Digite aqui',
    disabled: false,
    readOnly: false,
    required: false,
    maxLength: undefined,
    className: '',
    icon: undefined,
    messageInfo: '',
    messageDanger: '',
    messageSuccess: '',
    mask: undefined
  },
  argTypes: {
    defaultValue: {
      control: 'text'
    },
    label: {
      control: 'text'
    },
    type: {
      control: 'select',
      options: typeOptions
    },
    placeholder: {
      control: 'text'
    },
    disabled: {
      control: 'boolean'
    },
    readOnly: {
      control: 'boolean'
    },
    required: {
      control: 'boolean'
    },
    maxLength: {
      control: 'number'
    },
    className: {
      control: 'text'
    },
    icon: {
      control: 'text'
    },
    messageInfo: {
      control: 'text'
    },
    messageDanger: {
      control: 'text'
    },
    messageSuccess: {
      control: 'text'
    },
    mask: {
      control: 'radio',
      options: [undefined, 'phone-br', 'cpf']
    },
    value: {
      control: false
    }
  },
  render: (args) => ({
    components: { StInput },
    setup() {
      const value = ref(String(args.defaultValue ?? ''));

      return { args, value };
    },
    template: `
      <div class="max-w-st-64">
        <div class="flex flex-col gap-st-3">
          <StInput
            v-bind="args"
            @update:value="value = String($event)"
          />
          <span class="text-st-body-small text-st-content-default">
            Valor atual: {{ value || 'vazio' }}
          </span>
        </div>
      </div>
    `
  })
} satisfies Meta<typeof StInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => ({
    components: { StInput },
    template: `
      <div class="flex max-w-st-64 flex-col gap-st-4">
        <StInput label="Default" placeholder="Digite aqui" />
        <StInput disabled label="Disabled" default-value="Desabilitado" />
        <StInput read-only label="Read only" default-value="Somente leitura" />
      </div>
    `
  })
};

export const WithMessages: Story = {
  render: () => ({
    components: { StInput },
    template: `
      <div class="flex max-w-st-64 flex-col gap-st-4">
        <StInput
          label="Info"
          placeholder="Campo informativo"
          message-info="Preencha com seu nome completo"
        />
        <StInput
          label="Danger"
          required
          message-danger="Campo obrigatório"
        />
        <StInput
          label="Success"
          default-value="Valor válido"
          message-success="Tudo certo por aqui"
        />
      </div>
    `
  })
};

export const WithMaskAndCounter: Story = {
  render: () => ({
    components: { StInput },
    template: `
      <div class="flex max-w-st-64 flex-col gap-st-4">
        <StInput
          type="tel"
          mask="phone-br"
          icon="phone"
          label="Telefone"
          placeholder="(00) 00000-0000"
        />
        <StInput
          mask="cpf"
          icon="id-card"
          max-length="14"
          label="CPF"
          placeholder="000.000.000-00"
        />
      </div>
    `
  })
};

export const Controlled: Story = {
  render: () => ({
    components: { StInput },
    setup() {
      const value = ref('');

      return { value };
    },
    template: `
      <div class="flex max-w-st-64 flex-col gap-st-3">
        <StInput
          :value="value"
          icon="user"
          label="Campo controlado"
          placeholder="Digite algo"
          @update:value="value = String($event)"
        />
        <span class="text-st-body-small text-st-content-default">
          Valor controlado: {{ value || 'vazio' }}
        </span>
      </div>
    `
  })
};
