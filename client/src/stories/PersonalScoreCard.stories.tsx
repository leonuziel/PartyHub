
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

const mockPlayer = {
  id: 'p1',
  nickname: 'Alice',
  avatar: '/avatars/avatar1.png',
  score: 150,
};

export const Default: Story = {
  args: {
    player: mockPlayer,
    scoreDetails: {
      'Round 1': 50,
      'Round 2': 70,
      'Bonus Points': 30,
    },
    totalScore: 150,
  },
};
