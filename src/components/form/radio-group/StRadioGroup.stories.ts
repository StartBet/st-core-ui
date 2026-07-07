import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import StRadio from '../radio/StRadio.vue';
import StRadioGroup from './StRadioGroup.vue';

const orientationOptions = ['vertical', 'horizontal'] as const;

const meta = {
  title: 'Components/StRadioGroup',
  component: StRadioGroup,
  tags: ['autodocs'],
  args: {
    defaultValue: 'b',
    disabled: false,
    dense: false,
    orientation: 'vertical',
    className: ''
  },
  argTypes: {
    defaultValue: {
      control: 'text'
    },
    disabled: {
      control: 'boolean'
    },
    dense: {
      control: 'boolean'
    },
    orientation: {
      control: 'radio',
      options: orientationOptions
    },
    className: {
      control: 'text'
    },
    value: {
      control: false
    },
    onValueChange: {
      control: false
    }
  },
  render: (args) => ({
    components: { StRadio, StRadioGroup },
    setup() {
      const value = ref(String(args.defaultValue ?? ''));

      return { args, value };
    },
    template: `
      <div class="flex flex-col gap-st-3">
        <StRadioGroup
          v-bind="args"
          :value="value"
          @update:value="value = $event"
        >
          <StRadio value="a" label="Opção A" />
          <StRadio value="b" label="Opção B" />
          <StRadio value="c" label="Opção C" />
        </StRadioGroup>
        <span class="text-st-body-small text-st-content-default">
          Selecionado: {{ value }}
        </span>
      </div>
    `
  })
} satisfies Meta<typeof StRadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Vertical: Story = {
  render: () => ({
    components: { StRadio, StRadioGroup },
    template: `
      <StRadioGroup default-value="b">
        <StRadio value="a" label="Opção A" />
        <StRadio value="b" label="Opção B" />
        <StRadio value="c" label="Opção C" />
      </StRadioGroup>
    `
  })
};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal'
  },
  render: () => ({
    components: { StRadio, StRadioGroup },
    template: `
      <StRadioGroup orientation="horizontal" default-value="sports">
        <StRadio value="sports" label="Esportes" />
        <StRadio value="casino" label="Cassino" />
        <StRadio value="poker" label="Poker" />
      </StRadioGroup>
    `
  })
};

export const Disabled: Story = {
  args: {
    disabled: true
  },
  render: () => ({
    components: { StRadio, StRadioGroup },
    template: `
      <StRadioGroup disabled default-value="a">
        <StRadio value="a" label="Desabilitado A" />
        <StRadio value="b" label="Desabilitado B" />
      </StRadioGroup>
    `
  })
};

export const Dense: Story = {
  args: {
    dense: true
  },
  render: () => ({
    components: { StRadio, StRadioGroup },
    template: `
      <StRadioGroup dense default-value="b">
        <StRadio value="a" label="Compacto A" />
        <StRadio value="b" label="Compacto B" />
        <StRadio value="c" label="Compacto C" />
      </StRadioGroup>
    `
  })
};
