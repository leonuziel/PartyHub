
import type { Meta, StoryObj } from '@storybook/react';
import { BiddingView } from '../components/patterns/card_games/BiddingView';

const meta: Meta<typeof BiddingView> = {
  title: 'Patterns/Card Games/BiddingView',
  component: BiddingView,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    bids: {
      'Player 1': 100,
      'Player 2': 200,
    },
    onBid: (amount: number) => alert(`Bid: ${amount}`),
  },
};
