
import type { Meta, StoryObj } from '@storybook/react';
import { FinalResultsScreen } from '../components/patterns/results/FinalResultsScreen';

const meta: Meta<typeof FinalResultsScreen> = {
  title: 'Patterns/Results/FinalResultsScreen',
  component: FinalResultsScreen,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockPlayers = [
  { id: 'p2', nickname: 'Bob', avatar: '/avatars/avatar2.png', score: 200 },
  { id: 'p3', nickname: 'Charlie', avatar: '/avatars/avatar3.png', score: 150 },
  { id: 'p1', nickname: 'Alice', avatar: '/avatars/avatar1.png', score: 100 },
  { id: 'p4', nickname: 'Diana', avatar: '/avatars/avatar4.png', score: 90 },
];

export const Default: Story = {
  args: {
    players: mockPlayers,
    onPlayAgain: () => alert('Play Again!'),
    onExit: () => alert('Exit to Lobby'),
  },
};
