import type { Preview } from '@storybook/vue3';
import { createStorybookTheme } from './storybook-theme';

import './preview.css';
import '../src/css/style.css';

const storybookThemeItems = [
  { value: 'dark', title: 'Dark' },
  { value: 'light', title: 'Light' }
] as const;

type StorybookThemeMode = (typeof storybookThemeItems)[number]['value'];

const applyPreviewTheme = (theme: StorybookThemeMode) => {
  if (typeof document === 'undefined') {
    return;
  }

  if (theme === 'dark') {
    document.documentElement.dataset.theme = 'dark';
    return;
  }

  delete document.documentElement.dataset.theme;
};

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
        order: ['Overview', 'Get Started', 'Components']
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
    (story, context) => {
      const selectedTheme: StorybookThemeMode =
        context.globals.theme === 'light' ? 'light' : 'dark';

      applyPreviewTheme(selectedTheme);

      return {
        components: { story },
        setup() {
          return {
            previewBackground: 'var(--st-color-surface-3)',
            selectedTheme
          };
        },
        template: `
          <div
            :key="selectedTheme"
            :data-theme="selectedTheme"
            style="width: 100%; height: 100%; padding: 1rem;"
            :style="{ backgroundColor: previewBackground }"
          >
            <story />
          </div>
        `
      };
    }
  ]
};

export default preview;
