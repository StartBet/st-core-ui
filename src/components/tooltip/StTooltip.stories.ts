import { computed, ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import StButton from '../buttons/button/StButton.vue';
import StTooltip from './StTooltip.vue';

const placementOptions = ['top', 'bottom', 'left', 'right'] as const;

const meta = {
  title: 'Components/StTooltip',
  component: StTooltip,
  tags: ['autodocs'],
  args: {
    placement: 'top',
    offset: 8,
    open: false,
    defaultOpen: false,
    disabled: false,
    className: '',
    panelClassName: ''
  },
  argTypes: {
    placement: {
      control: 'radio',
      options: placementOptions
    },
    offset: {
      control: { type: 'number', min: 0, max: 32, step: 1 }
    },
    open: {
      control: 'boolean'
    },
    defaultOpen: {
      control: 'boolean'
    },
    disabled: {
      control: 'boolean'
    },
    className: {
      control: 'text'
    },
    panelClassName: {
      control: 'text'
    },
    triggerProps: {
      control: false
    },
    onOpenChange: {
      control: false
    }
  },
  render: (args) => ({
    components: { StButton, StTooltip },
    setup() {
      const storyArgs = computed(() => {
        const next = { ...args };

        if (next.open === false) {
          delete next.open;
        }

        return next;
      });

      return { storyArgs };
    },
    template: `
      <div class="flex min-h-[14rem] items-center justify-center rounded-st-1 bg-st-surface-2 p-st-6">
        <StTooltip v-bind="storyArgs">
          <template #trigger>
            <StButton type="button" variant="solid" color="primary">
              Passe o mouse
            </StButton>
          </template>

          Tooltip contextual
        </StTooltip>
      </div>
    `
  })
} satisfies Meta<typeof StTooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Placements: Story = {
  render: () => ({
    components: { StButton, StTooltip },
    template: `
      <div class="grid min-h-[22rem] gap-st-6 rounded-st-1 bg-st-surface-2 p-st-6 md:grid-cols-2">
        <div class="flex items-center justify-center">
          <StTooltip placement="top">
            <template #trigger>
              <StButton type="button" variant="solid" color="primary">
                Top
              </StButton>
            </template>
            Tooltip no topo
          </StTooltip>
        </div>

        <div class="flex items-center justify-center">
          <StTooltip placement="right">
            <template #trigger>
              <StButton type="button" variant="solid" color="primary">
                Right
              </StButton>
            </template>
            Tooltip à direita
          </StTooltip>
        </div>

        <div class="flex items-center justify-center">
          <StTooltip placement="bottom">
            <template #trigger>
              <StButton type="button" variant="solid" color="primary">
                Bottom
              </StButton>
            </template>
            Tooltip embaixo
          </StTooltip>
        </div>

        <div class="flex items-center justify-center">
          <StTooltip placement="left">
            <template #trigger>
              <StButton type="button" variant="solid" color="primary">
                Left
              </StButton>
            </template>
            Tooltip à esquerda
          </StTooltip>
        </div>
      </div>
    `
  })
};

export const Controlled: Story = {
  render: () => ({
    components: { StButton, StTooltip },
    setup() {
      const open = ref(false);

      return { open };
    },
    template: `
      <div class="flex min-h-[14rem] flex-col items-center justify-center gap-st-4 rounded-st-1 bg-st-surface-2 p-st-6">
        <StButton @click="open = !open">
          {{ open ? 'Fechar tooltip' : 'Abrir tooltip' }}
        </StButton>

        <StTooltip :open="open" placement="bottom" @update:open="open = $event">
          <template #trigger>
            <StButton type="button" variant="solid" color="primary">
              Trigger controlado
            </StButton>
          </template>

          Tooltip controlado externamente
        </StTooltip>
      </div>
    `
  })
};

export const TriggerProps: Story = {
  render: () => ({
    components: { StTooltip },
    template: `
      <div class="flex min-h-[14rem] items-center justify-center rounded-st-1 bg-st-surface-2 p-st-6">
        <StTooltip
          placement="right"
          :trigger-props="{
            className: 'rounded-st-1 outline outline-1 outline-st-border-2',
            title: 'Ajuda contextual'
          }"
        >
          <template #trigger>
            <span
              tabindex="0"
              class="inline-flex rounded-st-1 bg-st-surface-0 px-st-3 py-st-2 text-st-body-small text-st-content-default"
            >
              Foque ou passe o mouse
            </span>
          </template>

          Tooltip com props extras no trigger
        </StTooltip>
      </div>
    `
  })
};

export const Disabled: Story = {
  render: () => ({
    components: { StButton, StTooltip },
    template: `
      <div class="flex min-h-[14rem] items-center justify-center rounded-st-1 bg-st-surface-2 p-st-6">
        <StTooltip disabled>
          <template #trigger>
            <StButton type="button" variant="solid" color="primary" disabled>
              Tooltip desabilitado
            </StButton>
          </template>

          Este conteúdo não deve abrir
        </StTooltip>
      </div>
    `
  })
};
