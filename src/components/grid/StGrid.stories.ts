import type { Meta, StoryObj } from '@storybook/vue3';

import StGrid from './StGrid.vue';

const spacingOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

const gridItems = [
  'Saldo',
  'Apostas',
  'Promocoes',
  'Notificacoes',
  'Historico',
  'Preferencias'
] as const;

const meta = {
  title: 'Components/StGrid',
  component: StGrid,
  tags: ['autodocs'],
  args: {
    cols: 2,
    gap: 2,
    gapX: undefined,
    gapY: undefined,
    smCols: undefined,
    mdCols: undefined,
    lgCols: undefined,
    padding: undefined,
    smPadding: undefined,
    mdPadding: undefined,
    lgPadding: undefined,
    margin: undefined,
    smMargin: undefined,
    mdMargin: undefined,
    lgMargin: undefined,
    className: ''
  },
  argTypes: {
    cols: {
      control: 'select',
      options: spacingOptions
    },
    gap: {
      control: 'select',
      options: spacingOptions
    },
    gapX: {
      control: 'select',
      options: spacingOptions
    },
    gapY: {
      control: 'select',
      options: spacingOptions
    },
    smCols: {
      control: 'select',
      options: spacingOptions
    },
    mdCols: {
      control: 'select',
      options: spacingOptions
    },
    lgCols: {
      control: 'select',
      options: spacingOptions
    },
    padding: {
      control: 'text'
    },
    smPadding: {
      control: 'text'
    },
    mdPadding: {
      control: 'text'
    },
    lgPadding: {
      control: 'text'
    },
    margin: {
      control: 'text'
    },
    smMargin: {
      control: 'text'
    },
    mdMargin: {
      control: 'text'
    },
    lgMargin: {
      control: 'text'
    },
    className: {
      control: 'text'
    }
  },
  render: (args) => ({
    components: { StGrid },
    setup() {
      return { args, gridItems };
    },
    template: `
      <StGrid v-bind="args">
        <div
          v-for="item in gridItems"
          :key="item"
          class="rounded-st-1 border border-st-border-2 bg-st-surface-1 p-st-3 text-st-body-small text-st-content-default"
        >
          {{ item }}
        </div>
      </StGrid>
    `
  })
} satisfies Meta<typeof StGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ResponsiveColumns: Story = {
  args: {
    cols: 1,
    smCols: 2,
    mdCols: 3,
    lgCols: 4,
    gap: 3
  }
};

export const GapVariations: Story = {
  render: () => ({
    components: { StGrid },
    template: `
      <div class="flex flex-col gap-st-4">
        <StGrid :cols="3" :gap="2">
          <div
            v-for="item in 6"
            :key="'gap-' + item"
            class="rounded-st-1 bg-st-surface-2 p-st-3 text-st-body-small text-st-content-default"
          >
            gap={{ 2 }} / item {{ item }}
          </div>
        </StGrid>

        <StGrid :cols="3" :gap-x="4" :gap-y="1">
          <div
            v-for="item in 6"
            :key="'axis-' + item"
            class="rounded-st-1 bg-st-surface-2 p-st-3 text-st-body-small text-st-content-default"
          >
            gapX={{ 4 }} / gapY={{ 1 }} / item {{ item }}
          </div>
        </StGrid>
      </div>
    `
  })
};

export const SpacingShortcuts: Story = {
  args: {
    cols: 2,
    gap: 2,
    padding: '2 4',
    mdPadding: '3 6',
    margin: '4 auto',
    className:
      'max-w-st-64 rounded-st-2 border border-st-border-2 bg-st-surface-0'
  }
};

export const DashboardLayout: Story = {
  render: () => ({
    components: { StGrid },
    template: `
      <div class="flex flex-col gap-st-4">
        <StGrid :cols="1" :md-cols="3" gap="3">
          <div class="rounded-st-2 bg-st-surface-primary p-st-4 text-st-content-default">
            Saldo principal
          </div>
          <div class="rounded-st-2 bg-st-surface-1 p-st-4 text-st-content-default">
            Tickets em aberto
          </div>
          <div class="rounded-st-2 bg-st-surface-1 p-st-4 text-st-content-default">
            Alertas da conta
          </div>
        </StGrid>

        <StGrid :cols="1" :lg-cols="2" gap="3">
          <div class="rounded-st-2 bg-st-surface-1 p-st-4 text-st-content-default">
            Grafico de desempenho
          </div>
          <div class="rounded-st-2 bg-st-surface-1 p-st-4 text-st-content-default">
            Resumo de campanhas
          </div>
        </StGrid>
      </div>
    `
  })
};
