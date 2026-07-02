import type { Meta, StoryObj } from '@storybook/vue3';

import packageJson from '../../package.json';

const meta = {
  title: 'Overview',
  tags: ['!autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: {
      disable: true,
      exclude: /.*/
    },
    actions: {
      disable: true
    },
    a11y: {
      disable: true
    }
  },
  render: () => ({
    setup() {
      return {
        description:
          'Biblioteca de componentes Vue 3 com Vite, Tailwind CSS e Storybook. O pacote foi pensado para ser consumido em projetos Vue/Nuxt e tambem expõe tokens de design, estilos CSS e configuracao Tailwind reutilizavel.',
        packageName: packageJson.name,
        packageVersion: packageJson.version
      };
    },
    template: `
      <main
        class="min-h-screen bg-st-surface-3 px-st-6 py-st-8 text-st-content-default flex flex-col gap-st-2"
      >
        <h1 class="relative z-20 m-0 max-w-[75%] overflow-hidden p-0 px-1 font-st-highlight text-st-3xl font-extrabold italic leading-st-tight text-st-content-default text-shadow-st-large [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
          <span>@startbet/</span>
          <br>
          <span class="relative pr-1 text-st-content-secondary [text-shadow:none] bg-[linear-gradient(140deg,transparent_45%,var(--st-bright-scale-700)_45%,var(--st-bright-scale-700)_65%,transparent_65%),linear-gradient(0deg,var(--st-color-content-secondary)_0%,var(--st-color-content-secondary)_100%)] bg-clip-text text-transparent drop-shadow-[-4px_4px_0px_var(--st-shadow-scale-950)]">
            st-core-ui</span>
        </h1>
        <p class="max-w-2xl text-st-body-medium">
          {{ description }}
        </p>
        <p class="text-st-content-secondary text-st-body-small font-medium">
          v{{ packageVersion }}
        </p>
      </main>
    `
  })
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {};
