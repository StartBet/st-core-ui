import type { Meta, StoryObj } from '@storybook/vue3';

const toneSteps = [
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '950'
] as const;
const neutralSteps = ['0', ...toneSteps] as const;

const tokenValue = (token: string) => `var(${token})`;

const createScaleSwatches = (prefix: string, steps: readonly string[]) =>
  steps.map((step) => ({
    label: step,
    token: `--st-${prefix}-${step}`,
    value: tokenValue(`--st-${prefix}-${step}`)
  }));

const createSystemicToken = (token: string, example: string) => ({
  token,
  example,
  previewStyle: {
    backgroundColor: tokenValue(token)
  }
});

const primaryPalettes = [
  {
    name: 'Brand Primary',
    prefix: '--st-brand-primary-*',
    description: 'Escala principal da identidade da biblioteca.',
    swatches: createScaleSwatches('brand-primary', toneSteps)
  },
  {
    name: 'Brand Secondary',
    prefix: '--st-brand-secondary-*',
    description: 'Escala secundaria usada como apoio e contraste.',
    swatches: createScaleSwatches('brand-secondary', toneSteps)
  },
  {
    name: 'Neutral',
    prefix: '--st-neutral-color-*',
    description: 'Escala neutra para fundos, textos e composicao.',
    swatches: createScaleSwatches('neutral-color', neutralSteps)
  },
  {
    name: 'Info',
    prefix: '--st-info-color-*',
    description: 'Escala base de informacao.',
    swatches: createScaleSwatches('info-color', toneSteps)
  },
  {
    name: 'System',
    prefix: '--st-system-color-*',
    description: 'Escala sistemica de apoio.',
    swatches: createScaleSwatches('system-color', toneSteps)
  },
  {
    name: 'Positive',
    prefix: '--st-positive-color-*',
    description: 'Escala de confirmacao e sucesso.',
    swatches: createScaleSwatches('positive-color', toneSteps)
  },
  {
    name: 'Attention',
    prefix: '--st-attention-color-*',
    description: 'Escala de alerta e atencao.',
    swatches: createScaleSwatches('attention-color', toneSteps)
  },
  {
    name: 'Negative',
    prefix: '--st-negative-color-*',
    description: 'Escala de erro e risco.',
    swatches: createScaleSwatches('negative-color', toneSteps)
  },
  {
    name: 'Shadow Scale',
    prefix: '--st-shadow-scale-*',
    description: 'Escala translucida para profundidade e sombra.',
    swatches: createScaleSwatches('shadow-scale', toneSteps)
  },
  {
    name: 'Light Scale',
    prefix: '--st-light-scale-*',
    description: 'Escala translucida clara para contraste e brilho.',
    swatches: createScaleSwatches('light-scale', toneSteps)
  },
  {
    name: 'Bright Scale',
    prefix: '--st-bright-scale-*',
    description: 'Escala translucida clara derivada do branco.',
    swatches: createScaleSwatches('bright-scale', toneSteps)
  },
  {
    name: 'Din Scale',
    prefix: '--st-din-scale-*',
    description: 'Escala translucida escura derivada do preto.',
    swatches: createScaleSwatches('din-scale', toneSteps)
  },
  {
    name: 'Blue',
    prefix: '--st-blue-color-*',
    description: 'Escala cromatica azul.',
    swatches: createScaleSwatches('blue-color', toneSteps)
  },
  {
    name: 'Ocean',
    prefix: '--st-ocean-color-*',
    description: 'Escala cromatica ocean.',
    swatches: createScaleSwatches('ocean-color', toneSteps)
  },
  {
    name: 'Green',
    prefix: '--st-green-color-*',
    description: 'Escala cromatica verde.',
    swatches: createScaleSwatches('green-color', toneSteps)
  },
  {
    name: 'Yellow',
    prefix: '--st-yellow-color-*',
    description: 'Escala cromatica amarela.',
    swatches: createScaleSwatches('yellow-color', toneSteps)
  },
  {
    name: 'Orange',
    prefix: '--st-orange-color-*',
    description: 'Escala cromatica laranja.',
    swatches: createScaleSwatches('orange-color', toneSteps)
  },
  {
    name: 'Red',
    prefix: '--st-red-color-*',
    description: 'Escala cromatica vermelha.',
    swatches: createScaleSwatches('red-color', toneSteps)
  },
  {
    name: 'Pink',
    prefix: '--st-pink-color-*',
    description: 'Escala cromatica rosa.',
    swatches: createScaleSwatches('pink-color', toneSteps)
  },
  {
    name: 'Purple',
    prefix: '--st-purple-color-*',
    description: 'Escala cromatica roxa.',
    swatches: createScaleSwatches('purple-color', toneSteps)
  }
] as const;

const systemicGroups = [
  {
    name: 'Base',
    description:
      'Tokens semanticos principais com mesma nomenclatura entre light e dark. Podem ser usados em bg- ou text-.',
    items: [
      createSystemicToken('--st-color-brand', 'bg-st-brand / text-st-brand'),
      createSystemicToken(
        '--st-color-primary',
        'bg-st-primary / text-st-primary'
      ),
      createSystemicToken(
        '--st-color-secondary',
        'bg-st-secondary / text-st-secondary'
      ),
      createSystemicToken('--st-color-info', 'bg-st-info / text-st-info'),
      createSystemicToken('--st-color-system', 'bg-st-system / text-st-system'),
      createSystemicToken(
        '--st-color-warning',
        'bg-st-warning / text-st-warning'
      ),
      createSystemicToken(
        '--st-color-positive',
        'bg-st-positive / text-st-positive'
      ),
      createSystemicToken(
        '--st-color-negative',
        'bg-st-negative / text-st-negative'
      )
    ]
  },
  {
    name: 'Surface',
    description:
      'Tokens de superficie para composicao de fundo. Use apenas com bg-.',
    items: [
      createSystemicToken('--st-color-surface-0', 'bg-st-surface-0'),
      createSystemicToken('--st-color-surface-1', 'bg-st-surface-1'),
      createSystemicToken('--st-color-surface-2', 'bg-st-surface-2'),
      createSystemicToken('--st-color-surface-3', 'bg-st-surface-3'),
      createSystemicToken('--st-color-surface-4', 'bg-st-surface-4'),
      createSystemicToken(
        '--st-color-surface-primary',
        'bg-st-surface-primary'
      ),
      createSystemicToken(
        '--st-color-surface-secondary',
        'bg-st-surface-secondary'
      ),
      createSystemicToken('--st-color-surface-info', 'bg-st-surface-info'),
      createSystemicToken('--st-color-surface-system', 'bg-st-surface-system'),
      createSystemicToken(
        '--st-color-surface-warning',
        'bg-st-surface-warning'
      ),
      createSystemicToken(
        '--st-color-surface-positive',
        'bg-st-surface-positive'
      ),
      createSystemicToken(
        '--st-color-surface-negative',
        'bg-st-surface-negative'
      )
    ]
  },
  {
    name: 'Content',
    description:
      'Tokens de conteudo para tipografia e leitura. O uso recomendado e text-.',
    items: [
      createSystemicToken(
        '--st-color-content-default',
        'text-st-content-default'
      ),
      createSystemicToken(
        '--st-color-content-disable',
        'text-st-content-disable'
      ),
      createSystemicToken('--st-color-content-ghost', 'text-st-content-ghost'),
      createSystemicToken(
        '--st-color-content-bright',
        'text-st-content-bright'
      ),
      createSystemicToken('--st-color-content-din', 'text-st-content-din'),
      createSystemicToken(
        '--st-color-content-primary',
        'text-st-content-primary'
      ),
      createSystemicToken(
        '--st-color-content-secondary',
        'text-st-content-secondary'
      ),
      createSystemicToken('--st-color-content-info', 'text-st-content-info'),
      createSystemicToken(
        '--st-color-content-system',
        'text-st-content-system'
      ),
      createSystemicToken(
        '--st-color-content-warning',
        'text-st-content-warning'
      ),
      createSystemicToken(
        '--st-color-content-positive',
        'text-st-content-positive'
      ),
      createSystemicToken(
        '--st-color-content-negative',
        'text-st-content-negative'
      )
    ]
  },
  {
    name: 'Border',
    description: 'Tokens para contorno. O uso recomendado e border-.',
    items: [
      createSystemicToken('--st-color-border-1', 'border-st-border-1'),
      createSystemicToken('--st-color-border-2', 'border-st-border-2'),
      createSystemicToken('--st-color-border-3', 'border-st-border-3')
    ]
  },
  {
    name: 'States',
    description: 'Tokens de estado visual. Neste contexto, use com bg-.',
    items: [
      createSystemicToken('--st-color-focus', 'bg-st-focus'),
      createSystemicToken('--st-color-pressed', 'bg-st-pressed'),
      createSystemicToken(
        '--st-color-shadow-pressed',
        'var(--st-color-shadow-pressed)'
      ),
      createSystemicToken('--st-color-hover', 'bg-st-hover'),
      createSystemicToken(
        '--st-color-shadow-hover',
        'var(--st-color-shadow-hover)'
      )
    ]
  },
  {
    name: 'Shadow',
    description:
      'Tokens de apoio para composicao de sombra e brilho. A documentacao continua no contexto de shadow.',
    items: [
      createSystemicToken(
        '--st-color-shadow-0',
        'box-shadow com var(--st-color-shadow-0)'
      ),
      createSystemicToken(
        '--st-color-shadow-1',
        'box-shadow com var(--st-color-shadow-1)'
      ),
      createSystemicToken(
        '--st-color-shadow-2',
        'box-shadow com var(--st-color-shadow-2)'
      ),
      createSystemicToken(
        '--st-color-shadow-3',
        'box-shadow com var(--st-color-shadow-3)'
      ),
      createSystemicToken(
        '--st-color-light-0',
        'glow com var(--st-color-light-0)'
      ),
      createSystemicToken(
        '--st-color-light-1',
        'glow com var(--st-color-light-1)'
      ),
      createSystemicToken(
        '--st-color-light-2',
        'glow com var(--st-color-light-2)'
      ),
      createSystemicToken(
        '--st-color-light-3',
        'glow com var(--st-color-light-3)'
      )
    ]
  }
] as const;

const meta = {
  title: 'Colors',
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
        primaryPalettes,
        systemicGroups
      };
    },
    template: `
      <main class="min-h-screen bg-st-surface-3 px-st-6 py-st-8 text-st-content-default">
        <div class="mx-auto flex w-full max-w-6xl flex-col gap-st-6">
          <header class="flex flex-col gap-st-2">
            <p class="m-0 text-st-body-small font-medium uppercase tracking-[0.12em] text-st-content-secondary">
              Colors
            </p>
            <h1 class="m-0 font-st-highlight text-st-3xl font-extrabold italic leading-st-tight text-st-content-default">
              Cores da biblioteca
            </h1>
            <p class="m-0 max-w-3xl text-st-body-medium text-st-content-default">
              Esta pagina usa como base o contrato real de src/css/tokens.css. As paletas primarias mostram as escalas base e as cores sistemicas mostram os aliases semanticos reutilizados entre light e dark.
            </p>
          </header>

          <section class="rounded-st-2 bg-st-surface-2 p-st-2">
            <h2 class="m-0 text-st-body-large font-semibold text-st-content-default">
              1. Cores sistemicas
            </h2>
            <p class="mb-0 mt-st-2 text-st-body-small text-st-content-default">
              Aliases semanticos que mantem a mesma nomenclatura nos temas e devem ser aplicados conforme o contexto abaixo.
            </p>
            <div class="mt-st-3 flex flex-col gap-st-2">
              <article
                v-for="group in systemicGroups"
                :key="group.name"
                class="rounded-st-1 border border-st-border-1 bg-st-surface-3 p-st-3"
              >
                <div class="flex flex-col gap-st-2">
                  <div class="flex flex-col gap-st-1">
                    <h3 class="m-0 text-st-body-large font-semibold text-st-content-default">
                      {{ group.name }}
                    </h3>
                    <p class="m-0 text-st-body-small text-st-content-default">
                      {{ group.description }}
                    </p>
                  </div>
                  <div class="grid gap-st-2 md:grid-cols-3 xl:grid-cols-5">
                    <div
                      v-for="item in group.items"
                      :key="item.token"
                      class="rounded-st-1 bg-st-surface-2 p-st-2"
                    >
                      <div class="flex flex-col gap-st-2">
                        <div
                          class="flex h-24 items-end rounded-st-1 p-st-3"
                          :style="item.previewStyle"
                        >
                        </div>
                        <div class="flex flex-col gap-1">
                          <code class="text-st-body-small text-st-content-secondary">{{ item.token }}</code>
                          <p class="m-0 text-st-body-small text-st-content-default">
                            <code class="text-st-content-secondary">{{ item.example }}</code>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section class="rounded-st-2 bg-st-surface-2 p-st-2">
            <h2 class="m-0 text-st-body-large font-semibold text-st-content-default">
              2. Cores primarias
            </h2>
            <p class="mb-0 mt-st-2 text-st-body-small text-st-content-default">
              Escalas base publicadas em tokens.css e usadas como fundacao para o restante do sistema visual.
            </p>
            <div class="mt-st-3 flex flex-col gap-st-2">
              <article
                v-for="palette in primaryPalettes"
                :key="palette.name"
                class="rounded-st-1 border border-st-border-1 bg-st-surface-3 p-st-3"
              >
                <div class="flex flex-col gap-st-2">
                  <div class="flex flex-col gap-st-1">
                    <div class="flex flex-wrap items-center gap-st-2">
                      <h3 class="m-0 text-st-body-large font-semibold text-st-content-default">
                        {{ palette.name }}
                      </h3>
                      <code class="text-st-body-small text-st-content-secondary">{{ palette.prefix }}</code>
                    </div>
                    <p class="m-0 text-st-body-small text-st-content-default">
                      {{ palette.description }}
                    </p>
                  </div>
                  <div class="grid grid-cols-2 gap-st-2 md:grid-cols-5 xl:grid-cols-5">
                    <div
                      v-for="swatch in palette.swatches"
                      :key="swatch.token"
                      class="rounded-st-1 bg-st-surface-2 p-st-2"
                    >
                      <div
                        class="h-20 rounded-st-1 border border-st-border-1"
                        :style="{ backgroundColor: swatch.value }"
                      />
                      <p class="mb-0 mt-st-2 text-st-body-small font-medium text-st-content-default">
                        {{ swatch.label }}
                      </p>
                      <code class="text-st-body-small text-st-content-secondary">{{ swatch.token }}</code>
                    </div>
                  </div>
                </div>
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

export const Colors: Story = {};
