import { library } from '@fortawesome/fontawesome-svg-core';
import { faDice, faFutbol } from '@fortawesome/free-solid-svg-icons';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import StAccordionGroup from './StAccordionGroup.vue';
import StAccordion from '../accordion/StAccordion.vue';

library.add(faDice, faFutbol);

/** Mercados de uma partida, o caso classico de accordion no esportivo. */
const mercados = [
  {
    value: 'resultado',
    title: 'Resultado final',
    icon: 'futbol',
    text: 'Vitoria do mandante, empate ou vitoria do visitante, no tempo regulamentar.'
  },
  {
    value: 'gols',
    title: 'Total de gols',
    icon: 'futbol',
    text: 'Acima ou abaixo de 0.5 a 5.5 gols, considerando os 90 minutos e acrescimos.'
  },
  {
    value: 'ambas',
    title: 'Ambas as equipes marcam',
    icon: 'futbol',
    text: 'Sim ou nao. Gols na prorrogacao nao entram na liquidacao.'
  },
  {
    value: 'escanteios',
    title: 'Escanteios asiaticos',
    icon: 'futbol',
    text: 'Linha com devolucao parcial quando o total fecha exatamente na linha.'
  }
];

const meta = {
  title: 'Components/StAccordionGroup',
  component: StAccordionGroup,
  tags: ['autodocs'],
  args: {
    multiple: false,
    size: 'medium',
    headerSurface: 'surface-1',
    contentSurface: 'surface-0',
    disabled: false,
    gap: 1,
    className: ''
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large']
    },
    gap: {
      control: 'radio',
      options: [0, 1, 2, 3]
    },
    headerSurface: { control: 'text' },
    contentSurface: { control: 'text' },
    className: { control: 'text' }
  },
  render: (args) => ({
    components: { StAccordionGroup, StAccordion },
    setup() {
      return { args, mercados };
    },
    template: `
      <div class="w-full max-w-st-96 p-st-3">
        <StAccordionGroup v-bind="args">
          <StAccordion
            v-for="item in mercados"
            :key="item.value"
            :value="item.value"
            :title="item.title"
            :icon="item.icon"
          >
            <p class="m-0">{{ item.text }}</p>
          </StAccordion>
        </StAccordionGroup>
      </div>
    `
  })
} satisfies Meta<typeof StAccordionGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SingleVsMultiple: Story = {
  name: 'Um de cada vez vs multiplos',
  render: () => ({
    components: { StAccordionGroup, StAccordion },
    setup() {
      return { mercados };
    },
    template: `
      <div class="flex w-full max-w-st-160 gap-st-3 p-st-3">
        <div class="flex flex-1 flex-col gap-st-1">
          <span class="text-st-body-small text-st-content-default">
            Um de cada vez (padrao)
          </span>
          <StAccordionGroup>
            <StAccordion
              v-for="item in mercados"
              :key="item.value"
              :value="item.value"
              :title="item.title"
            >
              <p class="m-0">{{ item.text }}</p>
            </StAccordion>
          </StAccordionGroup>
        </div>

        <div class="flex flex-1 flex-col gap-st-1">
          <span class="text-st-body-small text-st-content-default">
            Multiplos abertos
          </span>
          <StAccordionGroup multiple>
            <StAccordion
              v-for="item in mercados"
              :key="item.value"
              :value="item.value"
              :title="item.title"
            >
              <p class="m-0">{{ item.text }}</p>
            </StAccordion>
          </StAccordionGroup>
        </div>
      </div>
    `
  })
};

export const DefaultOpen: Story = {
  name: 'Estado inicial',
  render: () => ({
    components: { StAccordionGroup, StAccordion },
    setup() {
      return { mercados };
    },
    template: `
      <div class="flex w-full max-w-st-96 flex-col gap-st-3 p-st-3">
        <div class="flex flex-col gap-st-1">
          <span class="text-st-body-small text-st-content-default">
            Colapsado (padrao)
          </span>
          <StAccordionGroup>
            <StAccordion
              v-for="item in mercados.slice(0, 2)"
              :key="item.value"
              :value="item.value"
              :title="item.title"
            >
              <p class="m-0">{{ item.text }}</p>
            </StAccordion>
          </StAccordionGroup>
        </div>

        <div class="flex flex-col gap-st-1">
          <span class="text-st-body-small text-st-content-default">
            Aberto pelo modelValue do grupo
          </span>
          <StAccordionGroup model-value="gols">
            <StAccordion
              v-for="item in mercados.slice(0, 2)"
              :key="item.value"
              :value="item.value"
              :title="item.title"
            >
              <p class="m-0">{{ item.text }}</p>
            </StAccordion>
          </StAccordionGroup>
        </div>

        <div class="flex flex-col gap-st-1">
          <span class="text-st-body-small text-st-content-default">
            Aberto pelo defaultOpen do item
          </span>
          <StAccordionGroup multiple>
            <StAccordion value="resultado" title="Resultado final" default-open>
              <p class="m-0">{{ mercados[0].text }}</p>
            </StAccordion>
            <StAccordion value="ambas" title="Ambas as equipes marcam" default-open>
              <p class="m-0">{{ mercados[2].text }}</p>
            </StAccordion>
          </StAccordionGroup>
        </div>
      </div>
    `
  })
};

export const Controlled: Story = {
  name: 'Controlado com v-model',
  render: () => ({
    components: { StAccordionGroup, StAccordion },
    setup() {
      const aberto = ref<string | null>('resultado');

      return { mercados, aberto };
    },
    template: `
      <div class="flex w-full max-w-st-96 flex-col gap-st-2 p-st-3">
        <div class="flex flex-wrap items-center gap-st-1">
          <button
            v-for="item in mercados"
            :key="item.value"
            type="button"
            class="cursor-pointer rounded-st-1 border-0 bg-st-surface-2 px-st-1 py-[4px] text-st-xs text-st-content-default"
            @click="aberto = item.value"
          >
            {{ item.title }}
          </button>
          <button
            type="button"
            class="cursor-pointer rounded-st-1 border-0 bg-st-surface-3 px-st-1 py-[4px] text-st-xs text-st-content-default"
            @click="aberto = null"
          >
            Colapsar
          </button>
        </div>

        <StAccordionGroup v-model="aberto">
          <StAccordion
            v-for="item in mercados"
            :key="item.value"
            :value="item.value"
            :title="item.title"
          >
            <p class="m-0">{{ item.text }}</p>
          </StAccordion>
        </StAccordionGroup>

        <span class="text-st-body-small text-st-content-default">
          Mercado aberto: {{ aberto ?? 'nenhum' }}
        </span>
      </div>
    `
  })
};

export const GroupSurfaces: Story = {
  name: 'Tamanho e superficie pelo grupo',
  render: () => ({
    components: { StAccordionGroup, StAccordion },
    setup() {
      const faq = [
        {
          value: 'saque',
          title: 'Como faco um saque?',
          text: 'Pelo menu Carteira, em Saque. Via Pix o valor cai em ate 30 minutos apos a aprovacao.'
        },
        {
          value: 'deposito',
          title: 'Qual o deposito minimo?',
          text: 'R$ 20 via Pix e R$ 50 no cartao de credito.'
        },
        {
          value: 'verificacao',
          title: 'Preciso verificar a conta?',
          text: 'Sim, antes do primeiro saque. Basta enviar um documento com foto.'
        }
      ];

      const cassino = [
        {
          value: 'slots',
          title: 'Slots',
          icon: 'dice',
          text: 'Mais de 3.000 jogos, com filtros por provedor, volatilidade e RTP.'
        },
        {
          value: 'aovivo',
          title: 'Cassino ao vivo',
          icon: 'dice',
          text: 'Roleta, blackjack e bacara com crupie real, 24 horas por dia.'
        }
      ];

      return { faq, cassino };
    },
    template: `
      <div class="flex w-full max-w-st-96 flex-col gap-st-3 p-st-3">
        <StAccordionGroup
          size="small"
          header-surface="surface-2"
          content-surface="surface-1"
          :gap="0"
        >
          <StAccordion
            v-for="item in faq"
            :key="item.value"
            :value="item.value"
            :title="item.title"
          >
            <p class="m-0">{{ item.text }}</p>
          </StAccordion>
        </StAccordionGroup>

        <StAccordionGroup
          size="large"
          header-surface="surface-3"
          content-surface="surface-1"
          :gap="2"
          multiple
        >
          <StAccordion
            v-for="item in cassino"
            :key="item.value"
            :value="item.value"
            :title="item.title"
            :icon="item.icon"
          >
            <p class="m-0">{{ item.text }}</p>
          </StAccordion>
        </StAccordionGroup>
      </div>
    `
  })
};
