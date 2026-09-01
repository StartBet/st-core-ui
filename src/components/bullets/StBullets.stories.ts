import type { Meta, StoryObj } from '@storybook/vue3';

import StBullets from './StBullets.vue';

const sizeOptions = ['small', 'medium', 'large'] as const;
const alignOptions = ['left', 'center', 'right'] as const;

const meta = {
  title: 'Components/StBullets',
  component: StBullets,
  tags: ['autodocs'],
  args: {
    total: 5,
    modelValue: 1,
    size: 'medium',
    align: 'center',
    interactive: true
  },
  argTypes: {
    size: { control: 'inline-radio', options: sizeOptions },
    align: { control: 'inline-radio', options: alignOptions },
    total: { control: { type: 'number', min: 0, max: 12 } },
    modelValue: { control: { type: 'number', min: 0, max: 11 } }
  },
  render: (args) => ({
    components: { StBullets },
    setup() {
      return { args };
    },
    template: `
      <div class="rounded-st-2 bg-st-surface-1 p-st-3">
        <StBullets v-bind="args" />
      </div>
    `
  })
} satisfies Meta<typeof StBullets>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => ({
    components: { StBullets },
    template: `
      <div class="flex flex-col gap-st-3 rounded-st-2 bg-st-surface-1 p-st-3">
        <StBullets
          v-for="size in ['small', 'medium', 'large']"
          :key="size"
          :total="5"
          :model-value="2"
          :size="size"
        />
      </div>
    `
  })
};

export const Interativo: Story = {
  render: () => ({
    components: { StBullets },
    setup() {
      return {};
    },
    data: () => ({ current: 0 }),
    template: `
      <div class="flex flex-col items-center gap-st-2 rounded-st-2 bg-st-surface-1 p-st-3">
        <span class="text-st-body-small text-st-content-default">
          Slide ativo: {{ current + 1 }}
        </span>
        <StBullets v-model="current" :total="6" />
      </div>
    `
  })
};

export const Decorativo: Story = {
  args: {
    interactive: false,
    total: 4,
    modelValue: 3
  }
};
