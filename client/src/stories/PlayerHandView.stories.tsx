
import type { Meta, StoryObj } from '@storybook/react';
import { PlayerHandView } from '../components/patterns/card_games/PlayerHandView';
import { Card } from '../components/elements/Card';

const meta: Meta<typeof PlayerHandView> = {
  title: 'Patterns/Card Games/PlayerHandView',
  component: PlayerHandView,
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
      { id: '1', content: <Card suit="hearts" rank="A" />, faceUp: true },
      { id: '2', content: <Card suit="diamonds" rank="K" />, faceUp: true },
      { id: '3', content: <Card suit="clubs" rank="Q" />, faceUp: true },
    ],
    selectedCardIds: [],
    onPlayCard: (cardId) => alert(`Playing card ${cardId}`),
    onDrawCard: () => alert('Drawing a card'),
    onPass: () => alert('Passing the turn'),
  },
};
