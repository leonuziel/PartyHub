
import type { Meta, StoryObj } from '@storybook/react';
import { TurnOrderDisplay } from '../components/patterns/gameplay/TurnOrderDisplay';

const meta: Meta<typeof TurnOrderDisplay> = {
  title: 'Patterns/Gameplay/TurnOrderDisplay',
  component: TurnOrderDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    players: ['Player 1', 'Player 2', 'Player 3'],
    currentPlayer: 'Player 2',
  },
};
