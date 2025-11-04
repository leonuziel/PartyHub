
import type { Meta, StoryObj } from '@storybook/react';
import { ReadyCheckDisplay } from '../components/patterns/lobby/ReadyCheckDisplay';

const meta: Meta<typeof ReadyCheckDisplay> = {
  title: 'Patterns/Lobby/ReadyCheckDisplay',
  component: ReadyCheckDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    players: {
      'Player 1': true,
      'Player 2': false,
      'Player 3': true,
    },
  },
};
