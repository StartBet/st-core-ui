import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import StRadioGroup from '../radio-group/StRadioGroup.vue';
import StRadio from './StRadio.vue';

const meta = {
  title: 'Components/StRadio',
  component: StRadio,
  tags: ['autodocs'],
  args: {
    defaultChecked: false,
    disabled: false,
    label: 'Opção',
    className: ''
  },
  argTypes: {
    defaultChecked: {
      control: 'boolean'
    },
    disabled: {
      control: 'boolean'
    },
    label: {
      control: 'text'
    },
    className: {
      control: 'text'
    },
    checked: {
      control: false
    }
  },
  render: (args) => ({
    components: { StRadio },
    setup() {
      const checked = ref(Boolean(args.defaultChecked));

      return { args, checked };
    },
    template: `
      <div class="flex flex-col gap-st-3">
        <StRadio
          v-bind="args"
          :checked="checked"
          @update:checked="checked = $event"
        />
        <span class="text-st-body-small text-st-content-default">
          Estado atual: {{ checked ? 'marcado' : 'desmarcado' }}
        </span>
      </div>
    `
  })
} satisfies Meta<typeof StRadio>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => ({
    components: { StRadio },
    template: `
      <div class="flex flex-col gap-st-3">
        <StRadio label="Unchecked" name="states" value="a" />
        <StRadio default-checked label="Checked" name="states" value="b" />
        <StRadio disabled label="Disabled" name="states" value="c" />
      </div>
    `
  })
};

export const Controlled: Story = {
  render: () => ({
    components: { StRadio },
    setup() {
      const checked = ref(false);

      return { checked };
    },
    template: `
      <div class="flex flex-col gap-st-3">
        <StRadio
          :checked="checked"
          label="Modo controlado"
          @update:checked="checked = $event"
        />
        <span class="text-st-body-small text-st-content-default">
          Valor controlado: {{ checked }}
        </span>
      </div>
    `
  })
};

export const WithinGroup: Story = {
  render: () => ({
    components: { StRadio, StRadioGroup },
    setup() {
      const value = ref('b');

      return { value };
    },
    template: `
      <div class="flex flex-col gap-st-3">
        <StRadioGroup :value="value" @update:value="value = $event">
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
};
