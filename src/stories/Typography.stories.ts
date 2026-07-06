import type { Meta, StoryObj } from '@storybook/vue3';

const fontFamilies = [
  {
    token: 'font-st-heading',
    family: 'Base Neue Condensed',
    note: 'Usada para headings do Design System.',
    previewClass: 'font-st-heading'
  },
  {
    token: 'font-st-highlight',
    family: 'Base Neue Condensed',
    note: 'Usada para textos de destaque e titulos com mais personalidade.',
    previewClass: 'font-st-highlight italic'
  },
  {
    token: 'font-st-body',
    family: 'Montserrat',
    note: 'Usada para textos corridos, descricoes e apoio.',
    previewClass: 'font-st-body'
  }
] as const;

const typographyVariantDefs = [
  [
    'text-st-hero-title',
    'Hero Title',
    '3rem / 1.5 / 800',
    'font-st-heading text-st-hero-title'
  ],
  [
    'text-st-heading-1',
    'Heading 1',
    '3rem / 1.1 / 800',
    'font-st-heading text-st-heading-1'
  ],
  [
    'text-st-heading-2',
    'Heading 2',
    '2.25rem / 1.1 / 800',
    'font-st-heading text-st-heading-2'
  ],
  [
    'text-st-heading-3',
    'Heading 3',
    '1.875rem / 1.25 / 800',
    'font-st-heading text-st-heading-3'
  ],
  [
    'text-st-heading-4',
    'Heading 4',
    '1.5rem / 1.25 / 800',
    'font-st-heading text-st-heading-4'
  ],
  [
    'text-st-highlight-large',
    'Highlight Large',
    '1.5rem / 1.5 / 600',
    'font-st-highlight text-st-highlight-large italic'
  ],
  [
    'text-st-highlight-medium',
    'Highlight Medium',
    '1.125rem / 1.5 / 600',
    'font-st-highlight text-st-highlight-medium italic'
  ],
  [
    'text-st-body-large',
    'Body Large',
    '1.125rem / 1.75 / 400',
    'font-st-body text-st-body-large'
  ],
  [
    'text-st-body-medium',
    'Body Medium',
    '1rem / 1.75 / 400',
    'font-st-body text-st-body-medium'
  ],
  [
    'text-st-body-small',
    'Body Small',
    '0.875rem / 1.5 / 400',
    'font-st-body text-st-body-small'
  ]
] as const;

const typographyVariants = typographyVariantDefs.map(
  ([token, sample, meta, className]) => ({
    token,
    sample,
    meta,
    className
  })
);

const meta = {
  title: 'Typography',
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
        baseNeueImport: "import '@startbet/st-core-ui/base-neue.css';",
        montserratImport: "import '@startbet/st-core-ui/montserrat.css';",
        usageExample: `<h1 class="font-st-highlight text-st-heading-2">
  Titulo de destaque
</h1>

<p class="font-st-body text-st-body-medium">
  Texto de apoio com a tipografia base da biblioteca.
</p>`,
        fontFamilies,
        typographyVariants
      };
    },
    template: `
      <main class="min-h-screen bg-st-surface-3 px-st-6 py-st-8 text-st-content-default">
        <div class="mx-auto flex w-full max-w-5xl flex-col gap-st-6">
          <header class="flex flex-col gap-st-2">
            <p class="m-0 text-st-body-small font-medium uppercase tracking-[0.12em] text-st-content-secondary">
              Typography
            </p>
            <h1 class="m-0 font-st-highlight text-st-3xl font-extrabold italic leading-st-tight text-st-content-default">
              Tipografia da biblioteca
            </h1>
            <p class="m-0 max-w-3xl text-st-body-medium text-st-content-default">
              Esta pagina documenta as familias e variacoes tipograficas expostas pelo tema Tailwind da lib, alem dos imports publicos necessarios para carregar as fontes nos projetos consumidores.
            </p>
          </header>

          <section class="rounded-st-2 bg-st-surface-2 p-st-4">
            <h2 class="m-0 text-st-body-large font-semibold text-st-content-default">
              1. Import das fontes
            </h2>
            <p class="mb-0 mt-st-2 text-st-body-small text-st-content-default">
              Importe os arquivos de fonte publicos antes de consumir os tokens tipograficos:
            </p>
            <pre class="mb-0 mt-st-2 overflow-x-auto rounded-st-1 bg-st-surface-3 p-st-3 text-st-body-small text-st-content-default"><code>{{ baseNeueImport }}</code></pre>
            <pre class="mb-0 mt-st-2 overflow-x-auto rounded-st-1 bg-st-surface-3 p-st-3 text-st-body-small text-st-content-default"><code>{{ montserratImport }}</code></pre>
          </section>

          <section class="rounded-st-2 bg-st-surface-2 p-st-4">
            <h2 class="m-0 text-st-body-large font-semibold text-st-content-default">
              2. Familias disponiveis
            </h2>
            <div class="mt-st-3 grid gap-st-3">
              <article
                v-for="family in fontFamilies"
                :key="family.token"
                class="rounded-st-1 border border-st-border-1 bg-st-surface-3 p-st-3"
              >
                <div class="flex flex-col gap-st-2">
                  <div class="flex flex-wrap items-center gap-st-2">
                    <code class="text-st-body-small text-st-content-secondary">{{ family.token }}</code>
                    <span class="text-st-body-small text-st-content-default">{{ family.family }}</span>
                  </div>
                  <p class="m-0 text-st-body-small text-st-content-default">
                    {{ family.note }}
                  </p>
                  <p :class="family.previewClass" class="m-0 text-st-2xl text-st-content-default">
                    The quick brown fox jumps over the lazy dog
                  </p>
                </div>
              </article>
            </div>
          </section>

          <section class="rounded-st-2 bg-st-surface-2 p-st-4">
            <h2 class="m-0 text-st-body-large font-semibold text-st-content-default">
              3. Escala tipografica
            </h2>
            <div class="mt-st-3 flex flex-col gap-st-3">
              <article
                v-for="variant in typographyVariants"
                :key="variant.token"
                class="rounded-st-1 border border-st-border-1 bg-st-surface-3 p-st-3"
              >
                <div class="flex flex-col gap-st-2">
                  <div class="flex flex-wrap items-center gap-st-2">
                    <code class="text-st-body-small text-st-content-secondary">{{ variant.token }}</code>
                    <span class="text-st-body-small text-st-content-default">{{ variant.meta }}</span>
                  </div>
                  <p :class="variant.className" class="m-0 text-st-content-default">
                    {{ variant.sample }}
                  </p>
                </div>
              </article>
            </div>
          </section>

          <section class="rounded-st-2 bg-st-surface-2 p-st-4">
            <h2 class="m-0 text-st-body-large font-semibold text-st-content-default">
              4. Exemplo de uso
            </h2>
            <p class="mb-0 mt-st-2 text-st-body-small text-st-content-default">
              Combine as classes de familia e tamanho semantico diretamente nos componentes do projeto consumidor.
            </p>
            <pre class="mb-0 mt-st-2 overflow-x-auto rounded-st-1 bg-st-surface-3 p-st-3 text-st-body-small text-st-content-default"><code>{{ usageExample }}</code></pre>
          </section>
        </div>
      </main>
    `
  })
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Typography: Story = {};
