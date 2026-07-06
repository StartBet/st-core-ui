import type { Meta, StoryObj } from '@storybook/vue3';

import StPaper from './StPaper.vue';

const variantOptions = [
  'surface-0',
  'surface-1',
  'surface-2',
  'surface-3',
  'surface-4',
  'surface-info',
  'surface-system',
  'surface-warning',
  'surface-positive',
  'surface-negative',
  'surface-primary',
  'surface-secondary'
] as const;

const borderOptions = [
  'none',
  '1',
  '2',
  '3',
  'primary',
  'secondary',
  'info',
  'system',
  'warning',
  'positive',
  'negative'
] as const;

const sizeOptions = [
  'auto',
  'full',
  'fit-content',
  'min-content',
  'max-content',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '16',
  '20',
  '24',
  '32',
  '40',
  '48',
  '56',
  '64',
  '72',
  '80',
  '96',
  '128',
  '144',
  '160',
  '168',
  '240'
] as const;

const meta = {
  title: 'Components/StPaper',
  component: StPaper,
  tags: ['autodocs'],
  args: {
    as: 'div',
    variant: 'surface-1',
    border: 'none',
    borderRadius: '1',
    elevation: 1,
    interactive: false,
    padding: '3',
    className: ''
  },
  argTypes: {
    as: {
      control: 'select',
      options: ['div', 'section', 'article', 'button']
    },
    variant: {
      control: 'select',
      options: variantOptions
    },
    border: {
      control: 'select',
      options: borderOptions
    },
    borderRadius: {
      control: 'radio',
      options: ['none', '1', '2']
    },
    elevation: {
      control: 'radio',
      options: [0, 1, 2, 3, 4]
    },
    interactive: {
      control: 'boolean'
    },
    width: {
      control: 'select',
      options: sizeOptions
    },
    height: {
      control: 'select',
      options: sizeOptions
    },
    padding: {
      control: 'text'
    },
    paddingSm: {
      control: 'text'
    },
    paddingMd: {
      control: 'text'
    },
    paddingLg: {
      control: 'text'
    },
    margin: {
      control: 'text'
    },
    marginSm: {
      control: 'text'
    },
    marginMd: {
      control: 'text'
    },
    marginLg: {
      control: 'text'
    },
    bgImage: {
      control: 'text'
    }
  },
  render: (args) => ({
    components: { StPaper },
    setup() {
      return { args };
    },
    template: `
      <div class="max-w-4xl">
        <StPaper v-bind="args">
          <div class="flex flex-col gap-st-2">
            <strong class="text-st-content-default">Conteudo do paper</strong>
            <span class="text-st-body-small text-st-content-default">
              Use os controles para validar background, borda, sombra e espacamentos.
            </span>
          </div>
        </StPaper>
      </div>
    `
  })
} satisfies Meta<typeof StPaper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Surfaces: Story = {
  render: () => ({
    components: { StPaper },
    setup() {
      return { variantOptions };
    },
    template: `
      <div class="grid max-w-6xl gap-st-3 md:grid-cols-2 xl:grid-cols-3">
        <StPaper
          v-for="variant in variantOptions"
          :key="variant"
          :variant="variant"
          border="1"
          padding="3"
        >
          <div class="flex flex-col gap-st-2">
            <strong class="text-st-content-default">{{ variant }}</strong>
            <span class="text-st-body-small text-st-content-default">
              Exemplo de superficie semantica do componente.
            </span>
          </div>
        </StPaper>
      </div>
    `
  })
};

export const Interactive: Story = {
  args: {
    as: 'button',
    variant: 'surface-primary',
    border: '1',
    elevation: 2,
    interactive: true,
    padding: '2 3'
  },
  render: (args) => ({
    components: { StPaper },
    setup() {
      return { args };
    },
    template: `
      <StPaper v-bind="args">
        <span class="text-st-content-default">Paper interativo</span>
      </StPaper>
    `
  })
};

export const BackgroundImage: Story = {
  args: {
    variant: 'surface-3',
    borderRadius: '2',
    elevation: 3,
    padding: '4',
    height: '24',
    bgImage:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=dramatic%20purple%20abstract%20technology%20background%20for%20a%20design%20system%20card%2C%20soft%20glow%2C%20dark%20ui%20mood%2C%20high%20contrast&image_size=landscape_16_9'
  },
  render: (args) => ({
    components: { StPaper },
    setup() {
      return { args };
    },
    template: `
      <div class="max-w-4xl">
        <StPaper v-bind="args" className="flex items-end">
          <strong class="text-st-content-bright">Paper com imagem de fundo</strong>
        </StPaper>
      </div>
    `
  })
};

export const SpacingShortcuts: Story = {
  args: {
    variant: 'surface-2',
    border: '1',
    padding: '2 4',
    paddingMd: '3 6',
    margin: '4 auto',
    width: '32'
  }
};
