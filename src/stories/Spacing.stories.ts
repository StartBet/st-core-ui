import type { Meta, StoryObj } from '@storybook/vue3';

const spacingTokens = [
  { token: 'st-xs', value: '12px' },
  { token: 'st-sm', value: '14px' },
  { token: 'st-base', value: '16px' },
  { token: 'st-md', value: '18px' },
  { token: 'st-lg', value: '20px' },
  { token: 'st-xl', value: '24px' },
  { token: 'st-2xl', value: '30px' },
  { token: 'st-3xl', value: '36px' },
  { token: 'st-4xl', value: '48px' },
  { token: 'st-5xl', value: '60px' },
  { token: 'st-6xl', value: '72px' },
  { token: 'st-7xl', value: '80px' },
  { token: 'st-1', value: '8px' },
  { token: 'st-2', value: '16px' },
  { token: 'st-3', value: '24px' },
  { token: 'st-4', value: '32px' },
  { token: 'st-5', value: '40px' },
  { token: 'st-6', value: '48px' },
  { token: 'st-7', value: '56px' },
  { token: 'st-8', value: '64px' },
  { token: 'st-9', value: '72px' },
  { token: 'st-10', value: '80px' },
  { token: 'st-11', value: '88px' },
  { token: 'st-12', value: '96px' },
  { token: 'st-15', value: '120px' },
  { token: 'st-16', value: '128px' },
  { token: 'st-20', value: '160px' },
  { token: 'st-24', value: '192px' },
  { token: 'st-30', value: '240px' },
  { token: 'st-32', value: '256px' },
  { token: 'st-40', value: '320px' },
  { token: 'st-48', value: '384px' },
  { token: 'st-56', value: '448px' },
  { token: 'st-64', value: '512px' },
  { token: 'st-72', value: '584px' },
  { token: 'st-80', value: '640px' },
  { token: 'st-96', value: '768px' },
  { token: 'st-128', value: '1024px' },
  { token: 'st-144', value: '1152px' },
  { token: 'st-160', value: '1280px' },
  { token: 'st-168', value: '1344px' },
  { token: 'st-240', value: '1920px' }
] as const;

const meta = {
  title: 'Spacing',
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
        spacingTokens
      };
    },
    template: `
      <main class="min-h-screen bg-st-surface-3 px-st-6 py-st-8 text-st-content-default">
        <div class="mx-auto flex w-full max-w-5xl flex-col gap-st-6">
          <header class="flex flex-col gap-st-2">
            <p class="m-0 text-st-body-small font-medium uppercase tracking-[0.12em] text-st-content-secondary">
              Spacing
            </p>
            <h1 class="m-0 font-st-highlight text-st-3xl font-extrabold italic leading-st-tight text-st-content-default">
              Escala de espacamentos
            </h1>
            <p class="m-0 max-w-3xl text-st-body-medium text-st-content-default">
              Esta pagina lista os tokens de espacamento expostos pelo tema Tailwind da biblioteca e seus valores finais em px.
            </p>
          </header>

          <section class="rounded-st-2 bg-st-surface-2 p-st-4">
            <h2 class="m-0 text-st-body-large font-semibold text-st-content-default">
              Tokens disponiveis
            </h2>
            <p class="mb-0 mt-st-2 text-st-body-small text-st-content-default">
              A escala segue o principio de eight-point sempre que aplicavel, com alguns tokens derivados de rem no tema e convertidos aqui para base de 16px.
              Esses valores podem ser utilizados nos padroes de espacamento do Tailwind, como margin, padding, gap e outras utilidades relacionadas, por exemplo 'm-st-4'.
            </p>
            <div class="mt-st-3 grid gap-st-2 xl:grid-cols-8">
              <article
                v-for="item in spacingTokens"
                :key="item.token"
                class="flex flex-col gap-1 rounded-st-1 bg-st-surface-3 p-st-3"
              >
                <code class="text-st-body-small text-st-content-secondary">{{ item.token }}</code>
                <span class="text-st-body-small font-medium text-st-content-default">{{ item.value }}</span>
              </article>
            </div>
          </section>
        </div>
      </main>
    `
  })
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Spacing: Story = {};
