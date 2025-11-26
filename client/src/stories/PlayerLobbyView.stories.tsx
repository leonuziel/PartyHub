
import type { Meta, StoryObj } from '@storybook/react';
import { PlayerLobbyView } from '../components/patterns/player/PlayerLobbyView';

const meta: Meta<typeof PlayerLobbyView> = {
  title: 'Patterns/Player/PlayerLobbyView',
  component: PlayerLobbyView,
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
  },
};
