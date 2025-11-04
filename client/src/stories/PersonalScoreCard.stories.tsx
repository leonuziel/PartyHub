
import type { Meta, StoryObj } from '@storybook/react';
import { PersonalScoreCard } from '../components/patterns/results/PersonalScoreCard';

const meta: Meta<typeof PersonalScoreCard> = {
  title: 'Patterns/Results/PersonalScoreCard',
  component: PersonalScoreCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    player: 'Player 1',
    score: 100,
    rank: 2,
  },
};
