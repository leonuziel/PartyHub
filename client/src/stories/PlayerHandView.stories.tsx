
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
    hand: [
      { suit: 'hearts', rank: 'A' },
      { suit: 'diamonds', rank: 'K' },
    ],
  },
};
