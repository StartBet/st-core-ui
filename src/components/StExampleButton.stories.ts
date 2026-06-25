import type { Meta, StoryObj } from '@storybook/vue3';

import StExampleButton from './StExampleButton.vue';

const meta = {
  title: 'Components/StExampleButton',
  component: StExampleButton,
  tags: ['autodocs'],
  args: {
    label: 'Click me',
    variant: 'primary'
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['primary', 'secondary']
    }
  }
} satisfies Meta<typeof StExampleButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    label: 'Secondary action'
  }
};
