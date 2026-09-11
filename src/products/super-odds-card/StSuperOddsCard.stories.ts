import type { Meta, StoryObj } from '@storybook/vue3';

import StSuperOddsCard from './StSuperOddsCard.vue';

const svgLogo = (svg: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

/** Escudos vazados, como os da plataforma: pedem `fit="contain"` no avatar. */
const escudo = (cor: string, sigla: string) =>
  svgLogo(
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">
      <circle cx="60" cy="60" r="52" fill="none" stroke="${cor}" stroke-width="8"/>
      <text x="60" y="74" font-family="sans-serif" font-size="34" font-weight="bold"
        text-anchor="middle" fill="${cor}">${sigla}</text>
    </svg>`
  );

const base = {
  type: 'Turbinada',
  startDate: '2026-09-10T22:00:00',
  competition: 'Libertadores',
  home: 'Independiente',
  away: 'Flamengo',
  homeLogo: escudo('#c9c9c9', 'IND'),
  awayLogo: escudo('#e01a22', 'FLA'),
  selections: [
    { selection: 'Mais de 0.5', market: 'Chutes ao gol - Pedro (FLA)' },
    { selection: 'Mais de 1.5', market: 'Chutes ao gol - Pedro (FLA)' },
    { selection: 'Menos de 8.5', market: 'Total de escanteios' }
  ],
  price: 2,
  boostedPrice: 3
};

const meta = {
  title: 'Products/StSuperOddsCard',
  component: StSuperOddsCard,
  tags: ['autodocs'],
  args: {
    ...base,
    hideHighlight: false,
    disabled: false,
    className: ''
  },
  argTypes: {
    type: { control: 'text' },
    competition: { control: 'text' },
    home: { control: 'text' },
    away: { control: 'text' },
    price: { control: 'number' },
    boostedPrice: { control: 'number' },
    className: { control: 'text' }
  },
  render: (args) => ({
    components: { StSuperOddsCard },
    setup() {
      return { args };
    },
    template: `
      <div class="p-st-3">
        <StSuperOddsCard
          v-bind="args"
          class="w-[347px] max-w-full"
          @select="args.onSelect"
        />
      </div>
    `
  })
} satisfies Meta<typeof StSuperOddsCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tipos: Story = {
  name: 'Tipos de card',
  render: () => ({
    components: { StSuperOddsCard },
    setup() {
      return { base };
    },
    template: `
      <div class="flex flex-wrap items-start gap-st-3 p-st-3">
        <StSuperOddsCard v-bind="base" class="w-[347px] max-w-full" />
        <StSuperOddsCard
          v-bind="base"
          type="Superodds"
          type-icon="star"
          class="w-[347px] max-w-full"
        />
        <StSuperOddsCard
          v-bind="base"
          type="Bilhete do dia"
          type-icon="ticket"
          hide-highlight
          class="w-[347px] max-w-full"
        />
      </div>
    `
  })
};

export const SemTurbinada: Story = {
  name: 'Sem odd turbinada',
  render: () => ({
    components: { StSuperOddsCard },
    setup() {
      return { base };
    },
    template: `
      <div class="flex flex-wrap items-start gap-st-3 p-st-3">
        <StSuperOddsCard
          v-bind="base"
          :boosted-price="undefined"
          class="w-[347px] max-w-full"
        />
        <StSuperOddsCard
          v-bind="base"
          :selections="[base.selections[0]]"
          class="w-[347px] max-w-full"
        />
      </div>
    `
  })
};

export const SemEscudos: Story = {
  name: 'Sem escudos e sem times',
  render: () => ({
    components: { StSuperOddsCard },
    setup() {
      return { base };
    },
    template: `
      <div class="flex flex-wrap items-start gap-st-3 p-st-3">
        <StSuperOddsCard
          v-bind="base"
          :home-logo="null"
          :away-logo="null"
          class="w-[347px] max-w-full"
        />
        <StSuperOddsCard
          v-bind="base"
          home=""
          away=""
          event-name="Independiente x Flamengo"
          class="w-[347px] max-w-full"
        />
      </div>
    `
  })
};

export const Estados: Story = {
  render: () => ({
    components: { StSuperOddsCard },
    setup() {
      return { base };
    },
    template: `
      <div class="flex flex-wrap items-start gap-st-3 p-st-3">
        <StSuperOddsCard v-bind="base" disabled class="w-[347px] max-w-full" />
        <StSuperOddsCard
          v-bind="base"
          competition="Campeonato com um nome bem longo para testar o corte"
          home="Atletico Mineiro Futebol Clube"
          away="Sociedade Esportiva Palmeiras"
          class="w-[347px] max-w-full"
        />
      </div>
    `
  })
};

export const NoBilhete: Story = {
  name: 'No bilhete',
  render: () => ({
    components: { StSuperOddsCard },
    setup() {
      return { base };
    },
    template: `
      <div class="flex flex-col gap-st-2 p-st-3">
        <span class="text-st-body-small text-st-content-default">
          Quem decide o estado e o consumidor, a partir da propria store.
        </span>

        <div class="flex items-stretch gap-st-3">
          <StSuperOddsCard
            v-bind="base"
            class="w-[347px] max-w-full"
            data-teste="fora"
          />
          <StSuperOddsCard
            v-bind="base"
            active
            class="w-[347px] max-w-full"
            data-teste="dentro"
          />
        </div>
      </div>
    `
  })
};

export const AlturaIgual: Story = {
  name: 'Altura igual na fileira',
  render: () => ({
    components: { StSuperOddsCard },
    setup() {
      return { base };
    },
    template: `
      <div class="flex flex-col gap-st-2 p-st-3">
        <span class="text-st-body-small text-st-content-default">
          O container estica os cards; o card preenche a altura e prende o
          botao na base, entao fileiras com menos selecoes nao quebram.
        </span>

        <div class="flex items-stretch gap-st-3">
          <StSuperOddsCard
            v-bind="base"
            class="w-[347px] max-w-full"
            data-teste="tres"
          />
          <StSuperOddsCard
            v-bind="base"
            competition="Serie A"
            home="Genoa"
            away="Frosinone"
            :selections="[{ selection: 'Genoa e nao', market: '1x2 e ambas equipes marcam' }]"
            :price="3.5"
            :boosted-price="4"
            class="w-[347px] max-w-full"
            data-teste="uma"
          />
        </div>
      </div>
    `
  })
};

export const ComSlots: Story = {
  name: 'Selo e acao por slot',
  render: () => ({
    components: { StSuperOddsCard },
    setup() {
      return { base };
    },
    template: `
      <div class="flex flex-wrap items-start gap-st-3 p-st-3">
        <StSuperOddsCard v-bind="base" class="w-[347px] max-w-full">
          <template #type>
            <span class="text-st-xs font-bold uppercase">BB · Turbinada</span>
          </template>
        </StSuperOddsCard>

        <StSuperOddsCard v-bind="base" class="w-[347px] max-w-full">
          <template #action>
            <a
              href="#bilhete"
              class="flex w-full items-center justify-center gap-st-1 rounded-full bg-st-secondary py-st-1 text-st-body-medium font-extrabold text-st-content-din"
            >
              Adicionar ao bilhete
            </a>
          </template>
        </StSuperOddsCard>
      </div>
    `
  })
};
