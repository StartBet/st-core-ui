import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import StCheckbox from './StCheckbox.vue';

const meta = {
  title: 'Components/StCheckbox',
  component: StCheckbox,
  tags: ['autodocs'],
  args: {
    defaultChecked: false,
    disabled: false,
    label: 'Aceito os termos',
    className: ''
  },
  argTypes: {
    defaultChecked: {
      control: 'boolean'
    },
    disabled: {
      control: 'boolean'
    },
    label: {
      control: 'text'
    },
    className: {
      control: 'text'
    },
    checked: {
      control: false
    }
  },
  render: (args) => ({
    components: { StCheckbox },
    setup() {
      const checked = ref(Boolean(args.defaultChecked));

      return { args, checked };
    },
    template: `
      <div class="flex flex-col gap-st-3">
        <StCheckbox
          v-bind="args"
          @update:checked="checked = $event"
        />
        <span class="text-st-body-small text-st-content-default">
          Estado atual: {{ checked ? 'marcado' : 'desmarcado' }}
        </span>
      </div>
    `
  })
} satisfies Meta<typeof StCheckbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => ({
    components: { StCheckbox },
    template: `
      <div class="flex flex-col gap-st-3">
        <StCheckbox label="Unchecked" />
        <StCheckbox default-checked label="Checked" />
        <StCheckbox disabled label="Disabled" />
        <StCheckbox disabled default-checked label="Disabled checked" />
      </div>
    `
  })
};

export const Controlled: Story = {
  render: () => ({
    components: { StCheckbox },
    setup() {
      const checked = ref(false);

      return { checked };
    },
    template: `
      <div class="flex flex-col gap-st-3">
        <StCheckbox
          :checked="checked"
          label="Modo controlado"
          @update:checked="checked = $event"
        />
        <span class="text-st-body-small text-st-content-default">
          Valor controlado: {{ checked }}
        </span>
      </div>
    `
  })
};

export const WithSlot: Story = {
  render: () => ({
    components: { StCheckbox },
    template: `
      <div class="flex flex-col gap-st-3">
        <StCheckbox>
          <span class="text-st-body-small text-st-content-default">
            Quero receber novidades por e-mail
          </span>
        </StCheckbox>
        <StCheckbox default-checked>
          <span class="text-st-body-small text-st-content-default">
            Confirmo que li as políticas da plataforma
          </span>
        </StCheckbox>
      </div>
    `
  })
};
