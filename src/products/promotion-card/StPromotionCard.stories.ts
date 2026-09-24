import type { Meta, StoryObj } from '@storybook/vue3';

import StPromotionCard from './StPromotionCard.vue';
import StCarousel from '../../components/carousel/StCarousel.vue';
import StChip from '../../components/chip/StChip.vue';

const banner = (inicio: string, fim: string, titulo: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${inicio}"/>
        <stop offset="1" stop-color="${fim}"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="54%" font-family="sans-serif" font-size="64" font-weight="900"
      text-anchor="middle" fill="#fff">${titulo}</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const promocoes = [
  {
    slug: 'super-cashback',
    name: 'Super Cashback Semanal',
    description: 'Aqui sua diversão vai mais longe',
    image: banner('#6a1fd1', '#2b0a6b', 'CASHBACK 26%')
  },
  {
    slug: 'rodadas-gratis',
    name: 'Rodadas grátis toda sexta',
    description: 'Deposite e ganhe até 100 giros nos slots selecionados',
    image: banner('#9be22d', '#1f5e00', 'FREE SPINS')
  },
  {
    slug: 'odds-turbinadas',
    name: 'Odds turbinadas',
    description: 'Os maiores jogos do fim de semana com odds aumentadas',
    image: banner('#ff7a00', '#6b1500', 'SUPER ODDS')
  },
  {
    slug: 'indique',
    name: 'Indique e ganhe',
    description: 'Convide amigos e receba bônus a cada cadastro',
    image: banner('#3aa0ff', '#0a2b6b', 'INDIQUE')
  }
];

const base = { ...promocoes[0], href: '/promotions/super-cashback' };

const meta = {
  title: 'Products/StPromotionCard',
  component: StPromotionCard,
  tags: ['autodocs'],
  args: {
    name: base.name,
    description: base.description,
    image: base.image,
    href: base.href,
    ctaLabel: 'Saiba mais',
    showCta: true,
    ctaVariant: 'solid',
    ctaColor: 'secondary',
    ctaSize: 'small',
    loading: false,
    className: ''
  },
  argTypes: {
    name: { control: 'text' },
    description: { control: 'text' },
    image: { control: 'text' },
    imageLoading: { control: 'inline-radio', options: ['lazy', 'eager'] },
    href: { control: 'text' },
    ctaLabel: { control: 'text' },
    showCta: { control: 'boolean' },
    ctaVariant: {
      control: 'inline-radio',
      options: ['solid', 'outline', 'text', 'ghost']
    },
    ctaColor: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'positive', 'negative']
    },
    ctaSize: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
    loading: { control: 'boolean' },
    className: { control: 'text' }
  },
  render: (args) => ({
    components: { StPromotionCard },
    setup() {
      return { args };
    },
    template: `
      <div class="p-st-3">
        <div class="w-[360px] max-w-full">
          <StPromotionCard v-bind="args" @click.prevent />
        </div>
      </div>
    `
  })
} satisfies Meta<typeof StPromotionCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Carrossel: Story = {
  name: 'No carrossel',
  render: () => ({
    components: { StPromotionCard, StCarousel },
    setup() {
      return { promocoes };
    },
    template: `
      <div class="p-st-3 lg:w-[1080px]">
        <StCarousel
          arrows="none"
          bullets="none"
          grab
          slide-class-name="flex"
          :slide-per-page="1"
          :sm-slide-per-page="2"
          :lg-slide-per-page="3"
          :peek="6"
          :md-peek="4"
          highlight
        >
          <StPromotionCard
            v-for="(promo, index) in promocoes"
            :key="promo.slug"
            :name="promo.name"
            :description="promo.description"
            :image="promo.image"
            :image-loading="index === 0 ? 'eager' : 'lazy'"
            :href="'/promotions/' + promo.slug"
            @click.prevent
          />
        </StCarousel>
      </div>
    `
  })
};

export const Grade: Story = {
  name: 'Grade de promoções',
  render: () => ({
    components: { StPromotionCard },
    setup() {
      return { promocoes };
    },
    template: `
      <div class="grid grid-cols-1 gap-st-2 p-st-3 sm:grid-cols-2 lg:w-[760px]">
        <StPromotionCard
          v-for="promo in promocoes"
          :key="promo.slug"
          v-bind="promo"
          :href="'/promotions/' + promo.slug"
          @click.prevent
        />
      </div>
    `
  })
};

export const Estados: Story = {
  render: () => ({
    components: { StPromotionCard },
    setup() {
      return { base };
    },
    template: `
      <div class="grid grid-cols-1 gap-st-2 p-st-3 sm:grid-cols-2 lg:w-[760px]">
        <StPromotionCard loading />
        <StPromotionCard v-bind="base" :image="null" />
        <StPromotionCard v-bind="base" image="https://invalido.exemplo/404.webp" />
        <StPromotionCard v-bind="base" description="" :show-cta="false" />
      </div>
    `
  })
};

export const ComSlotDoTopo: Story = {
  name: 'Selo pelo slot do topo',
  render: () => ({
    components: { StPromotionCard, StChip },
    setup() {
      return { base };
    },
    template: `
      <div class="p-st-3">
        <div class="w-[360px] max-w-full">
          <StPromotionCard v-bind="base" @click.prevent>
            <template #top-start>
              <StChip variant="warning">Termina hoje</StChip>
            </template>
          </StPromotionCard>
        </div>
      </div>
    `
  })
};
