
import type { Meta, StoryObj } from '@storybook/react';
import { HostLeaderboardView } from '../components/patterns/host/HostLeaderboardView';

const meta: Meta<typeof HostLeaderboardView> = {
  title: 'Patterns/Host/HostLeaderboardView',
  component: HostLeaderboardView,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    scores: {
      'Player 1': 100,
      'Player 2': 200,
      'Player 3': 150,
    },
  },
};
