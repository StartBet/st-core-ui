import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import StChip from './StChip.vue';

const variantOptions = [
  'primary',
  'secondary',
  'info',
  'system',
  'warning',
  'positive',
  'negative'
] as const;

const meta = {
  title: 'Components/StChip',
  component: StChip,
  tags: ['autodocs'],
  args: {
    variant: 'primary',
    clickable: false,
    closable: false,
    className: ''
  },
  argTypes: {
    variant: {
      control: 'select',
      options: variantOptions
    },
    clickable: {
      control: 'boolean'
    },
    closable: {
      control: 'boolean'
    },
    className: {
      control: 'text'
    },
    onClose: {
      control: false
    }
  },
  render: (args) => ({
    components: { StChip },
    setup() {
      const clickCount = ref(0);
      const closeCount = ref(0);

      const handleClick = () => {
        clickCount.value += 1;
      };

      const handleClose = () => {
        closeCount.value += 1;
      };

      return { args, clickCount, closeCount, handleClick, handleClose };
    },
    template: `
      <div class="flex flex-col gap-st-3">
        <div class="flex items-center gap-st-3">
          <StChip
            v-bind="args"
            :on-close="handleClose"
            @click="handleClick"
          >
            Chip
          </StChip>
          <span class="text-st-body-small text-st-content-default">
            Use os controles para validar variante, click e close.
          </span>
        </div>
        <span class="text-st-body-small text-st-content-default">
          Clicks: {{ clickCount }} | Closes: {{ closeCount }}
        </span>
      </div>
    `
  })
} satisfies Meta<typeof StChip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => ({
    components: { StChip },
    setup() {
      return { variantOptions };
    },
    template: `
      <div class="flex flex-wrap items-center gap-st-3">
        <div
          v-for="variant in variantOptions"
          :key="variant"
          class="flex items-center gap-st-2 rounded-st-1 bg-st-surface-2 px-st-2 py-st-1"
        >
          <StChip :variant="variant">{{ variant }}</StChip>
        </div>
      </div>
    `
  })
};

export const Clickable: Story = {
  args: {
    clickable: true,
    variant: 'secondary'
  },
  render: (args) => ({
    components: { StChip },
    setup() {
      const count = ref(0);
      const handleClick = () => {
        count.value += 1;
      };

      return { args, count, handleClick };
    },
    template: `
      <div class="flex flex-col gap-st-3">
        <StChip v-bind="args" @click="handleClick">Clicavel</StChip>
        <span class="text-st-body-small text-st-content-default">
          Clique ou use Enter/Space: {{ count }}
        </span>
      </div>
    `
  })
};

export const Closable: Story = {
  args: {
    closable: true,
    variant: 'info'
  },
  render: (args) => ({
    components: { StChip },
    setup() {
      const count = ref(0);
      const handleClose = () => {
        count.value += 1;
      };

      return { args, count, handleClose };
    },
    template: `
      <div class="flex flex-col gap-st-3">
        <StChip v-bind="args" :on-close="handleClose">Fechavel</StChip>
        <span class="text-st-body-small text-st-content-default">
          Fechamentos: {{ count }}
        </span>
      </div>
    `
  })
};
