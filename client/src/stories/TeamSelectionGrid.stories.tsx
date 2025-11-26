
import type { Meta, StoryObj } from '@storybook/react';
import { TeamSelectionGrid } from '../components/patterns/lobby/TeamSelectionGrid';

const meta: Meta<typeof TeamSelectionGrid> = {
  title: 'Patterns/Lobby/TeamSelectionGrid',
  component: TeamSelectionGrid,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockPlayers = [
  { id: 'p1', nickname: 'Alice', avatar: '/avatars/avatar1.png' },
  { id: 'p2', nickname: 'Bob', avatar: '/avatars/avatar2.png' },
  { id: 'p3', nickname: 'Charlie', avatar: '/avatars/avatar3.png' },
  { id: 'p4', nickname: 'Diana', avatar: '/avatars/avatar4.png' },
  { id: 'p5', nickname: 'Eve', avatar: '/avatars/avatar5.png' },
];

export const Default: Story = {
  args: {
    teams: [
      { id: 't1', name: 'Red Team', color: '#e74c3c', players: [mockPlayers[0], mockPlayers[1]] },
      { id: 't2', name: 'Blue Team', color: '#3498db', players: [mockPlayers[2]] },
    ],
    players: [mockPlayers[3], mockPlayers[4]],
    isHost: false,
    onJoinTeam: (teamId: string) => alert(`Joined team ${teamId}`),
    onMovePlayer: (playerId: string, teamId: string) => alert(`Moved player ${playerId} to team ${teamId}`),
  },
};

export const HostView: Story = {
  args: {
    teams: [
      { id: 't1', name: 'Red Team', color: '#e74c3c', players: [mockPlayers[0], mockPlayers[1]] },
      { id: 't2', name: 'Blue Team', color: '#3498db', players: [mockPlayers[2]] },
    ],
    players: [mockPlayers[3], mockPlayers[4]],
    isHost: true,
    onJoinTeam: (teamId: string) => alert(`Joined team ${teamId}`),
    onMovePlayer: (playerId: string, teamId: string) => alert(`Moved player ${playerId} to team ${teamId}`),
  },
};
