
import type { Meta, StoryObj } from '@storybook/react';
import { Timer } from '../components/primitives/feedback/Timer';

const meta: Meta<typeof Timer> = {
  title: 'Primitives/Feedback/Timer',
  component: Timer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    duration: 60,
  },
};
