import type { Meta, StoryObj } from '@storybook/vue3';

import StToast from './StToast.vue';

const statusOptions = [
  'info',
  'system',
  'warning',
  'positive',
  'negative'
] as const;

const meta = {
  title: 'Components/StToast',
  component: StToast,
  tags: ['autodocs'],
  args: {
    title: 'Aposta registrada',
    description: 'Bilhete 4821 confirmado no Brasileirao Serie A.',
    status: 'positive',
    hideIcon: false,
    closable: true,
    className: ''
  },
  argTypes: {
    status: {
      control: 'radio',
      options: statusOptions
    },
    title: { control: 'text' },
    description: { control: 'text' },
    icon: { control: 'text' },
    className: { control: 'text' }
  },
  render: (args) => ({
    components: { StToast },
    setup() {
      return { args };
    },
    template: `
      <div class="p-st-3">
        <StToast v-bind="args" />
      </div>
    `
  })
} satisfies Meta<typeof StToast>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Statuses: Story = {
  name: 'Status',
  render: () => ({
    components: { StToast },
    setup() {
      return {
        avisos: [
          {
            status: 'info',
            title: 'Odd atualizada',
            description: 'O mercado Resultado final mudou de 1.85 para 1.72.'
          },
          {
            status: 'system',
            title: 'Manutencao programada',
            description: 'O cassino ao vivo fica indisponivel das 3h as 4h.'
          },
          {
            status: 'warning',
            title: 'Limite semanal perto do fim',
            description: 'Restam R$ 50 do seu limite de deposito desta semana.'
          },
          {
            status: 'positive',
            title: 'Saque aprovado',
            description: 'R$ 320,00 a caminho da sua chave Pix.'
          },
          {
            status: 'negative',
            title: 'Saldo insuficiente',
            description: 'Deposite para concluir a aposta de R$ 25,00.'
          }
        ]
      };
    },
    template: `
      <div class="flex flex-col gap-st-2 p-st-3">
        <StToast
          v-for="aviso in avisos"
          :key="aviso.status"
          :status="aviso.status"
          :title="aviso.title"
          :description="aviso.description"
        />
      </div>
    `
  })
};

export const AutoHeight: Story = {
  name: 'Altura pelo conteudo',
  render: () => ({
    components: { StToast },
    template: `
      <div class="flex flex-col gap-st-2 p-st-3">
        <StToast status="positive" title="Aposta registrada" />

        <StToast
          status="info"
          title="Cashout disponivel"
          description="Encerre a aposta agora por R$ 48,20."
        />

        <StToast
          status="negative"
          title="Nao foi possivel concluir o deposito"
          description="O banco recusou a transacao. Confira os dados do cartao ou tente pagar via Pix, que e aprovado na hora e sem taxa."
        />
      </div>
    `
  })
};

export const WithAction: Story = {
  name: 'Com acao',
  render: () => ({
    components: { StToast },
    template: `
      <div class="flex flex-col gap-st-2 p-st-3">
        <StToast
          status="positive"
          title="Aposta registrada"
          description="Bilhete 4821 confirmado."
        >
          <template #action>
            <button
              type="button"
              class="cursor-pointer rounded-st-1 border-0 bg-st-primary px-st-1 py-[4px] text-st-xs text-st-content-bright"
            >
              Ver bilhete
            </button>
          </template>
        </StToast>
      </div>
    `
  })
};

export const Variations: Story = {
  name: 'Variacoes',
  render: () => ({
    components: { StToast },
    template: `
      <div class="flex flex-col gap-st-2 p-st-3">
        <StToast
          status="info"
          title="Sem descricao"
        />
        <StToast
          status="system"
          title="Sem icone"
          description="Use hide-icon quando o titulo ja for suficiente."
          hide-icon
        />
        <StToast
          status="warning"
          title="Sem botao de fechar"
          description="Use closable false quando o fechamento for automatico."
          :closable="false"
        />
      </div>
    `
  })
};
