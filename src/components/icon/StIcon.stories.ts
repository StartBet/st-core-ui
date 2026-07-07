import type { Meta, StoryObj } from '@storybook/vue3';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faGear, faPlus, faStar } from '@fortawesome/free-solid-svg-icons';

import StIcon from './StIcon.vue';

const sizeOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
const libOptions = ['fa', 'fab'] as const;

library.add(faPlus, faStar, faGear, faFacebookF, faInstagram);

const meta = {
  title: 'Components/StIcon',
  component: StIcon,
  tags: ['autodocs'],
  args: {
    name: 'plus',
    lib: 'fa',
    size: 3,
    ariaLabel: 'Adicionar',
    className: 'text-st-content-default'
  },
  argTypes: {
    name: {
      control: 'text'
    },
    lib: {
      control: 'radio',
      options: libOptions
    },
    size: {
      control: 'select',
      options: sizeOptions
    },
    ariaLabel: {
      control: 'text'
    },
    className: {
      control: 'text'
    }
  },
  render: (args) => ({
    components: { StIcon },
    setup() {
      return { args };
    },
    template: `
      <div class="flex items-center gap-st-3">
        <StIcon v-bind="args" />
        <span class="text-st-body-small text-st-content-default">
          Use os controles para validar nome, biblioteca, tamanho e acessibilidade.
        </span>
      </div>
    `
  })
} satisfies Meta<typeof StIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => ({
    components: { StIcon },
    setup() {
      return { sizeOptions };
    },
    template: `
      <div class="flex flex-wrap items-end gap-st-4">
        <div
          v-for="size in sizeOptions"
          :key="size"
          class="flex flex-col items-center gap-st-2 rounded-st-1 bg-st-surface-2 px-st-2 py-st-2"
        >
          <StIcon
            name="star"
            :size="size"
            aria-label="Favorito"
            class-name="text-st-content-default"
          />
          <span class="text-st-body-small text-st-content-default">{{ size }}</span>
        </div>
      </div>
    `
  })
};

export const Libraries: Story = {
  render: () => ({
    components: { StIcon },
    template: `
      <div class="flex flex-wrap items-center gap-st-4">
        <div class="flex items-center gap-st-2 rounded-st-1 bg-st-surface-2 px-st-2 py-st-2">
          <StIcon
            name="gear"
            :size="3"
            aria-label="Configuracoes"
            class-name="text-st-content-default"
          />
          <span class="text-st-body-small text-st-content-default">fa / gear</span>
        </div>
        <div class="flex items-center gap-st-2 rounded-st-1 bg-st-surface-2 px-st-2 py-st-2">
          <StIcon
            name="fab:facebook-f"
            :size="3"
            aria-label="Facebook"
            class-name="text-st-content-default"
          />
          <span class="text-st-body-small text-st-content-default">fab / facebook-f</span>
        </div>
        <div class="flex items-center gap-st-2 rounded-st-1 bg-st-surface-2 px-st-2 py-st-2">
          <StIcon
            name="instagram"
            lib="fab"
            :size="3"
            aria-label="Instagram"
            class-name="text-st-content-default"
          />
          <span class="text-st-body-small text-st-content-default">lib=fab / instagram</span>
        </div>
      </div>
    `
  })
};

export const Fallback: Story = {
  render: () => ({
    components: { StIcon },
    template: `
      <div class="flex flex-wrap items-center gap-st-4">
        <div class="flex items-center gap-st-2 rounded-st-1 bg-st-surface-2 px-st-2 py-st-2">
          <StIcon
            name="does-not-exist"
            :size="3"
            aria-label="Invalido"
            class-name="border border-st-border-2 text-st-content-default"
          />
          <span class="text-st-body-small text-st-content-default">Sem svg quando o icone nao existe</span>
        </div>
      </div>
    `
  })
};
