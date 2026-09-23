import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import StGameCard from './StGameCard.vue';
import StBadge from '../../components/badge/StBadge.vue';

const capa = (inicio: string, fim: string, titulo: string, largura = 300) => {
  const altura = largura === 300 ? 390 : 169;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${largura}" height="${altura}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${inicio}"/>
        <stop offset="1" stop-color="${fim}"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="42%" font-family="sans-serif" font-size="34" font-weight="900"
      text-anchor="middle" fill="#fff">${titulo}</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const jogos = [
  {
    name: 'Fortune Rabbit',
    provider: { name: 'PGSoft', slug: 'pgsoft' },
    image: capa('#ff7ab6', '#6a1fd1', 'Rabbit')
  },
  {
    name: 'Gates of Olympus',
    provider: { name: 'Pragmatic Play', slug: 'pragmatic' },
    image: capa('#3aa0ff', '#2b0a6b', 'Olympus')
  },
  {
    name: 'Aviator',
    provider: { name: 'Spribe', slug: 'spribe' },
    image: capa('#ff3b3b', '#3b0000', 'Aviator')
  },
  {
    name: 'Fortune Tiger',
    provider: { name: 'PGSoft', slug: 'pgsoft' },
    image: capa('#ffb300', '#b30000', 'Tiger')
  }
];

const base = { ...jogos[0], href: '/play/pgsoft/fortune-rabbit' };

const meta = {
  title: 'Products/StGameCard',
  component: StGameCard,
  tags: ['autodocs'],
  args: {
    ...base,
    aspect: 'portrait',
    showName: true,
    favorite: false,
    showFavorite: true,
    loading: false,
    className: ''
  },
  argTypes: {
    name: { control: 'text' },
    provider: { control: 'object' },
    image: { control: 'text' },
    aspect: { control: 'inline-radio', options: ['portrait', 'wide'] },
    imageLoading: { control: 'inline-radio', options: ['lazy', 'eager'] },
    showName: { control: 'boolean' },
    loading: { control: 'boolean' },
    href: { control: 'text' },
    playLabel: { control: 'text' },
    favorite: { control: 'boolean' },
    showFavorite: { control: 'boolean' },
    className: { control: 'text' }
  },
  render: (args) => ({
    components: { StGameCard },
    setup() {
      return { args };
    },
    template: `
      <div class="p-st-3">
        <div class="w-[180px] max-w-full">
          <StGameCard v-bind="args" @click.prevent />
        </div>
      </div>
    `
  })
} satisfies Meta<typeof StGameCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Grade: Story = {
  name: 'Grade de jogos',
  render: () => ({
    components: { StGameCard },
    setup() {
      return { jogos };
    },
    template: `
      <div class="grid grid-cols-3 gap-st-1 p-st-3 sm:grid-cols-4 lg:w-[760px]">
        <StGameCard
          v-for="jogo in jogos"
          :key="jogo.name"
          v-bind="jogo"
          :href="'/play/' + jogo.provider.slug"
          @click.prevent
        />
      </div>
    `
  })
};

export const Wide: Story = {
  name: 'Formato wide',
  render: () => ({
    components: { StGameCard },
    setup() {
      const wide = jogos.map((jogo) => ({
        ...jogo,
        image: capa('#6a1fd1', '#16002e', jogo.name.split(' ')[0], 480)
      }));

      return { wide };
    },
    template: `
      <div class="grid grid-cols-2 gap-st-1 p-st-3 lg:w-[640px]">
        <StGameCard
          v-for="jogo in wide"
          :key="jogo.name"
          v-bind="jogo"
          aspect="wide"
          href="#"
          @click.prevent
        />
      </div>
    `
  })
};

export const Estados: Story = {
  render: () => ({
    components: { StGameCard },
    setup() {
      return { base };
    },
    template: `
      <div class="grid grid-cols-2 gap-st-1 p-st-3 sm:grid-cols-4 lg:w-[760px]">
        <StGameCard loading />
        <StGameCard v-bind="base" :image="null" />
        <StGameCard v-bind="base" image="https://invalido.exemplo/404.webp" />
        <StGameCard />
      </div>
    `
  })
};

export const SemNome: Story = {
  name: 'Sem nome visivel',
  render: () => ({
    components: { StGameCard },
    setup() {
      return { base };
    },
    template: `
      <div class="flex gap-st-1 p-st-3">
        <div class="w-[180px]">
          <StGameCard v-bind="base" :show-name="false" />
        </div>
        <div class="w-[180px]">
          <StGameCard v-bind="base" :show-name="false" :provider="null" />
        </div>
      </div>
    `
  })
};

export const Favorito: Story = {
  name: 'Favorito',
  render: () => ({
    components: { StGameCard },
    setup() {
      const favoritos = ref<string[]>(['Aviator']);

      const toggle = (name: string, value: boolean) => {
        favoritos.value = value
          ? [...favoritos.value, name]
          : favoritos.value.filter((item) => item !== name);
      };

      return { jogos, favoritos, toggle };
    },
    template: `
      <div class="flex flex-col gap-st-2 p-st-3">
        <span class="text-st-body-small text-st-content-default">
          Quem guarda o estado e o consumidor; o ultimo card esconde a estrela.
        </span>

        <div class="grid grid-cols-3 gap-st-1 sm:grid-cols-4 lg:w-[760px]">
          <StGameCard
            v-for="jogo in jogos"
            :key="jogo.name"
            v-bind="jogo"
            href="#"
            :favorite="favoritos.includes(jogo.name)"
            :show-favorite="jogo.name !== 'Fortune Tiger'"
            @update:favorite="toggle(jogo.name, $event)"
            @click.prevent
          />
        </div>
      </div>
    `
  })
};

export const ComSlotDoTopo: Story = {
  name: 'Jogadores online pelo slot',
  render: () => ({
    components: { StGameCard, StBadge },
    setup() {
      const favorite = ref(false);

      return { base, favorite };
    },
    template: `
      <div class="p-st-3">
        <div class="w-[180px]">
          <StGameCard v-bind="base" v-model:favorite="favorite" @click.prevent>
            <template #top-start>
              <span class="flex items-center gap-[6px] rounded-full bg-st-surface-shadow-2 px-st-1 py-[4px] text-st-xs font-bold text-st-content-bright">
                <StBadge variant="positive" pulse />
                1.2k
              </span>
            </template>
          </StGameCard>
        </div>
      </div>
    `
  })
};
