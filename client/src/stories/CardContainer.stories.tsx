
import type { Meta, StoryObj } from '@storybook/react';
import { CardContainer } from '../components/elements/CardContainer';
import { Card } from '../components/elements/Card';

const meta: Meta<typeof CardContainer> = {
  title: 'Elements/CardContainer',
  component: CardContainer,
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
      { id: '1', content: 'Card 1', faceUp: true },
      { id: '2', content: 'Card 2', faceUp: true },
      { id: '3', content: 'Card 3', faceUp: true },
      { id: '4', content: 'Card 4', faceUp: false },
    ],
    onCardClick: (cardId: string) => alert(`Card clicked: ${cardId}`),
  },
};
