import type { Meta, StoryObj } from '@storybook/vue3';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronRight, faPlus } from '@fortawesome/free-solid-svg-icons';

import StButton from './StButton.vue';

const variantOptions = ['solid', 'outline', 'text'] as const;
const colorOptions = ['primary', 'secondary', 'positive', 'negative'] as const;
const sizeOptions = ['small', 'medium', 'large'] as const;

library.add(faPlus, faChevronRight);

const meta = {
  title: 'Components/StButton',
  component: StButton,
  tags: ['autodocs'],
  args: {
    variant: 'solid',
    size: 'medium',
    color: 'primary',
    fullWidth: false,
    type: 'button',
    disabled: false,
    iconLeft: undefined,
    iconRight: undefined,
    className: ''
  },
  argTypes: {
    variant: {
      control: 'select',
      options: variantOptions
    },
    size: {
      control: 'radio',
      options: sizeOptions
    },
    color: {
      control: 'select',
      options: colorOptions
    },
    fullWidth: {
      control: 'boolean'
    },
    type: {
      control: 'radio',
      options: ['button', 'submit', 'reset']
    },
    disabled: {
      control: 'boolean'
    },
    iconLeft: {
      control: 'text'
    },
    iconRight: {
      control: 'text'
    },
    className: {
      control: 'text'
    },
    value: {
      control: 'text'
    }
  },
  render: (args) => ({
    components: { StButton },
    setup() {
      return { args };
    },
    template: `
      <div class="max-w-4xl">
        <StButton v-bind="args">Button</StButton>
      </div>
    `
  })
} satisfies Meta<typeof StButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => ({
    components: { StButton },
    setup() {
      return { variantOptions, colorOptions };
    },
    template: `
      <div class="flex flex-col gap-st-3">
        <div
          v-for="variant in variantOptions"
          :key="variant"
          class="flex flex-wrap items-center gap-st-2"
        >
          <StButton
            v-for="color in colorOptions"
            :key="variant + color"
            :variant="variant"
            :color="color"
          >
            {{ variant }} / {{ color }}
          </StButton>
        </div>
      </div>
    `
  })
};

export const Sizes: Story = {
  render: () => ({
    components: { StButton },
    setup() {
      return { sizeOptions };
    },
    template: `
      <div class="flex flex-wrap items-center gap-st-3">
        <StButton
          v-for="size in sizeOptions"
          :key="size"
          :size="size"
        >
          {{ size }}
        </StButton>
      </div>
    `
  })
};

export const WithAdornments: Story = {
  args: {
    iconLeft: 'plus',
    iconRight: 'chevron-right'
  },
  render: (args) => ({
    components: { StButton },
    setup() {
      return { args };
    },
    template: `
      <StButton v-bind="args">Continuar</StButton>
    `
  })
};

export const IconOnly: Story = {
  args: {
    iconLeft: 'plus'
  },
  render: (args) => ({
    components: { StButton },
    setup() {
      return { args };
    },
    template: `
      <StButton v-bind="args" />
    `
  })
};

export const Disabled: Story = {
  args: {
    disabled: true,
    variant: 'solid',
    color: 'negative'
  },
  render: (args) => ({
    components: { StButton },
    setup() {
      return { args };
    },
    template: `
      <StButton v-bind="args">Desabilitado</StButton>
    `
  })
};
