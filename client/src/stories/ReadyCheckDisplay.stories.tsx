
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
    players: [
      { id: '1', nickname: 'Player 1', avatar: '/avatars/avatar1.png', isReady: true },
      { id: '2', nickname: 'Player 2', avatar: '/avatars/avatar2.png', isReady: false },
      { id: '3', nickname: 'Player 3', avatar: '/avatars/avatar3.png', isReady: true },
    ],
    isHost: false,
    currentPlayerId: '2',
    onPlayerReadyToggle: (playerId: string) => alert(`Toggled ready for player ${playerId}`),
    onStartGame: () => alert('Starting game!'),
  },
};

export const HostViewAllReady: Story = {
  args: {
    players: [
      { id: '1', nickname: 'Player 1 (Host)', avatar: '/avatars/avatar1.png', isReady: true },
      { id: '2', nickname: 'Player 2', avatar: '/avatars/avatar2.png', isReady: true },
      { id: '3', nickname: 'Player 3', avatar: '/avatars/avatar3.png', isReady: true },
    ],
    isHost: true,
    currentPlayerId: '1',
    onPlayerReadyToggle: (playerId: string) => alert(`Toggled ready for player ${playerId}`),
    onStartGame: () => alert('Starting game!'),
  },
};
