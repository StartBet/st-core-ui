import type { Meta, StoryObj } from '@storybook/vue3';

import StProgressBar from './StProgressBar.vue';

const variantOptions = [
  'primary',
  'secondary',
  'info',
  'system',
  'warning',
  'positive',
  'negative'
] as const;

const meta = {
  title: 'Components/StProgressBar',
  component: StProgressBar,
  tags: ['autodocs'],
  args: {
    variant: 'primary',
    size: 'small',
    percent: 40,
    text: '',
    className: ''
  },
  argTypes: {
    variant: {
      control: 'select',
      options: variantOptions
    },
    size: {
      control: 'radio',
      options: ['small', 'large']
    },
    percent: {
      control: { type: 'range', min: 0, max: 100, step: 1 }
    },
    text: {
      control: 'text'
    },
    className: {
      control: 'text'
    }
  },
  render: (args) => ({
    components: { StProgressBar },
    setup() {
      return { args };
    },
    template: `
      <div class="flex w-full max-w-st-96 flex-col gap-st-2">
        <StProgressBar v-bind="args" />
        <span class="text-st-body-small text-st-content-default">
          Use os controles para validar variante, tamanho, percentual e texto.
        </span>
      </div>
    `
  })
} satisfies Meta<typeof StProgressBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => ({
    components: { StProgressBar },
    setup() {
      return { variantOptions };
    },
    template: `
      <div class="flex w-full max-w-st-96 flex-col gap-st-3">
        <StProgressBar
          v-for="variant in variantOptions"
          :key="variant"
          :variant="variant"
          :percent="65"
          :text="variant"
        />
      </div>
    `
  })
};

export const Sizes: Story = {
  render: () => ({
    components: { StProgressBar },
    template: `
      <div class="flex w-full max-w-st-96 flex-col gap-st-3">
        <StProgressBar size="small" :percent="45" text="Small" />
        <StProgressBar size="large" :percent="45" text="Large" />
      </div>
    `
  })
};

export const Steps: Story = {
  render: () => ({
    components: { StProgressBar },
    setup() {
      return { steps: [0, 25, 50, 75, 100] };
    },
    template: `
      <div class="flex w-full max-w-st-96 flex-col gap-st-3">
        <StProgressBar
          v-for="step in steps"
          :key="step"
          variant="positive"
          size="large"
          :percent="step"
          :text="step + '%'"
        />
      </div>
    `
  })
};

export const WithoutText: Story = {
  render: () => ({
    components: { StProgressBar },
    template: `
      <div class="flex w-full max-w-st-96 flex-col gap-st-3">
        <StProgressBar variant="info" :percent="30" />
        <StProgressBar variant="warning" size="large" :percent="80" />
      </div>
    `
  })
};
