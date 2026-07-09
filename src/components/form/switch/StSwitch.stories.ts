import type { Meta, StoryObj } from '@storybook/vue3';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCheck,
  faMoon,
  faSun,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import { ref } from 'vue';

import StSwitch from './StSwitch.vue';

library.add(faCheck, faMoon, faSun, faXmark);

const meta = {
  title: 'Components/StSwitch',
  component: StSwitch,
  tags: ['autodocs'],
  args: {
    defaultChecked: false,
    disabled: false,
    label: 'Receber notificações',
    iconOff: undefined,
    iconOn: undefined,
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
    iconOff: {
      control: 'text'
    },
    iconOn: {
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
    components: { StSwitch },
    setup() {
      const checked = ref(Boolean(args.defaultChecked));

      return { args, checked };
    },
    template: `
      <div class="flex flex-col gap-st-3">
        <StSwitch
          v-bind="args"
          @update:checked="checked = $event"
        />
        <span class="text-st-body-small text-st-content-default">
          Estado atual: {{ checked ? 'ligado' : 'desligado' }}
        </span>
      </div>
    `
  })
} satisfies Meta<typeof StSwitch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => ({
    components: { StSwitch },
    template: `
      <div class="flex flex-col gap-st-3">
        <StSwitch label="Unchecked" />
        <StSwitch default-checked label="Checked" />
        <StSwitch disabled label="Disabled" />
        <StSwitch disabled default-checked label="Disabled checked" />
      </div>
    `
  })
};

export const Controlled: Story = {
  render: () => ({
    components: { StSwitch },
    setup() {
      const checked = ref(false);

      return { checked };
    },
    template: `
      <div class="flex flex-col gap-st-3">
        <StSwitch
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

export const WithIcons: Story = {
  render: () => ({
    components: { StSwitch },
    template: `
      <div class="flex flex-col gap-st-3">
        <StSwitch
          label="Confirmação"
          icon-off="xmark"
          icon-on="check"
        />
        <StSwitch
          default-checked
          label="Tema"
          icon-off="moon"
          icon-on="sun"
        />
      </div>
    `
  })
};

export const WithSlot: Story = {
  render: () => ({
    components: { StSwitch },
    template: `
      <div class="flex flex-col gap-st-3">
        <StSwitch>
          <span class="text-st-body-small text-st-content-default">
            Ativar atualização automática de saldo
          </span>
        </StSwitch>
        <StSwitch default-checked>
          <span class="text-st-body-small text-st-content-default">
            Quero receber alertas da plataforma
          </span>
        </StSwitch>
      </div>
    `
  })
};
