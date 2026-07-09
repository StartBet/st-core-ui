import type { Meta, StoryObj } from '@storybook/vue3';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faChevronDown,
  faLayerGroup,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { ref } from 'vue';

import StOption from '../option/StOption.vue';
import StSelect from './StSelect.vue';

library.add(faChevronDown, faLayerGroup, faUser);

const placementOptions = ['auto', 'top', 'bottom', 'left', 'right'] as const;

const optionItems = [
  { name: 'Esportes', value: 'sports' },
  { name: 'Cassino', value: 'casino' },
  { name: 'Poker', value: 'poker' }
];

const meta = {
  title: 'Components/StSelect',
  component: StSelect,
  tags: ['autodocs'],
  args: {
    defaultValue: '',
    label: 'Categoria',
    placeholder: 'Selecione uma opção',
    disabled: false,
    readOnly: false,
    required: false,
    icon: undefined,
    closeOnSelect: true,
    placement: 'auto',
    offset: 8,
    className: '',
    panelClassName: '',
    messageInfo: undefined,
    messageDanger: undefined,
    messageSuccess: undefined
  },
  argTypes: {
    defaultValue: {
      control: 'text'
    },
    label: {
      control: 'text'
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
    icon: {
      control: 'text'
    },
    closeOnSelect: {
      control: 'boolean'
    },
    placement: {
      control: 'radio',
      options: placementOptions
    },
    offset: {
      control: 'number'
    },
    className: {
      control: 'text'
    },
    panelClassName: {
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
    options: {
      control: false
    },
    value: {
      control: false
    },
    onValueChange: {
      control: false
    },
    name: {
      control: false
    }
  },
  render: (args) => ({
    components: { StSelect },
    setup() {
      const value = ref(String(args.defaultValue ?? ''));

      return { args, value, optionItems };
    },
    template: `
      <div class="max-w-st-64">
        <StSelect
          v-bind="args"
          :value="value"
          :options="optionItems"
          @update:value="value = String($event)"
        />
      </div>
    `
  })
} satisfies Meta<typeof StSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithOptions: Story = {
  args: {
    defaultValue: 'casino'
  },
  render: () => ({
    components: { StSelect },
    setup() {
      return { optionItems };
    },
    template: `
      <div class="max-w-st-64">
        <StSelect
          label="Produto"
          default-value="casino"
          :options="optionItems"
        />
      </div>
    `
  })
};

export const WithSlotOptions: Story = {
  render: () => ({
    components: { StOption, StSelect },
    template: `
      <div class="max-w-st-64">
        <StSelect label="Navegação" placeholder="Selecione uma seção">
          <StOption value="profile">
            <template #startAdornment>
              <span class="text-st-content-primary">P</span>
            </template>
            Perfil
          </StOption>
          <StOption value="wallet">
            <template #startAdornment>
              <span class="text-st-content-primary">W</span>
            </template>
            Carteira
          </StOption>
          <StOption value="settings">
            <template #startAdornment>
              <span class="text-st-content-primary">S</span>
            </template>
            Configurações
          </StOption>
        </StSelect>
      </div>
    `
  })
};

export const Controlled: Story = {
  render: () => ({
    components: { StSelect },
    setup() {
      const value = ref('sports');

      return { value, optionItems };
    },
    template: `
      <div class="flex max-w-st-64 flex-col gap-st-3">
        <StSelect
          :value="value"
          label="Modo controlado"
          :options="optionItems"
          @update:value="value = String($event)"
        />
        <span class="text-st-body-small text-st-content-default">
          Valor atual: {{ value }}
        </span>
      </div>
    `
  })
};

export const WithIconAndMessages: Story = {
  args: {
    icon: 'layer-group',
    messageInfo: 'Selecione a categoria do usuário'
  },
  render: (args) => ({
    components: { StSelect },
    setup() {
      return { args, optionItems };
    },
    template: `
      <div class="flex max-w-st-64 flex-col gap-st-3">
        <StSelect
          v-bind="args"
          label="Categoria"
          :options="optionItems"
        />
        <StSelect
          icon="user"
          label="Perfil obrigatório"
          required
          message-danger="Seleção obrigatória"
          :options="optionItems"
        />
      </div>
    `
  })
};
