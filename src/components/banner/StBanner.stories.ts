import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBolt,
  faCircleInfo,
  faGift,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import StBanner from './StBanner.vue';
import StButton from '../buttons/button/StButton.vue';

library.add(faBolt, faCircleInfo, faGift, faTriangleExclamation);

const statusOptions = [
  'info',
  'system',
  'warning',
  'positive',
  'negative',
  'primary',
  'secondary'
] as const;

const meta = {
  title: 'Components/StBanner',
  component: StBanner,
  tags: ['autodocs'],
  args: {
    text: 'Deposite hoje e ganhe 100% de bonus ate R$ 200',
    status: 'primary',
    icon: 'gift',
    actionLabel: 'Depositar',
    closable: true,
    className: ''
  },
  argTypes: {
    status: {
      control: 'radio',
      options: statusOptions
    },
    text: { control: 'text' },
    icon: { control: 'text' },
    actionLabel: { control: 'text' },
    className: { control: 'text' }
  },
  render: (args) => ({
    components: { StBanner },
    setup() {
      return { args };
    },
    template: `
      <div class="w-full max-w-st-128 p-st-3">
        <StBanner v-bind="args" />
      </div>
    `
  })
} satisfies Meta<typeof StBanner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Statuses: Story = {
  name: 'Status',
  render: () => ({
    components: { StBanner },
    setup() {
      return {
        banners: [
          {
            status: 'info',
            icon: 'circle-info',
            text: 'Odds atualizadas a cada lance'
          },
          { status: 'system', text: 'Manutencao do cassino ao vivo as 3h' },
          {
            status: 'warning',
            icon: 'triangle-exclamation',
            text: 'Seu limite semanal esta perto do fim'
          },
          { status: 'positive', text: 'Saque aprovado' },
          { status: 'negative', text: 'Pagamento recusado pelo banco' },
          {
            status: 'primary',
            icon: 'gift',
            text: 'Bonus de boas-vindas liberado'
          },
          {
            status: 'secondary',
            icon: 'bolt',
            text: 'Super odds no classico de domingo'
          }
        ]
      };
    },
    template: `
      <div class="flex w-full max-w-st-128 flex-col items-start gap-st-2 p-st-3">
        <StBanner
          v-for="banner in banners"
          :key="banner.status"
          v-bind="banner"
        />
      </div>
    `
  })
};

export const WithActionAndClose: Story = {
  name: 'Com acao e fechar',
  render: () => ({
    components: { StBanner },
    setup() {
      const aberto = ref(true);
      const cliques = ref(0);

      return { aberto, cliques };
    },
    template: `
      <div class="flex w-full max-w-st-128 flex-col items-start gap-st-2 p-st-3">
        <StBanner
          status="secondary"
          icon="bolt"
          text="Super odds no classico de domingo"
          action-label="Ver jogo"
          @action="cliques++"
        />
        <StBanner
          v-model:open="aberto"
          status="info"
          text="Novo mercado de escanteios ao vivo"
          action-label="Conhecer"
          closable
        />
        <StBanner status="warning" text="So com fechar" closable />
        <span class="text-st-body-small text-st-content-ghost">
          Cliques na acao: {{ cliques }}
        </span>
      </div>
    `
  })
};

export const CustomAction: Story = {
  name: 'Acao pelo slot',
  render: () => ({
    components: { StBanner, StButton },
    template: `
      <div class="w-full max-w-st-128 p-st-3">
        <StBanner status="primary" icon="gift" text="Bonus liberado">
          <template #action>
            <StButton size="small" variant="outline" class-name="!rounded-full">
              Regras
            </StButton>
          </template>
        </StBanner>
      </div>
    `
  })
};

export const LongText: Story = {
  name: 'Frase longa',
  render: () => ({
    components: { StBanner },
    template: `
      <div class="w-full max-w-st-80 p-st-3">
        <StBanner
          status="system"
          icon="circle-info"
          text="O cassino ao vivo fica indisponivel das 3h as 4h para manutencao programada"
          closable
        />
      </div>
    `
  })
};
