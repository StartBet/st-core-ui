import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faDice,
  faFutbol,
  faReceipt,
  faTowerBroadcast
} from '@fortawesome/free-solid-svg-icons';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import StTabs from './StTabs.vue';
import StTabPanel from '../tab-panel/StTabPanel.vue';
import StTab from '../tab/StTab.vue';

library.add(faDice, faFutbol, faReceipt, faTowerBroadcast);

const mercados = [
  {
    value: 'aovivo',
    label: 'Ao vivo',
    icon: 'tower-broadcast',
    text: '12 partidas acontecendo agora, com odds atualizadas a cada lance.'
  },
  {
    value: 'prejogo',
    label: 'Pre-jogo',
    icon: 'futbol',
    text: 'Rodada 24 do Brasileirao Serie A, de sexta a domingo.'
  },
  {
    value: 'cassino',
    label: 'Cassino',
    icon: 'dice',
    text: 'Mais de 3.000 slots e mesas ao vivo 24 horas por dia.'
  },
  {
    value: 'bilhetes',
    label: 'Meus bilhetes',
    icon: 'receipt',
    text: '3 bilhetes abertos e 18 liquidados nos ultimos 30 dias.'
  }
];

const meta = {
  title: 'Components/StTabs',
  component: StTabs,
  tags: ['autodocs'],
  args: {
    modelValue: 'aovivo',
    variant: 'underline',
    size: 'medium',
    color: 'primary',
    align: 'start',
    fullWidth: false,
    disabled: false,
    className: ''
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['underline', 'pill']
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large']
    },
    color: {
      control: 'radio',
      options: ['primary', 'secondary']
    },
    align: {
      control: 'radio',
      options: ['start', 'center', 'end']
    },
    className: { control: 'text' }
  },
  render: (args) => ({
    components: { StTabs, StTab, StTabPanel },
    setup() {
      const ativa = ref(args.modelValue);

      return { args, ativa, mercados };
    },
    template: `
      <div class="w-full max-w-st-96 p-st-3">
        <StTabs v-bind="args" v-model="ativa">
          <template #tabs>
            <StTab
              v-for="item in mercados"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </template>

          <StTabPanel
            v-for="item in mercados"
            :key="item.value"
            :value="item.value"
          >
            {{ item.text }}
          </StTabPanel>
        </StTabs>
      </div>
    `
  })
} satisfies Meta<typeof StTabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  name: 'Variantes',
  render: () => ({
    components: { StTabs, StTab, StTabPanel },
    setup() {
      const sublinhado = ref('aovivo');
      const pilula = ref('aovivo');

      return { mercados, sublinhado, pilula };
    },
    template: `
      <div class="flex w-full max-w-st-96 flex-col gap-st-4 p-st-3">
        <StTabs v-model="sublinhado">
          <template #tabs>
            <StTab
              v-for="item in mercados"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </template>
          <StTabPanel
            v-for="item in mercados"
            :key="item.value"
            :value="item.value"
          >
            {{ item.text }}
          </StTabPanel>
        </StTabs>

        <StTabs v-model="pilula" variant="pill">
          <template #tabs>
            <StTab
              v-for="item in mercados"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </template>
          <StTabPanel
            v-for="item in mercados"
            :key="item.value"
            :value="item.value"
          >
            {{ item.text }}
          </StTabPanel>
        </StTabs>
      </div>
    `
  })
};

export const Sizes: Story = {
  render: () => ({
    components: { StTabs, StTab },
    setup() {
      const tamanhos = ['small', 'medium', 'large'] as const;
      const ativa = ref('aovivo');

      return { mercados, tamanhos, ativa };
    },
    template: `
      <div class="flex w-full max-w-st-96 flex-col gap-st-4 p-st-3">
        <StTabs
          v-for="size in tamanhos"
          :key="size"
          v-model="ativa"
          :size="size"
        >
          <template #tabs>
            <StTab
              v-for="item in mercados.slice(0, 3)"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </template>
        </StTabs>
      </div>
    `
  })
};

export const WithIcons: Story = {
  name: 'Com icones',
  render: () => ({
    components: { StTabs, StTab, StTabPanel },
    setup() {
      const ativa = ref('aovivo');

      return { mercados, ativa };
    },
    template: `
      <div class="w-full max-w-st-96 p-st-3">
        <StTabs v-model="ativa" variant="pill">
          <template #tabs>
            <StTab
              v-for="item in mercados"
              :key="item.value"
              :value="item.value"
              :label="item.label"
              :icon="item.icon"
            />
          </template>
          <StTabPanel
            v-for="item in mercados"
            :key="item.value"
            :value="item.value"
          >
            {{ item.text }}
          </StTabPanel>
        </StTabs>
      </div>
    `
  })
};

export const FullWidth: Story = {
  name: 'Largura total',
  render: () => ({
    components: { StTabs, StTab, StTabPanel },
    setup() {
      const sublinhado = ref('aovivo');
      const pilula = ref('aovivo');

      return { mercados, sublinhado, pilula };
    },
    template: `
      <div class="flex w-full max-w-st-96 flex-col gap-st-4 p-st-3">
        <StTabs v-model="sublinhado" full-width>
          <template #tabs>
            <StTab
              v-for="item in mercados.slice(0, 3)"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </template>
        </StTabs>

        <StTabs v-model="pilula" variant="pill" full-width>
          <template #tabs>
            <StTab
              v-for="item in mercados.slice(0, 3)"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </template>
        </StTabs>
      </div>
    `
  })
};

export const States: Story = {
  name: 'Estados',
  render: () => ({
    components: { StTabs, StTab },
    setup() {
      const comDesabilitada = ref('aovivo');
      const tudoBloqueado = ref('aovivo');

      return { mercados, comDesabilitada, tudoBloqueado };
    },
    template: `
      <div class="flex w-full max-w-st-96 flex-col gap-st-4 p-st-3">
        <div class="flex flex-col gap-st-1">
          <span class="text-st-body-small text-st-content-default">
            Uma aba desabilitada
          </span>
          <StTabs v-model="comDesabilitada">
            <template #tabs>
              <StTab value="aovivo" label="Ao vivo" />
              <StTab value="prejogo" label="Pre-jogo" disabled />
              <StTab value="cassino" label="Cassino" />
            </template>
          </StTabs>
        </div>

        <div class="flex flex-col gap-st-1">
          <span class="text-st-body-small text-st-content-default">
            Grupo inteiro bloqueado
          </span>
          <StTabs v-model="tudoBloqueado" disabled>
            <template #tabs>
              <StTab
                v-for="item in mercados.slice(0, 3)"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </template>
          </StTabs>
        </div>
      </div>
    `
  })
};

export const Scrollable: Story = {
  name: 'Muitas abas',
  render: () => ({
    components: { StTabs, StTab },
    setup() {
      const campeonatos = [
        'Brasileirao A',
        'Brasileirao B',
        'Copa do Brasil',
        'Libertadores',
        'Sul-Americana',
        'Premier League',
        'La Liga',
        'Serie A',
        'Bundesliga',
        'Ligue 1'
      ].map((label, index) => ({ value: `c${index}`, label }));
      const ativa = ref('c0');

      return { campeonatos, ativa };
    },
    template: `
      <div class="w-full max-w-st-80 p-st-3">
        <StTabs v-model="ativa">
          <template #tabs>
            <StTab
              v-for="item in campeonatos"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </template>
        </StTabs>
        <span class="mt-st-2 block text-st-body-small text-st-content-default">
          A lista rola na horizontal quando as abas nao cabem.
        </span>
      </div>
    `
  })
};
