import type { Meta, StoryObj } from '@storybook/vue3';

import StTypography from './StTypography.vue';

const variantOptions = [
  'heading-1',
  'heading-2',
  'heading-3',
  'heading-4',
  'highlight-large',
  'highlight-medium',
  'body-large',
  'body-medium',
  'body-small',
  'hero-title'
] as const;

const elementOptions = ['p', 'h1', 'h2', 'h3', 'h4', 'span', 'div'] as const;

const meta = {
  title: 'Components/StTypography',
  component: StTypography,
  tags: ['autodocs'],
  args: {
    variant: 'body-medium',
    as: 'p',
    italic: false,
    underline: false,
    strikethrough: false,
    uppercase: false,
    lowercase: false,
    capitalize: false,
    truncate: false,
    className: ''
  },
  argTypes: {
    variant: {
      control: 'select',
      options: variantOptions
    },
    as: {
      control: 'select',
      options: elementOptions
    },
    size: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    weight: {
      control: 'select',
      options: [
        'thin',
        'extralight',
        'light',
        'normal',
        'medium',
        'semibold',
        'bold',
        'extrabold',
        'black'
      ]
    },
    family: {
      control: 'radio',
      options: ['body', 'heading', 'highlight', 'display']
    },
    lineHeight: {
      control: 'radio',
      options: ['tight', 'snug', 'normal', 'relaxed', 'loose']
    },
    letterSpacing: {
      control: 'radio',
      options: ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest']
    },
    align: {
      control: 'radio',
      options: ['left', 'center', 'right', 'justify']
    },
    lines: {
      control: 'number'
    },
    maxLines: {
      control: 'number'
    }
  },
  render: (args) => ({
    components: { StTypography },
    setup() {
      return { args };
    },
    template: `
      <div class="max-w-3xl">
        <StTypography v-bind="args">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </StTypography>
      </div>
    `
  })
} satisfies Meta<typeof StTypography>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const HeroTitle: Story = {
  args: {
    as: 'h1',
    variant: 'hero-title',
    lineHeight: 'snug',
    lines: 2
  },
  render: (args) => ({
    components: { StTypography },
    setup() {
      return { args };
    },
    template: `
      <div class="max-w-3xl">
        <StTypography v-bind="args">
          Jogos Populares
        </StTypography>
      </div>
    `
  })
};

export const Variants: Story = {
  render: () => ({
    components: { StTypography },
    setup() {
      return { variantOptions };
    },
    template: `
      <div class="flex max-w-4xl flex-col gap-st-4">
        <StTypography
          v-for="variant in variantOptions"
          :key="variant"
          :as="variant === 'hero-title' ? 'h1' : 'p'"
          :variant="variant"
          :lines="variant === 'hero-title' ? 2 : undefined"
        >
          {{ variant === 'hero-title'
            ? 'A hierarquia tipografica fortalece a identidade visual do produto'
            : 'Exemplo da variante ' + variant }}
        </StTypography>
      </div>
    `
  })
};

export const Overrides: Story = {
  args: {
    as: 'span',
    variant: 'body-small',
    weight: 'bold',
    family: 'highlight',
    lineHeight: 'loose',
    letterSpacing: 'wide',
    uppercase: true
  }
};
