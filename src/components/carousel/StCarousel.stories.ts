import type { Meta, StoryObj } from '@storybook/vue3';

import StCarousel from './StCarousel.vue';

const navigationOptions = ['outside', 'inside', 'none'] as const;
const positionOptions = ['left', 'center', 'right'] as const;
const gapOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
const slidePerPageOptions = [1, 2, 3, 4, 5, 6] as const;
const peekOptions = [0, 1, 2, 3, 4, 5, 6] as const;
const slideAlignOptions = ['left', 'center'] as const;

const slideCard = (label: string, height = 'h-st-20') => `
  <div
    class="flex ${height} w-full items-center justify-center rounded-st-2 border border-st-border-2 bg-st-surface-1 text-st-highlight-medium text-st-content-default"
  >
    ${label}
  </div>
`;

const slidesTemplate = (amount: number) => `
  <div v-for="item in ${amount}" :key="item">
    ${slideCard('{{ `Slide ${item}` }}')}
  </div>
`;

const meta = {
  title: 'Components/StCarousel',
  component: StCarousel,
  tags: ['autodocs'],
  args: {
    autoplay: false,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    autoHeight: false,
    infiniteLoop: false,
    bullets: 'outside',
    bulletsPosition: 'center',
    arrows: 'outside',
    slidePerPage: 3,
    peek: 0,
    slideAlign: 'left',
    gap: 2,
    grab: false,
    highlight: false,
    transitionDuration: 350
  },
  argTypes: {
    bullets: { control: 'select', options: navigationOptions },
    smBullets: { control: 'select', options: navigationOptions },
    mdBullets: { control: 'select', options: navigationOptions },
    lgBullets: { control: 'select', options: navigationOptions },
    bulletsPosition: { control: 'inline-radio', options: positionOptions },
    arrows: { control: 'select', options: navigationOptions },
    smArrows: { control: 'select', options: navigationOptions },
    mdArrows: { control: 'select', options: navigationOptions },
    lgArrows: { control: 'select', options: navigationOptions },
    slidePerPage: { control: 'select', options: slidePerPageOptions },
    peek: { control: 'select', options: peekOptions },
    smPeek: { control: 'select', options: peekOptions },
    mdPeek: { control: 'select', options: peekOptions },
    lgPeek: { control: 'select', options: peekOptions },
    slideAlign: { control: 'inline-radio', options: slideAlignOptions },
    smHighlight: { control: 'boolean' },
    mdHighlight: { control: 'boolean' },
    lgHighlight: { control: 'boolean' },
    smSlideAlign: { control: 'select', options: slideAlignOptions },
    mdSlideAlign: { control: 'select', options: slideAlignOptions },
    lgSlideAlign: { control: 'select', options: slideAlignOptions },
    smSlidePerPage: { control: 'select', options: slidePerPageOptions },
    mdSlidePerPage: { control: 'select', options: slidePerPageOptions },
    lgSlidePerPage: { control: 'select', options: slidePerPageOptions },
    gap: { control: 'select', options: gapOptions },
    smGap: { control: 'select', options: gapOptions },
    mdGap: { control: 'select', options: gapOptions },
    lgGap: { control: 'select', options: gapOptions },
    autoplayTimeout: { control: { type: 'number', step: 500 } },
    transitionDuration: { control: { type: 'number', step: 50 } }
  },
  render: (args) => ({
    components: { StCarousel },
    setup() {
      return { args };
    },
    template: `
      <StCarousel v-bind="args">
        ${slidesTemplate(8)}
      </StCarousel>
    `
  })
} satisfies Meta<typeof StCarousel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const OneSlidePerPage: Story = {
  args: {
    slidePerPage: 1,
    gap: 0,
    arrows: 'inside',
    bullets: 'inside'
  }
};

export const Responsive: Story = {
  name: 'Responsivo (1 / 2 / 4 colunas)',
  args: {
    slidePerPage: 1,
    smSlidePerPage: 2,
    mdSlidePerPage: 3,
    lgSlidePerPage: 4,
    gap: 1,
    mdGap: 2,
    lgGap: 3,
    arrows: 'none',
    mdArrows: 'outside',
    bullets: 'outside'
  }
};

export const AutoplayInfinito: Story = {
  args: {
    autoplay: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
    infiniteLoop: true,
    slidePerPage: 3,
    arrows: 'inside',
    bullets: 'outside'
  }
};

export const GrabComDestaque: Story = {
  name: 'Grab com destaque',
  args: {
    grab: true,
    highlight: true,
    slidePerPage: 3,
    gap: 2,
    arrows: 'none',
    bullets: 'outside'
  }
};

export const DestaqueSemGrab: Story = {
  name: 'Destaque sem grab',
  args: {
    highlight: true,
    slidePerPage: 4,
    gap: 2,
    peek: 3,
    arrows: 'outside',
    bullets: 'outside'
  }
};

export const AreaDeEscape: Story = {
  name: 'Area de escape',
  args: {
    slidePerPage: 1,
    peek: 5,
    gap: 2,
    arrows: 'inside',
    bullets: 'outside'
  }
};

export const ReferenciaCentralizada: Story = {
  name: 'Referencia centralizada',
  args: {
    slidePerPage: 3,
    slideAlign: 'center',
    peek: 4,
    gap: 2,
    grab: true,
    highlight: true,
    arrows: 'outside',
    bullets: 'outside'
  }
};

export const BulletsPositions: Story = {
  render: () => ({
    components: { StCarousel },
    template: `
      <div class="flex flex-col gap-st-4">
        <StCarousel
          v-for="position in ['left', 'center', 'right']"
          :key="position"
          :slide-per-page="3"
          :gap="2"
          arrows="none"
          bullets="outside"
          :bullets-position="position"
        >
          <div v-for="item in 6" :key="item">
            ${slideCard('{{ `${position} ${item}` }}', 'h-st-15')}
          </div>
        </StCarousel>
      </div>
    `
  })
};

export const AlturaAutomatica: Story = {
  args: {
    autoHeight: true,
    slidePerPage: 1,
    gap: 0,
    arrows: 'outside',
    bullets: 'outside'
  },
  render: (args) => ({
    components: { StCarousel },
    setup() {
      const heights = ['h-st-10', 'h-st-24', 'h-st-15', 'h-st-32'];

      return { args, heights };
    },
    template: `
      <StCarousel v-bind="args">
        <div v-for="(height, index) in heights" :key="height">
          <div
            :class="[height, 'flex w-full items-center justify-center rounded-st-2 border border-st-border-2 bg-st-surface-1 text-st-highlight-medium text-st-content-default']"
          >
            Slide {{ index + 1 }}
          </div>
        </div>
      </StCarousel>
    `
  })
};

export const ConteudoLivre: Story = {
  name: 'Slide-item livre',
  args: {
    slidePerPage: 2,
    gap: 2,
    grab: true,
    arrows: 'outside',
    bullets: 'outside'
  },
  render: (args) => ({
    components: { StCarousel },
    setup() {
      const games = [
        { title: 'Roleta ao vivo', tag: 'Cassino' },
        { title: 'Brasileirao', tag: 'Esportes' },
        { title: 'Crash', tag: 'Originais' },
        { title: 'Blackjack', tag: 'Mesas' }
      ];

      return { args, games };
    },
    template: `
      <StCarousel v-bind="args">
        <article
          v-for="game in games"
          :key="game.title"
          class="flex h-full flex-col justify-between gap-st-2 rounded-st-2 bg-st-surface-2 p-st-3"
        >
          <span class="text-st-body-small text-st-content-ghost">{{ game.tag }}</span>
          <strong class="text-st-highlight-medium text-st-content-default">{{ game.title }}</strong>
          <button
            type="button"
            class="w-fit rounded-st-1 bg-st-surface-primary px-st-2 py-st-1 text-st-body-small text-st-content-din"
          >
            Jogar
          </button>
        </article>
      </StCarousel>
    `
  })
};
