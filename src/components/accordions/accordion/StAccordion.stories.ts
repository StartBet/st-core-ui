import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCreditCard,
  faDice,
  faFutbol,
  faTrophy,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
import type { Meta, StoryObj } from '@storybook/vue3';

import StAccordion from './StAccordion.vue';

library.add(faCreditCard, faDice, faFutbol, faTrophy, faTriangleExclamation);

const surfaceOptions = [
  'transparent',
  'surface-0',
  'surface-1',
  'surface-2',
  'surface-3',
  'surface-4',
  'surface-primary',
  'surface-secondary',
  'surface-info',
  'surface-system',
  'surface-warning',
  'surface-positive',
  'surface-negative'
] as const;

const meta = {
  title: 'Components/StAccordion',
  component: StAccordion,
  tags: ['autodocs'],
  args: {
    title: 'Regras do bonus de boas-vindas',
    icon: '',
    size: 'medium',
    headerSurface: 'surface-1',
    contentSurface: 'surface-0',
    defaultOpen: false,
    disabled: false,
    hideExpandIcon: false,
    className: ''
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large']
    },
    headerSurface: {
      control: 'select',
      options: surfaceOptions
    },
    contentSurface: {
      control: 'select',
      options: surfaceOptions
    },
    title: { control: 'text' },
    icon: { control: 'text' },
    className: { control: 'text' }
  },
  render: (args) => ({
    components: { StAccordion },
    setup() {
      return { args };
    },
    template: `
      <div class="w-full max-w-st-96 p-st-3">
        <StAccordion v-bind="args">
          <p class="m-0">
            A area expande ate a altura automatica do conteudo interno, sem
            altura fixa e sem medir nada em JavaScript.
          </p>
        </StAccordion>
      </div>
    `
  })
} satisfies Meta<typeof StAccordion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AutoHeight: Story = {
  name: 'Altura automatica',
  render: () => ({
    components: { StAccordion },
    template: `
      <div class="flex w-full max-w-st-96 flex-col gap-st-2 p-st-3">
        <StAccordion title="Aposta minima">
          <p class="m-0">R$ 1,00 por bilhete, simples ou multipla.</p>
        </StAccordion>

        <StAccordion title="Rollover do bonus">
          <p class="m-0">
            O valor creditado precisa ser apostado 5 vezes em mercados com odd
            minima de 1.50 antes de virar saldo sacavel. Apostas anuladas ou
            reembolsadas nao contam para o rollover.
          </p>
          <p class="m-0 mt-st-1">
            O prazo para cumprir o rollover e de 30 dias a partir do credito.
          </p>
        </StAccordion>

        <StAccordion title="Mercados da partida">
          <ul class="m-0 list-disc pl-st-3">
            <li>Resultado final</li>
            <li>Total de gols</li>
            <li>Ambas as equipes marcam</li>
            <li>Escanteios asiaticos</li>
            <li>Cartoes por time</li>
          </ul>
        </StAccordion>
      </div>
    `
  })
};

export const Sizes: Story = {
  render: () => ({
    components: { StAccordion },
    template: `
      <div class="flex w-full max-w-st-96 flex-col gap-st-2 p-st-3">
        <StAccordion size="small" title="Resultado final" icon="futbol" default-open>
          <p class="m-0">Vitoria do mandante, empate ou vitoria do visitante.</p>
        </StAccordion>
        <StAccordion size="medium" title="Total de gols" icon="futbol" default-open>
          <p class="m-0">Acima ou abaixo de 2.5 gols no tempo regulamentar.</p>
        </StAccordion>
        <StAccordion size="large" title="Ambas as equipes marcam" icon="futbol" default-open>
          <p class="m-0">Sim ou nao, considerando os 90 minutos e acrescimos.</p>
        </StAccordion>
      </div>
    `
  })
};

export const Surfaces: Story = {
  render: () => ({
    components: { StAccordion },
    template: `
      <div class="flex w-full max-w-st-96 flex-col gap-st-2 p-st-3">
        <StAccordion
          title="Slots em destaque"
          icon="dice"
          header-surface="surface-2"
          content-surface="surface-2"
          default-open
        >
          <p class="m-0">Bloco unico, sem separacao entre cabecalho e conteudo.</p>
        </StAccordion>

        <StAccordion
          title="Cassino ao vivo"
          icon="dice"
          header-surface="surface-3"
          content-surface="surface-1"
          default-open
        >
          <p class="m-0">Mesas de roleta e blackjack com crupie real, 24 horas.</p>
        </StAccordion>

        <StAccordion
          title="Limite semanal de deposito atingido"
          icon="triangle-exclamation"
          header-surface="surface-warning"
          content-surface="surface-1"
          default-open
        >
          <p class="m-0">
            Novos depositos serao liberados na segunda-feira. Voce pode revisar
            o limite em Jogo responsavel.
          </p>
        </StAccordion>

        <StAccordion
          title="Sem fundo"
          header-surface="transparent"
          content-surface="transparent"
          default-open
        >
          <p class="m-0">Util quando o container ja define a superficie.</p>
        </StAccordion>
      </div>
    `
  })
};

export const WithEndAdornment: Story = {
  name: 'Com endAdornment',
  render: () => ({
    components: { StAccordion },
    template: `
      <div class="flex w-full max-w-st-96 flex-col gap-st-2 p-st-3">
        <StAccordion title="Brasileirao Serie A" icon="trophy">
          <template #endAdornment>
            <span class="rounded-full bg-st-surface-3 px-st-1 text-st-xs text-st-content-default">
              12 jogos
            </span>
          </template>
          <p class="m-0">Rodada 24, com jogos de sexta a domingo.</p>
        </StAccordion>

        <StAccordion title="Limites da conta" icon="credit-card">
          <template #endAdornment>
            <button
              type="button"
              class="cursor-pointer rounded-st-1 border-0 bg-st-primary px-st-1 py-[4px] text-st-xs text-st-content-bright"
              @click="alert('editar limites')"
            >
              Editar
            </button>
          </template>
          <p class="m-0">
            Deposito diario de R$ 500 e tempo de sessao de 4 horas. O adornment
            fica entre o titulo e o chevron, fora do botao do cabecalho, entao
            aceita elementos interativos sem disparar o toggle.
          </p>
        </StAccordion>
      </div>
    `
  })
};

export const States: Story = {
  render: () => ({
    components: { StAccordion },
    template: `
      <div class="flex w-full max-w-st-96 flex-col gap-st-2 p-st-3">
        <StAccordion title="Como faco um saque?" default-open>
          <p class="m-0">
            Saques via Pix caem em ate 30 minutos apos a aprovacao, para chave
            no mesmo CPF da conta.
          </p>
        </StAccordion>

        <StAccordion title="Promocao encerrada" disabled>
          <p class="m-0">Nao abre.</p>
        </StAccordion>

        <StAccordion title="Metodos de pagamento" hide-expand-icon>
          <p class="m-0">Pix, cartao de credito e transferencia bancaria.</p>
        </StAccordion>
      </div>
    `
  })
};
