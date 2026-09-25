import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import StAlert from './StAlert.vue';
import StButton from '../buttons/button/StButton.vue';

const statusOptions = [
  'info',
  'system',
  'warning',
  'positive',
  'negative'
] as const;

const meta = {
  title: 'Components/StAlert',
  component: StAlert,
  tags: ['autodocs'],
  args: {
    title: 'Verificacao de identidade pendente',
    description:
      'Envie um documento com foto para liberar saques acima de R$ 500.',
    status: 'warning',
    hideIcon: false,
    closable: false,
    width: 'full',
    className: ''
  },
  argTypes: {
    status: {
      control: 'radio',
      options: statusOptions
    },
    width: {
      control: 'select',
      options: ['full', 'auto', 'fit-content', '48', '64', '96']
    },
    title: { control: 'text' },
    description: { control: 'text' },
    icon: { control: 'text' },
    className: { control: 'text' }
  },
  render: (args) => ({
    components: { StAlert },
    setup() {
      return { args };
    },
    template: `
      <div class="w-full max-w-st-96 p-st-3">
        <StAlert v-bind="args" />
      </div>
    `
  })
} satisfies Meta<typeof StAlert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Statuses: Story = {
  name: 'Status',
  render: () => ({
    components: { StAlert },
    setup() {
      return {
        alertas: [
          {
            status: 'info',
            title: 'Odds em atualizacao',
            description: 'Os mercados deste jogo mudam a cada lance.'
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
            title: 'Conta verificada',
            description: 'Saques liberados sem limite de valor.'
          },
          {
            status: 'negative',
            title: 'Pagamento recusado',
            description: 'O banco nao autorizou o deposito. Tente outro metodo.'
          }
        ]
      };
    },
    template: `
      <div class="flex w-full max-w-st-96 flex-col gap-st-2 p-st-3">
        <StAlert
          v-for="alerta in alertas"
          :key="alerta.status"
          v-bind="alerta"
        />
      </div>
    `
  })
};

export const Closable: Story = {
  name: 'Com fechar',
  render: () => ({
    components: { StAlert, StButton },
    setup() {
      const aberto = ref(true);

      return { aberto };
    },
    template: `
      <div class="flex w-full max-w-st-96 flex-col gap-st-2 p-st-3">
        <StAlert
          v-model:open="aberto"
          closable
          status="info"
          title="Novo mercado disponivel"
          description="Escanteios por tempo ja podem ser apostados ao vivo."
        />

        <StButton v-if="!aberto" size="small" variant="outline" @click="aberto = true">
          Mostrar alerta de novo
        </StButton>
      </div>
    `
  })
};

export const Widths: Story = {
  name: 'Larguras',
  render: () => ({
    components: { StAlert },
    template: `
      <div class="flex w-full flex-col gap-st-2 p-st-3">
        <StAlert width="full" status="system" title="width full" description="Ocupa toda a largura disponivel." />
        <StAlert width="96" status="system" title="width 96" description="Largura de st-96." />
        <StAlert width="fit-content" status="system" title="width fit-content" />
      </div>
    `
  })
};

export const WithAction: Story = {
  name: 'Com acao',
  render: () => ({
    components: { StAlert, StButton },
    template: `
      <div class="w-full max-w-st-96 p-st-3">
        <StAlert
          status="negative"
          title="Pagamento recusado"
          description="O banco nao autorizou o deposito."
        >
          <template #action>
            <StButton size="small" variant="text">Tentar outro metodo</StButton>
          </template>
        </StAlert>
      </div>
    `
  })
};

export const OnlyTitleOrDescription: Story = {
  name: 'So titulo ou so descricao',
  render: () => ({
    components: { StAlert },
    template: `
      <div class="flex w-full max-w-st-96 flex-col gap-st-2 p-st-3">
        <StAlert status="positive" title="Deposito confirmado" closable />
        <StAlert status="info" description="Os valores podem levar ate 1 minuto para aparecer no saldo." closable />
        <StAlert status="warning" title="Sem icone" description="Com hideIcon." hide-icon />
      </div>
    `
  })
};
