import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, watch } from 'vue';

import StButton from '../button/StButton.vue';
import type {
  ButtonColor,
  ButtonSize,
  ButtonVariant
} from '../button/StButton.interface';
import StButtonGroup from './StButtonGroup.vue';
import type {
  StButtonGroupOrientation,
  StButtonGroupValue
} from './StButtonGroup.interface';

const variantOptions = ['solid', 'outline', 'text'] as const;
const colorOptions = ['primary', 'secondary', 'positive', 'negative'] as const;
const sizeOptions = ['small', 'medium', 'large'] as const;
const orientationOptions = ['horizontal', 'vertical'] as const;

type ButtonGroupStoryArgs = {
  value?: StButtonGroupValue;
  defaultValue?: StButtonGroupValue;
  multiple: boolean;
  orientation: StButtonGroupOrientation;
  variant: ButtonVariant;
  size: ButtonSize;
  color: ButtonColor;
  disabled: boolean;
  className: string;
};

const buttonItems = [
  ['sports', 'Esportes'],
  ['casino', 'Casino'],
  ['live', 'Live']
] as const;

const renderInteractiveGroup = (
  args: ButtonGroupStoryArgs,
  items = buttonItems
) => ({
  components: { StButton, StButtonGroup },
  setup() {
    const value = ref<StButtonGroupValue>(
      args.value ?? args.defaultValue ?? (args.multiple ? [] : '')
    );

    watch(
      () => [args.value, args.defaultValue, args.multiple] as const,
      ([nextValue, nextDefaultValue, multiple]) => {
        value.value = nextValue ?? nextDefaultValue ?? (multiple ? [] : '');
      },
      { immediate: true }
    );

    return { args, items, value };
  },
  template: `
    <div class="flex flex-col gap-st-3">
      <StButtonGroup
        :value="value"
        :multiple="args.multiple"
        :orientation="args.orientation"
        :variant="args.variant"
        :size="args.size"
        :color="args.color"
        :disabled="args.disabled"
        :class-name="args.className"
        @update:value="value = $event"
      >
        <StButton
          v-for="[itemValue, label] in items"
          :key="itemValue"
          :value="itemValue"
        >
          {{ label }}
        </StButton>
      </StButtonGroup>
      <span class="text-st-body-small text-st-content-default">
        Valor atual: {{ Array.isArray(value) ? value.join(', ') || 'nenhum' : value || 'nenhum' }}
      </span>
    </div>
  `
});

const meta = {
  title: 'Components/StButtonGroup',
  component: StButtonGroup,
  tags: ['autodocs'],
  args: {
    value: undefined,
    defaultValue: 'sports',
    multiple: false,
    orientation: 'horizontal',
    variant: 'solid',
    size: 'medium',
    color: 'primary',
    disabled: false,
    className: ''
  },
  argTypes: {
    value: {
      control: false
    },
    defaultValue: {
      control: false
    },
    multiple: {
      control: 'boolean'
    },
    orientation: {
      control: 'radio',
      options: orientationOptions
    },
    variant: {
      control: 'select',
      options: variantOptions
    },
    size: {
      control: 'radio',
      options: sizeOptions
    },
    color: {
      control: 'select',
      options: colorOptions
    },
    disabled: {
      control: 'boolean'
    },
    className: {
      control: 'text'
    }
  },
  render: (args) => renderInteractiveGroup(args as ButtonGroupStoryArgs)
} satisfies Meta<typeof StButtonGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => ({
    components: { StButton, StButtonGroup },
    setup() {
      return { colorOptions, variantOptions };
    },
    template: `
      <div class="flex flex-col gap-st-3">
        <div
          v-for="variant in variantOptions"
          :key="variant"
          class="flex flex-wrap items-center gap-st-2"
        >
          <StButtonGroup
            v-for="color in colorOptions"
            :key="variant + color"
            :variant="variant"
            :color="color"
            :default-value="'sports'"
          >
            <StButton value="sports">Sports</StButton>
            <StButton value="casino">Casino</StButton>
          </StButtonGroup>
        </div>
      </div>
    `
  })
};

export const Multiple: Story = {
  args: {
    multiple: true,
    defaultValue: ['sports', 'live'],
    variant: 'outline',
    color: 'positive'
  },
  render: (args) => renderInteractiveGroup(args as ButtonGroupStoryArgs)
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    size: 'small',
    color: 'secondary',
    defaultValue: 'casino'
  },
  render: (args) => renderInteractiveGroup(args as ButtonGroupStoryArgs)
};

export const Controlled: Story = {
  render: () => ({
    components: { StButton, StButtonGroup },
    setup() {
      const selected = ref<StButtonGroupValue>('week');

      return { selected };
    },
    template: `
      <div class="flex flex-col gap-st-3">
        <StButtonGroup v-model:value="selected" color="secondary">
          <StButton value="day">Dia</StButton>
          <StButton value="week">Semana</StButton>
          <StButton value="month">Mes</StButton>
        </StButtonGroup>
        <span class="text-st-body-small text-st-content-default">
          Selecionado: {{ selected }}
        </span>
      </div>
    `
  })
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'sports',
    color: 'negative'
  },
  render: (args) => renderInteractiveGroup(args as ButtonGroupStoryArgs)
};
