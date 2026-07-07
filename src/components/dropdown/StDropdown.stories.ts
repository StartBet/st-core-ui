import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import StButton from '../buttons/button/StButton.vue';
import StDropdown from './StDropdown.vue';

const placementOptions = ['auto', 'top', 'bottom', 'left', 'right'] as const;
const widthOptions = ['auto', 'full', '32', '40', '48'] as const;

const meta = {
  title: 'Components/StDropdown',
  component: StDropdown,
  tags: ['autodocs'],
  args: {
    placement: 'auto',
    width: 'auto',
    offset: 8,
    defaultOpen: false,
    closeOnOutsideClick: true,
    triggerAsChild: false,
    className: '',
    panelClassName: ''
  },
  argTypes: {
    placement: {
      control: 'radio',
      options: placementOptions
    },
    width: {
      control: 'select',
      options: widthOptions
    },
    offset: {
      control: 'number'
    },
    defaultOpen: {
      control: 'boolean'
    },
    closeOnOutsideClick: {
      control: 'boolean'
    },
    triggerAsChild: {
      control: 'boolean'
    },
    className: {
      control: 'text'
    },
    panelClassName: {
      control: 'text'
    },
    open: {
      control: false
    },
    onOpenChange: {
      control: false
    }
  },
  render: (args) => ({
    components: { StButton, StDropdown },
    setup() {
      return { args };
    },
    template: `
      <div class="min-h-[280px] p-st-6">
        <StDropdown v-bind="args">
          <template #trigger>
            <StButton variant="outline">Abrir menu</StButton>
          </template>

          <div class="flex min-w-st-40 flex-col gap-st-1">
            <button
              type="button"
              class="rounded-st-1 px-st-2 py-st-1 text-left text-st-body-small text-st-content-default hover:bg-st-surface-2"
            >
              Perfil
            </button>
            <button
              type="button"
              class="rounded-st-1 px-st-2 py-st-1 text-left text-st-body-small text-st-content-default hover:bg-st-surface-2"
            >
              Configurações
            </button>
            <button
              type="button"
              class="rounded-st-1 px-st-2 py-st-1 text-left text-st-body-small text-st-content-negative hover:bg-st-surface-negative"
            >
              Sair
            </button>
          </div>
        </StDropdown>
      </div>
    `
  })
} satisfies Meta<typeof StDropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Placements: Story = {
  render: () => ({
    components: { StButton, StDropdown },
    setup() {
      return { placementOptions };
    },
    template: `
      <div class="grid min-h-[520px] grid-cols-2 gap-st-6 p-st-6">
        <div
          v-for="placement in placementOptions"
          :key="placement"
          class="flex items-center justify-center rounded-st-1 border border-st-border-2 bg-st-surface-1 p-st-6"
        >
          <StDropdown
            :placement="placement"
            :default-open="true"
            :close-on-outside-click="false"
          >
            <template #trigger>
              <StButton variant="outline">{{ placement }}</StButton>
            </template>

            <div class="min-w-st-32 text-st-body-small text-st-content-default">
              Placement: {{ placement }}
            </div>
          </StDropdown>
        </div>
      </div>
    `
  })
};

export const FullWidth: Story = {
  args: {
    width: 'full',
    panelClassName: 'p-st-2'
  },
  render: (args) => ({
    components: { StButton, StDropdown },
    setup() {
      return { args };
    },
    template: `
      <div class="max-w-st-64 p-st-6">
        <StDropdown v-bind="args">
          <template #trigger>
            <StButton full-width>Dropdown com largura total</StButton>
          </template>

          <div class="flex flex-col gap-st-2">
            <div class="text-st-body-small text-st-content-default">
              O painel acompanha a largura do trigger.
            </div>
            <div class="rounded-st-1 bg-st-surface-2 p-st-2 text-st-body-small text-st-content-default">
              width="full"
            </div>
          </div>
        </StDropdown>
      </div>
    `
  })
};

export const Controlled: Story = {
  render: () => ({
    components: { StButton, StDropdown },
    setup() {
      const open = ref(false);

      return { open };
    },
    template: `
      <div class="flex min-h-[280px] flex-col items-start gap-st-3 p-st-6">
        <StDropdown :open="open" @update:open="open = $event">
          <template #trigger>
            <StButton>{{ open ? 'Fechar' : 'Abrir' }} menu controlado</StButton>
          </template>

          <div class="min-w-st-40 p-st-1">
            <p class="text-st-body-small text-st-content-default">
              O estado aberto é controlado externamente.
            </p>
          </div>
        </StDropdown>

        <span class="text-st-body-small text-st-content-default">
          Estado atual: {{ open ? 'aberto' : 'fechado' }}
        </span>
      </div>
    `
  })
};

export const TriggerAsChild: Story = {
  render: () => ({
    components: { StButton, StDropdown },
    template: `
      <div class="min-h-[280px] p-st-6">
        <StDropdown trigger-as-child>
          <template #trigger="{ open, toggle, setTriggerEl, attrs }">
            <StButton
              :ref="setTriggerEl"
              variant="outline"
              v-bind="attrs"
              @click="toggle"
            >
              {{ open ? 'Fechar ações' : 'Abrir ações' }}
            </StButton>
          </template>

          <div class="flex min-w-st-40 flex-col gap-st-2 p-st-1">
            <span class="text-st-body-small text-st-content-default">
              Trigger delegado ao slot filho.
            </span>
            <div class="rounded-st-1 bg-st-surface-2 p-st-2 text-st-body-small text-st-content-default">
              Recebe open, toggle, setTriggerEl e attrs.
            </div>
          </div>
        </StDropdown>
      </div>
    `
  })
};
