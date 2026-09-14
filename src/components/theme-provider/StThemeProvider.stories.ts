import type { Meta, StoryObj } from '@storybook/vue3';

import { ref } from 'vue';

import StThemeProvider from './StThemeProvider.vue';
import StButton from '../buttons/button/StButton.vue';
import StModal from '../modal/StModal.vue';
import StPaper from '../paper/StPaper.vue';
import StTypography from '../typography/StTypography.vue';
import { useTheme } from '../../composables/useTheme';

const themeOptions = ['inherit', 'light', 'dark', 'system'] as const;

const meta = {
  title: 'Components/StThemeProvider',
  component: StThemeProvider,
  tags: ['autodocs'],
  args: {
    theme: 'dark',
    as: 'div',
    root: false,
    inline: false,
    className: ''
  },
  argTypes: {
    theme: {
      control: 'select',
      options: themeOptions
    },
    as: {
      control: 'select',
      options: ['div', 'section', 'article']
    },
    root: {
      control: 'boolean'
    },
    inline: {
      control: 'boolean'
    },
    className: {
      control: 'text'
    }
  }
} satisfies Meta<typeof StThemeProvider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => ({
    components: { StThemeProvider, StPaper, StTypography },
    setup() {
      return { args };
    },
    template: `
      <StThemeProvider v-bind="args">
        <StPaper variant="surface-1" padding="3">
          <StTypography as="h3" variant="heading-4">
            Superficie no tema {{ args.theme }}
          </StTypography>
          <StTypography variant="body-medium">
            Os tokens vem do escopo criado pelo provider, nao do documento.
          </StTypography>
        </StPaper>
      </StThemeProvider>
    `
  })
};

export const IlhasAninhadas: Story = {
  name: 'Ilhas aninhadas',
  render: () => ({
    components: { StThemeProvider, StPaper, StTypography },
    template: `
      <StThemeProvider theme="dark">
        <StPaper variant="surface-1" padding="3">
          <StTypography as="h3" variant="heading-4">Escopo escuro</StTypography>

          <StThemeProvider theme="light">
            <StPaper variant="surface-1" padding="3" margin="1 0">
              <StTypography as="h4" variant="body-large">
                Ilha clara dentro do escuro
              </StTypography>

              <StThemeProvider theme="dark">
                <StPaper variant="surface-1" padding="3" margin="1 0">
                  <StTypography variant="body-medium">
                    E outra ilha escura dentro da clara
                  </StTypography>
                </StPaper>
              </StThemeProvider>
            </StPaper>
          </StThemeProvider>
        </StPaper>
      </StThemeProvider>
    `
  })
};

export const PreferenciaDoSistema: Story = {
  name: 'Preferencia do sistema',
  render: () => ({
    components: { StThemeProvider, StPaper, StTypography },
    template: `
      <StThemeProvider theme="system">
        <StPaper variant="surface-1" padding="3">
          <StTypography variant="body-medium">
            Segue o prefers-color-scheme do sistema operacional.
          </StTypography>
        </StPaper>
      </StThemeProvider>
    `
  })
};

const ThemeSwitch = {
  name: 'ThemeSwitch',
  components: { StButton, StTypography },
  setup() {
    const { resolvedTheme, toggle } = useTheme();

    return { resolvedTheme, toggle };
  },
  template: `
    <div>
      <StTypography variant="body-medium">
        Tema atual: {{ resolvedTheme }}
      </StTypography>
      <StButton variant="solid" color="primary" size="small" @click="toggle">
        Alternar tema
      </StButton>
    </div>
  `
};

export const ConteudoTeleportado: Story = {
  name: 'Conteudo teleportado',
  render: () => ({
    components: { StThemeProvider, StButton, StModal, StPaper, StTypography },
    setup() {
      const open = ref(false);

      return { open };
    },
    template: `
      <StThemeProvider theme="dark">
        <StPaper variant="surface-1" padding="3">
          <StTypography as="h3" variant="heading-4">App escuro</StTypography>

          <StThemeProvider theme="light">
            <StPaper variant="surface-1" padding="3" margin="1 0">
              <StTypography variant="body-medium">
                O modal e declarado nesta ilha clara e teleportado para o body.
              </StTypography>
              <StButton
                variant="solid"
                color="primary"
                size="small"
                @click="open = true"
              >
                Abrir modal
              </StButton>

              <StModal
                :open="open"
                show-close-button
                close-on-outside-click
                width="64"
                padding="4"
                @update:open="open = $event"
              >
                <StTypography variant="body-medium">
                  Teleportado para o body, mas ainda no tema da ilha.
                </StTypography>
              </StModal>
            </StPaper>
          </StThemeProvider>
        </StPaper>
      </StThemeProvider>
    `
  })
};

export const AlternandoComUseTheme: Story = {
  name: 'Alternando com useTheme',
  render: () => ({
    components: { StThemeProvider, StPaper, ThemeSwitch },
    template: `
      <StThemeProvider theme="light">
        <StPaper variant="surface-1" padding="3">
          <ThemeSwitch />
        </StPaper>
      </StThemeProvider>
    `
  })
};
