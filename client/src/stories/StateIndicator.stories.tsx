
import type { Meta, StoryObj } from '@storybook/react';
import { StateIndicator } from '../components/primitives/feedback/StateIndicator';

const meta: Meta<typeof StateIndicator> = {
  title: 'Primitives/Feedback/StateIndicator',
  component: StateIndicator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    state: 'Waiting',
  },
};
