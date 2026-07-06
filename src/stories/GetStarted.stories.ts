import type { Meta, StoryObj } from '@storybook/vue3';

import packageJson from '../../package.json';

const meta = {
  title: 'Get Started',
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
        packageName: packageJson.name,
        installCommand: 'npm install @startbet/st-core-ui',
        quickStartCss: "import '@startbet/st-core-ui/style.css';",
        quickStartComponent: `<script setup lang="ts">
import { StTypography } from '@startbet/st-core-ui';
</script>

<template>
  <StTypography as="h2" variant="heading-3">
    Titulo da secao
  </StTypography>
</template>`,
        tailwindConfig: `import { stTailwindPlugins, stTailwindTheme } from '@startbet/st-core-ui';

export default {
  theme: {
    extend: {
      ...stTailwindTheme
    }
  },
  plugins: [...stTailwindPlugins]
};`,
        tokensImport: `@import '@startbet/st-core-ui/tokens.css';
@tailwind base;
@tailwind components;
@tailwind utilities;`
      };
    },
    template: `
      <main class="min-h-screen bg-st-surface-3 px-st-6 py-st-8 text-st-content-default">
        <div class="mx-auto flex w-full max-w-5xl flex-col gap-st-6">
          <header class="flex flex-col gap-st-2">
            <p class="m-0 text-st-body-small font-medium uppercase tracking-[0.12em] text-st-content-secondary">
              Get Started
            </p>
            <h1 class="m-0 font-st-highlight text-st-3xl font-extrabold italic leading-st-tight text-st-content-default">
              Configure {{ packageName }}
            </h1>
            <p class="m-0 max-w-3xl text-st-body-medium text-st-content-default">
              Use esta pagina como referencia rápida para instalar a biblioteca, carregar os estilos base e integrar os tokens do Design System ao projeto que vai consumir a lib.
            </p>
          </header>

          <section class="rounded-st-2 bg-st-surface-2 p-st-4">
            <h2 class="m-0 text-st-body-large font-semibold text-st-content-default">
              1. Instalacao
            </h2>
            <p class="mb-0 mt-st-2 text-st-body-small text-st-content-default">
              Instale o pacote publicado:
            </p>
            <pre class="mb-0 mt-st-2 overflow-x-auto rounded-st-1 bg-st-surface-3 p-st-3 text-st-body-small text-st-content-default"><code>{{ installCommand }}</code></pre>
          </section>

          <section class="rounded-st-2 bg-st-surface-2 p-st-4">
            <h2 class="m-0 text-st-body-large font-semibold text-st-content-default">
              2. Projeto novo ou simples
            </h2>
            <p class="mb-0 mt-st-2 text-st-body-small text-st-content-default">
              Para uma integracao rapida, importe o CSS principal da biblioteca e comece a consumir os componentes.
            </p>
            <pre class="mb-0 mt-st-2 overflow-x-auto rounded-st-1 bg-st-surface-3 p-st-3 text-st-body-small text-st-content-default"><code>{{ quickStartCss }}</code></pre>
            <pre class="mb-0 mt-st-3 overflow-x-auto rounded-st-1 bg-st-surface-3 p-st-3 text-st-body-small text-st-content-default"><code>{{ quickStartComponent }}</code></pre>
          </section>

          <section class="rounded-st-2 bg-st-surface-2 p-st-4">
            <h2 class="m-0 text-st-body-large font-semibold text-st-content-default">
              3. Projeto existente com Tailwind
            </h2>
            <p class="mb-0 mt-st-2 text-st-body-small text-st-content-default">
              Se o projeto ja possui um Tailwind configurado, faca merge do tema exportado pela lib em vez de substituir a configuracao local.
            </p>
            <pre class="mb-0 mt-st-2 overflow-x-auto rounded-st-1 bg-st-surface-3 p-st-3 text-st-body-small text-st-content-default"><code>{{ tailwindConfig }}</code></pre>
            <p class="mb-0 mt-st-3 text-st-body-small text-st-content-default">
              Carregue tambem os tokens CSS no arquivo global principal da aplicacao:
            </p>
            <pre class="mb-0 mt-st-2 overflow-x-auto rounded-st-1 bg-st-surface-3 p-st-3 text-st-body-small text-st-content-default"><code>{{ tokensImport }}</code></pre>
          </section>
        </div>
      </main>
    `
  })
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const GetStarted: Story = {};
