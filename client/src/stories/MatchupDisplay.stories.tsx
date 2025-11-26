
import type { Meta, StoryObj } from '@storybook/react';
import { MatchupDisplay } from '../components/patterns/gameplay/MatchupDisplay';

const meta: Meta<typeof MatchupDisplay> = {
  title: 'Patterns/Gameplay/MatchupDisplay',
  component: MatchupDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    player1: 'Player 1',
    player2: 'Player 2',
  },
};
