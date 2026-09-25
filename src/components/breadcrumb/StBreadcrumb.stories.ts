import type { Meta, StoryObj } from '@storybook/vue3';

import StBreadcrumb from './StBreadcrumb.vue';

const casino = [
  { label: 'Inicio', href: '/' },
  { label: 'Cassino', href: '/casino' },
  { label: 'Pragmatic Play', href: '/providers/pragmatic-play' },
  { label: 'Gates of Olympus' }
];

const meta = {
  title: 'Components/StBreadcrumb',
  component: StBreadcrumb,
  tags: ['autodocs'],
  args: {
    items: casino,
    minItems: 2,
    ariaLabel: 'Breadcrumb',
    className: ''
  },
  argTypes: {
    items: { control: 'object' },
    minItems: { control: { type: 'number', min: 1 } },
    ariaLabel: { control: 'text' },
    className: { control: 'text' }
  },
  render: (args) => ({
    components: { StBreadcrumb },
    setup() {
      return { args };
    },
    template: `
      <div class="w-full max-w-st-128 p-st-3">
        <StBreadcrumb v-bind="args" />
      </div>
    `
  })
} satisfies Meta<typeof StBreadcrumb>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Paths: Story = {
  name: 'Caminhos da plataforma',
  render: () => ({
    components: { StBreadcrumb },
    setup() {
      return {
        caminhos: [
          casino,
          [
            { label: 'Inicio', href: '/' },
            { label: 'Cassino Ao Vivo', href: '/casino/live' },
            { label: 'Roleta' }
          ],
          [
            { label: 'Esportes', href: '/sports' },
            { label: 'Futebol', href: '/sports/futebol' },
            { label: 'Campeonato', href: '/sports/futebol/c-325' },
            { label: 'Evento' }
          ],
          [
            { label: 'Inicio', href: '/' },
            { label: 'Institucional', href: '/' },
            { label: 'Regulamento' }
          ]
        ]
      };
    },
    template: `
      <div class="flex w-full max-w-st-128 flex-col gap-st-3 p-st-3">
        <StBreadcrumb
          v-for="(items, index) in caminhos"
          :key="index"
          :items="items"
        />
      </div>
    `
  })
};

export const LongLabels: Story = {
  name: 'Rotulos longos e rolagem',
  render: () => ({
    components: { StBreadcrumb },
    setup() {
      return {
        items: [
          { label: 'Inicio', href: '/' },
          { label: 'Cassino', href: '/casino' },
          { label: 'Provedores', href: '/providers' },
          {
            label: 'Evolution Gaming Live Casino',
            href: '/providers/evolution'
          },
          { label: 'Crazy Time Live Game Show Edicao Especial' }
        ]
      };
    },
    template: `
      <div class="w-full max-w-st-64 p-st-3">
        <StBreadcrumb :items="items" />
      </div>
    `
  })
};

export const CustomSeparator: Story = {
  name: 'Separador proprio',
  render: () => ({
    components: { StBreadcrumb },
    setup() {
      return { items: casino };
    },
    template: `
      <div class="w-full max-w-st-128 p-st-3">
        <StBreadcrumb :items="items">
          <template #separator>/</template>
        </StBreadcrumb>
      </div>
    `
  })
};
