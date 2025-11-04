
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

export const Default: Story = {
  args: {
    teams: {
      'Team 1': ['Player 1', 'Player 2'],
      'Team 2': ['Player 3', 'Player 4'],
    },
    onSelectTeam: (team: string) => alert(`Selected: ${team}`),
  },
};
