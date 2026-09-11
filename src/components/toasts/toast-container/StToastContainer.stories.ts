import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import StToastContainer from './StToastContainer.vue';
import { stToastConfig, useToast } from '../../../composables/useToast';

const positionOptions = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right'
] as const;

const botao =
  'cursor-pointer rounded-st-1 border-0 bg-st-surface-2 px-st-2 py-st-1 text-st-body-small text-st-content-default';

const meta = {
  title: 'Components/StToastContainer',
  component: StToastContainer,
  tags: ['autodocs'],
  args: {
    position: 'top-right',
    gap: 1,
    pauseOnHover: true,
    className: ''
  },
  argTypes: {
    position: {
      control: 'select',
      options: positionOptions
    },
    gap: {
      control: 'radio',
      options: [1, 2, 3]
    },
    className: { control: 'text' }
  },
  render: (args) => ({
    components: { StToastContainer },
    setup() {
      const toast = useToast();

      const disparar = () => {
        toast.positive({
          title: 'Aposta registrada',
          description: 'Bilhete 4821 confirmado no Brasileirao Serie A.'
        });
      };

      return { args, toast, disparar, botao };
    },
    template: `
      <div class="flex min-h-st-96 flex-col items-start gap-st-2 p-st-3">
        <div class="flex flex-wrap gap-st-1">
          <button type="button" :class="botao" @click="disparar">
            Disparar toast
          </button>
          <button type="button" :class="botao" @click="toast.dismissAll()">
            Limpar
          </button>
        </div>

        <span class="text-st-body-small text-st-content-default">
          Na fila: {{ toast.toasts.value.length }}
        </span>

        <StToastContainer v-bind="args" />
      </div>
    `
  })
} satisfies Meta<typeof StToastContainer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Callback: Story = {
  name: 'Chamando pelo composable',
  render: () => ({
    components: { StToastContainer },
    setup() {
      const toast = useToast();

      const acoes = [
        {
          label: 'Aposta registrada',
          run: () =>
            toast.positive({
              title: 'Aposta registrada',
              description: 'Bilhete 4821 confirmado.'
            })
        },
        {
          label: 'Odd atualizada',
          run: () =>
            toast.info({
              title: 'Odd atualizada',
              description: 'Resultado final mudou de 1.85 para 1.72.'
            })
        },
        {
          label: 'Limite perto do fim',
          run: () =>
            toast.warning({
              title: 'Limite semanal perto do fim',
              description: 'Restam R$ 50 do seu limite de deposito.'
            })
        },
        {
          label: 'Saldo insuficiente',
          run: () =>
            toast.negative({
              title: 'Saldo insuficiente',
              description: 'Deposite para concluir a aposta de R$ 25,00.'
            })
        },
        {
          label: 'Manutencao',
          run: () =>
            toast.system({
              title: 'Manutencao programada',
              description: 'Cassino ao vivo indisponivel das 3h as 4h.'
            })
        },
        {
          label: 'Persistente',
          run: () =>
            toast.negative({
              title: 'Conta nao verificada',
              description: 'Envie um documento para liberar saques.',
              duration: 0
            })
        }
      ];

      return { toast, acoes, botao };
    },
    template: `
      <div class="flex min-h-st-96 flex-col items-start gap-st-2 p-st-3">
        <div class="flex flex-wrap gap-st-1">
          <button
            v-for="acao in acoes"
            :key="acao.label"
            type="button"
            :class="botao"
            @click="acao.run()"
          >
            {{ acao.label }}
          </button>
          <button type="button" :class="botao" @click="toast.dismissAll()">
            Limpar
          </button>
        </div>

        <span class="text-st-body-small text-st-content-default">
          Toasts somem em 5s. Passe o mouse sobre a pilha para congelar a
          contagem. O ultimo botao cria um toast persistente.
        </span>

        <StToastContainer />
      </div>
    `
  })
};

export const Positions: Story = {
  name: 'Posicoes',
  render: () => ({
    components: { StToastContainer },
    setup() {
      const toast = useToast();
      const position = ref<(typeof positionOptions)[number]>('top-right');

      const mostrar = (value: (typeof positionOptions)[number]) => {
        position.value = value;
        toast.dismissAll();
        toast.info({
          title: value,
          description: 'Pilha ancorada neste canto.',
          duration: 0
        });
      };

      return { positionOptions, position, mostrar, botao, toast };
    },
    template: `
      <div class="flex min-h-st-96 flex-col items-start gap-st-2 p-st-3">
        <div class="flex flex-wrap gap-st-1">
          <button
            v-for="value in positionOptions"
            :key="value"
            type="button"
            :class="botao"
            @click="mostrar(value)"
          >
            {{ value }}
          </button>
          <button type="button" :class="botao" @click="toast.dismissAll()">
            Limpar
          </button>
        </div>

        <StToastContainer :position="position" />
      </div>
    `
  })
};

export const QueueLimit: Story = {
  name: 'Limite da fila',
  render: () => ({
    components: { StToastContainer },
    setup() {
      const toast = useToast();
      let contador = 0;

      const disparar = () => {
        contador += 1;
        toast.info({ title: `Aviso ${contador}`, duration: 0 });
      };

      const configurar = (max: number) => {
        stToastConfig.max = max;
      };

      return { toast, disparar, configurar, botao, stToastConfig };
    },
    template: `
      <div class="flex min-h-st-96 flex-col items-start gap-st-2 p-st-3">
        <div class="flex flex-wrap gap-st-1">
          <button type="button" :class="botao" @click="disparar">
            Empilhar
          </button>
          <button type="button" :class="botao" @click="configurar(3)">
            max = 3
          </button>
          <button type="button" :class="botao" @click="configurar(5)">
            max = 5
          </button>
          <button type="button" :class="botao" @click="toast.dismissAll()">
            Limpar
          </button>
        </div>

        <span class="text-st-body-small text-st-content-default">
          Limite atual: {{ stToastConfig.max }} — ao passar dele, o mais antigo
          sai da fila.
        </span>

        <StToastContainer />
      </div>
    `
  })
};
