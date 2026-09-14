import type { Preview } from '@storybook/vue3';
import { ref } from 'vue';

import { createStorybookTheme } from './storybook-theme';
import { StThemeProvider } from '../src/components/theme-provider';

import './preview.css';
import '../src/css/style.css';

const storybookThemeItems = [
  { value: 'dark', title: 'Dark' },
  { value: 'light', title: 'Light' }
] as const;

type StorybookThemeMode = (typeof storybookThemeItems)[number]['value'];

/**
 * O `setup` do decorator roda uma vez por story, entao o tema escolhido na
 * toolbar precisa vir de um estado reativo - um valor capturado na chamada
 * ficaria congelado no primeiro render.
 */
const previewTheme = ref<StorybookThemeMode>('dark');

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Theme applied only to the story preview',
      defaultValue: 'dark',
      toolbar: {
        icon: 'mirror',
        dynamicTitle: true,
        items: storybookThemeItems
      }
    }
  },
  parameters: {
    actions: {
      argTypesRegex: '^on[A-Z].*'
    },
    options: {
      storySort: {
        order: [
          'Overview',
          'Get Started',
          'Typography',
          'Colors',
          'Spacing',
          'Components',
          'Products'
        ]
      }
    },
    backgrounds: {
      disable: true
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    docs: {
      theme: createStorybookTheme()
    },
    layout: 'centered'
  },
  decorators: [
    /**
     * O proprio `StThemeProvider` da biblioteca define o tema do preview:
     * escopa os tokens para a story e, com `root`, espelha no `<html>` do iframe
     * para que `body` e scrollbars acompanhem.
     */
    (story, context) => {
      previewTheme.value = context.globals.theme === 'light' ? 'light' : 'dark';

      return {
        components: { story, StThemeProvider },
        setup() {
          return {
            previewBackground: 'var(--st-color-surface-3)',
            previewTheme
          };
        },
        template: `
          <StThemeProvider
            :theme="previewTheme"
            root
            style="width: 100%; height: 100%; padding: 1rem;"
            :style="{ backgroundColor: previewBackground }"
          >
            <story />
          </StThemeProvider>
        `
      };
    }
  ]
};

export default preview;
