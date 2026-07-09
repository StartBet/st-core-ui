import type { Meta, StoryObj } from '@storybook/vue3';

import StLoading from './StLoading.vue';

const typeOptions = ['arrow', 'spinner', 'cyclical'] as const;
const variantOptions = ['primary', 'secondary', 'tertiary'] as const;
const sizeOptions = ['3', '4', '6', '8'] as const;

const meta = {
  title: 'Components/StLoading',
  component: StLoading,
  tags: ['autodocs'],
  args: {
    type: 'arrow',
    variant: 'primary',
    size: '8',
    value: 72,
    className: ''
  },
  argTypes: {
    type: {
      control: 'radio',
      options: typeOptions
    },
    variant: {
      control: 'radio',
      options: variantOptions
    },
    size: {
      control: 'select',
      options: sizeOptions
    },
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 }
    },
    className: {
      control: 'text'
    }
  },
  render: (args) => ({
    components: { StLoading },
    setup() {
      return { args };
    },
    template: `
      <div class="flex items-center gap-st-3">
        <StLoading v-bind="args" />
        <span class="text-st-body-small text-st-content-default">
          Use os controles para validar tipo, tamanho, variante e progresso.
        </span>
      </div>
    `
  })
} satisfies Meta<typeof StLoading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Types: Story = {
  render: () => ({
    components: { StLoading },
    template: `
      <div class="flex flex-wrap items-center gap-st-4">
        <div class="flex flex-col items-center gap-st-2 rounded-st-1 bg-st-surface-2 px-st-3 py-st-3">
          <StLoading type="arrow" size="8" />
          <span class="text-st-body-small text-st-content-default">arrow</span>
        </div>
        <div class="flex flex-col items-center gap-st-2 rounded-st-1 bg-st-surface-2 px-st-3 py-st-3">
          <StLoading type="spinner" size="8" />
          <span class="text-st-body-small text-st-content-default">spinner</span>
        </div>
        <div class="flex flex-col items-center gap-st-2 rounded-st-1 bg-st-surface-2 px-st-3 py-st-3">
          <StLoading type="cyclical" size="8" :value="72" />
          <span class="text-st-body-small text-st-content-default">cyclical</span>
        </div>
      </div>
    `
  })
};

export const Sizes: Story = {
  render: () => ({
    components: { StLoading },
    setup() {
      return { sizeOptions };
    },
    template: `
      <div class="flex flex-wrap items-end gap-st-4">
        <div
          v-for="size in sizeOptions"
          :key="size"
          class="flex flex-col items-center gap-st-2 rounded-st-1 bg-st-surface-2 px-st-3 py-st-3"
        >
          <StLoading type="spinner" :size="size" />
          <span class="text-st-body-small text-st-content-default">{{ size }}</span>
        </div>
      </div>
    `
  })
};

export const Variants: Story = {
  render: () => ({
    components: { StLoading },
    template: `
      <div class="flex flex-wrap items-center gap-st-4">
        <div class="flex flex-col items-center gap-st-2 rounded-st-1 bg-st-surface-2 px-st-3 py-st-3">
          <StLoading type="arrow" variant="primary" size="8" />
          <span class="text-st-body-small text-st-content-default">primary</span>
        </div>
        <div class="flex flex-col items-center gap-st-2 rounded-st-1 bg-st-surface-2 px-st-3 py-st-3">
          <StLoading type="arrow" variant="secondary" size="8" />
          <span class="text-st-body-small text-st-content-default">secondary</span>
        </div>
        <div class="flex flex-col items-center gap-st-2 rounded-st-1 bg-st-surface-2 px-st-3 py-st-3">
          <StLoading type="arrow" variant="tertiary" size="8" />
          <span class="text-st-body-small text-st-content-default">tertiary</span>
        </div>
      </div>
    `
  })
};

export const Progress: Story = {
  render: () => ({
    components: { StLoading },
    template: `
      <div class="flex flex-wrap items-center gap-st-4">
        <div class="flex flex-col items-center gap-st-2 rounded-st-1 bg-st-surface-2 px-st-3 py-st-3">
          <StLoading type="cyclical" size="8" :value="15" />
          <span class="text-st-body-small text-st-content-default">15%</span>
        </div>
        <div class="flex flex-col items-center gap-st-2 rounded-st-1 bg-st-surface-2 px-st-3 py-st-3">
          <StLoading type="cyclical" size="8" :value="45" />
          <span class="text-st-body-small text-st-content-default">45%</span>
        </div>
        <div class="flex flex-col items-center gap-st-2 rounded-st-1 bg-st-surface-2 px-st-3 py-st-3">
          <StLoading type="cyclical" size="8" :value="85" />
          <span class="text-st-body-small text-st-content-default">85%</span>
        </div>
      </div>
    `
  })
};
