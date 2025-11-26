
import type { Meta, StoryObj } from '@storybook/react';
import { InGameNotification } from '../components/patterns/meta/InGameNotification';

const meta: Meta<typeof InGameNotification> = {
  title: 'Patterns/Meta/InGameNotification',
  component: InGameNotification,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: 'Player 1 has joined the game!',
  },
};
