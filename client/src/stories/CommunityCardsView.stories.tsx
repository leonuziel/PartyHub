
import type { Meta, StoryObj } from '@storybook/react';
import { CommunityCardsView } from '../components/patterns/card_games/CommunityCardsView';
import { Card } from '../components/elements/Card';

const meta: Meta<typeof CommunityCardsView> = {
  title: 'Patterns/Card Games/CommunityCardsView',
  component: CommunityCardsView,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    cards: [
      { suit: 'hearts', rank: 'A' },
      { suit: 'diamonds', rank: 'K' },
      { suit: 'clubs', rank: 'Q' },
    ],
  },
};
