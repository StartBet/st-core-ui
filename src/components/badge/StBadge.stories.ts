import type { Meta, StoryObj } from '@storybook/vue3';

import StBadge from './StBadge.vue';

const variantOptions = [
  'info',
  'system',
  'warning',
  'positive',
  'negative'
] as const;

const meta = {
  title: 'Components/StBadge',
  component: StBadge,
  tags: ['autodocs'],
  args: {
    variant: 'info',
    size: 'small',
    value: undefined,
    pulse: false,
    className: ''
  },
  argTypes: {
    variant: {
      control: 'select',
      options: variantOptions
    },
    size: {
      control: 'radio',
      options: ['small', 'medium']
    },
    value: {
      control: 'text'
    },
    pulse: {
      control: 'boolean'
    },
    className: {
      control: 'text'
    }
  },
  render: (args) => ({
    components: { StBadge },
    setup() {
      return { args };
    },
    template: `
      <div class="flex items-center gap-st-3">
        <StBadge v-bind="args" />
        <span class="text-st-body-small text-st-content-default">
          Use os controles para validar variante, tamanho, valor e pulse.
        </span>
      </div>
    `
  })
} satisfies Meta<typeof StBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Dots: Story = {
  render: () => ({
    components: { StBadge },
    setup() {
      return { variantOptions };
    },
    template: `
      <div class="flex flex-wrap items-center gap-st-3">
        <div
          v-for="variant in variantOptions"
          :key="variant"
          class="flex items-center gap-st-2 rounded-st-1 bg-st-surface-2 px-st-2 py-st-1"
        >
          <StBadge :variant="variant" />
          <span class="text-st-body-small text-st-content-default">{{ variant }}</span>
        </div>
      </div>
    `
  })
};

export const Values: Story = {
  render: () => ({
    components: { StBadge },
    template: `
      <div class="flex flex-wrap items-center gap-st-3">
        <div class="flex items-center gap-st-2 rounded-st-1 bg-st-surface-2 px-st-2 py-st-1">
          <StBadge variant="info" :value="7" />
          <span class="text-st-body-small text-st-content-default">Numero</span>
        </div>
        <div class="flex items-center gap-st-2 rounded-st-1 bg-st-surface-2 px-st-2 py-st-1">
          <StBadge variant="negative" :value="120" />
          <span class="text-st-body-small text-st-content-default">99+</span>
        </div>
        <div class="flex items-center gap-st-2 rounded-st-1 bg-st-surface-2 px-st-2 py-st-1">
          <StBadge variant="system" value="LIVE" />
          <span class="text-st-body-small text-st-content-default">String</span>
        </div>
      </div>
    `
  })
};

export const Pulse: Story = {
  render: () => ({
    components: { StBadge },
    template: `
      <div class="flex flex-wrap items-center gap-st-4">
        <div class="flex items-center gap-st-2">
          <StBadge variant="positive" pulse />
          <span class="text-st-body-small text-st-content-default">Dot com pulse</span>
        </div>
        <div class="flex items-center gap-st-2">
          <StBadge variant="warning" size="medium" :value="3" pulse />
          <span class="text-st-body-small text-st-content-default">Value com pulse</span>
        </div>
      </div>
    `
  })
};
