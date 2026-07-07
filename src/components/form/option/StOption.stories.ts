import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import StOption from './StOption.vue';

const meta = {
  title: 'Components/StOption',
  component: StOption,
  tags: ['autodocs'],
  args: {
    value: 'profile',
    selected: false,
    className: ''
  },
  argTypes: {
    value: {
      control: 'text'
    },
    selected: {
      control: 'boolean'
    },
    className: {
      control: 'text'
    },
    onClick: {
      control: false
    }
  },
  render: (args) => ({
    components: { StOption },
    setup() {
      const count = ref(0);
      const handleClick = () => {
        count.value += 1;
      };

      return { args, count, handleClick };
    },
    template: `
      <div class="max-w-st-48">
        <div class="flex flex-col gap-st-3">
          <StOption
            v-bind="args"
            :on-click="handleClick"
          >
            Option
          </StOption>
          <span class="text-st-body-small text-st-content-default">
            Cliques: {{ count }}
          </span>
        </div>
      </div>
    `
  })
} satisfies Meta<typeof StOption>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => ({
    components: { StOption },
    template: `
      <div class="flex max-w-st-48 flex-col gap-st-1">
        <StOption value="default">Default</StOption>
        <StOption value="selected" selected>Selected</StOption>
        <StOption value="custom" class-name="text-st-content-primary">
          Custom class
        </StOption>
      </div>
    `
  })
};

export const WithAdornments: Story = {
  render: () => ({
    components: { StOption },
    template: `
      <div class="flex max-w-st-48 flex-col gap-st-1">
        <StOption value="wallet">
          <template #startAdornment>
            <span class="text-st-body-small text-st-content-primary">R$</span>
          </template>

          Carteira

          <template #endAdornment>
            <span class="text-st-body-small text-st-content-primary">+</span>
          </template>
        </StOption>

        <StOption value="profile" selected>
          <template #startAdornment>
            <span class="text-st-body-small text-st-content-primary">@</span>
          </template>

          Perfil

          <template #endAdornment>
            <span class="text-st-body-small text-st-content-primary">OK</span>
          </template>
        </StOption>
      </div>
    `
  })
};

export const SelectableList: Story = {
  render: () => ({
    components: { StOption },
    setup() {
      const selected = ref('settings');
      const items = [
        { value: 'profile', label: 'Perfil' },
        { value: 'settings', label: 'Configurações' },
        { value: 'logout', label: 'Sair' }
      ];

      return { selected, items };
    },
    template: `
      <div class="flex max-w-st-48 flex-col gap-st-1">
        <StOption
          v-for="item in items"
          :key="item.value"
          :value="item.value"
          :selected="selected === item.value"
          :on-click="() => (selected = item.value)"
        >
          {{ item.label }}
        </StOption>

        <span class="mt-st-2 text-st-body-small text-st-content-default">
          Selecionado: {{ selected }}
        </span>
      </div>
    `
  })
};
