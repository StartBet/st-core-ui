import { ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import StButton from '../buttons/button/StButton.vue';
import StTypography from '../typography/StTypography.vue';
import StModal from './StModal.vue';

const variantOptions = [
  'surface-0',
  'surface-1',
  'surface-2',
  'surface-3',
  'surface-4',
  'surface-primary',
  'surface-secondary'
] as const;

const borderOptions = ['none', '1', '2', '3', 'primary', 'secondary'] as const;
const borderRadiusOptions = ['none', '1', '2'] as const;
const elevationOptions = [0, 1, 2, 3, 4] as const;

const meta = {
  title: 'Components/StModal',
  component: StModal,
  tags: ['autodocs'],
  args: {
    open: false,
    showCloseButton: false,
    closeOnOutsideClick: false,
    variant: 'surface-1',
    border: 'none',
    borderRadius: '1',
    elevation: 2,
    interactive: false,
    width: '64',
    padding: '4',
    className: ''
  },
  argTypes: {
    open: { control: 'boolean' },
    showCloseButton: { control: 'boolean' },
    closeOnOutsideClick: { control: 'boolean' },
    variant: { control: 'select', options: variantOptions },
    border: { control: 'select', options: borderOptions },
    borderRadius: { control: 'radio', options: borderRadiusOptions },
    elevation: { control: 'radio', options: elevationOptions },
    interactive: { control: 'boolean' },
    width: { control: 'text' },
    padding: { control: 'text' },
    className: { control: 'text' }
  },
  render: (args) => ({
    components: { StButton, StModal, StTypography },
    setup() {
      const open = ref(false);

      return { args, open };
    },
    template: `
      <div class="min-h-[22rem] rounded-st-1 bg-st-surface-2 p-st-4">
        <StButton @click="open = true">Abrir modal</StButton>

        <StModal
          v-bind="args"
          :open="open"
          @update:open="open = $event"
        >
          <div class="flex flex-col gap-st-3">
            <StTypography as="h2" variant="heading-3">Conteúdo do modal</StTypography>
            <StTypography as="p" variant="body-medium">
              Use os controles para validar superfície, borda, elevação e comportamento de fechamento.
            </StTypography>
            <div class="flex justify-end">
              <StButton variant="outline" @click="open = false">Fechar</StButton>
            </div>
          </div>
        </StModal>
      </div>
    `
  })
} satisfies Meta<typeof StModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Controlled: Story = {
  render: () => ({
    components: { StButton, StModal, StTypography },
    setup() {
      const open = ref(false);

      return { open };
    },
    template: `
      <div class="min-h-[24rem] rounded-st-1 bg-st-surface-2 p-st-4">
        <StButton @click="open = true">Abrir modal</StButton>

        <StModal
          :open="open"
          width="64"
          padding="4"
          show-close-button
          @update:open="open = $event"
        >
          <div class="flex flex-col gap-st-3">
            <StTypography as="h2" variant="heading-3">Fluxo controlado</StTypography>
            <StTypography as="p" variant="body-medium">
              Esse exemplo mostra o modal sendo controlado por um estado externo.
            </StTypography>
            <div class="flex justify-end">
              <StButton variant="outline" @click="open = false">Fechar</StButton>
            </div>
          </div>
        </StModal>
      </div>
    `
  })
};

export const CloseOnOutsideClick: Story = {
  render: () => ({
    components: { StButton, StModal, StTypography },
    setup() {
      const open = ref(false);

      return { open };
    },
    template: `
      <div class="min-h-[24rem] rounded-st-1 bg-st-surface-2 p-st-4">
        <StButton @click="open = true">Abrir com overlay</StButton>

        <StModal
          :open="open"
          width="64"
          padding="4"
          show-close-button
          close-on-outside-click
          @update:open="open = $event"
        >
          <div class="flex flex-col gap-st-3">
            <StTypography as="h2" variant="heading-3">Fechamento externo</StTypography>
            <StTypography as="p" variant="body-medium">
              Clique fora do container ou pressione Escape para fechar o modal.
            </StTypography>
          </div>
        </StModal>
      </div>
    `
  })
};

export const Variants: Story = {
  render: () => ({
    components: { StButton, StModal, StTypography },
    setup() {
      const firstOpen = ref(false);
      const secondOpen = ref(false);

      return { firstOpen, secondOpen };
    },
    template: `
      <div class="grid gap-st-4 rounded-st-1 bg-st-surface-2 p-st-4 md:grid-cols-2">
        <div class="relative min-h-[18rem] rounded-st-1 bg-st-surface-3 p-st-2">
          <StButton @click="firstOpen = true">Abrir surface-1</StButton>
          <StModal
            :open="firstOpen"
            variant="surface-1"
            border="1"
            width="56"
            padding="4"
            @update:open="firstOpen = $event"
          >
            <div class="flex flex-col gap-st-2">
              <StTypography as="h2" variant="heading-4">surface-1</StTypography>
              <StTypography as="p" variant="body-medium">Modal com borda neutra.</StTypography>
              <div class="flex justify-end">
                <StButton variant="outline" @click="firstOpen = false">Fechar</StButton>
              </div>
            </div>
          </StModal>
        </div>

        <div class="relative min-h-[18rem] rounded-st-1 bg-st-surface-3 p-st-2">
          <StButton @click="secondOpen = true">Abrir surface-secondary</StButton>
          <StModal
            :open="secondOpen"
            variant="surface-secondary"
            border="secondary"
            width="56"
            padding="4"
            @update:open="secondOpen = $event"
          >
            <div class="flex flex-col gap-st-2">
              <StTypography as="h2" variant="heading-4">surface-secondary</StTypography>
              <StTypography as="p" variant="body-medium">Modal com ênfase secundária.</StTypography>
              <div class="flex justify-end">
                <StButton variant="outline" @click="secondOpen = false">Fechar</StButton>
              </div>
            </div>
          </StModal>
        </div>
      </div>
    `
  })
};
