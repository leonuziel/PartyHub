
import type { Meta, StoryObj } from '@storybook/react';
import { VotingGrid } from '../components/patterns/results/VotingGrid';

const meta: Meta<typeof VotingGrid> = {
  title: 'Patterns/Results/VotingGrid',
  component: VotingGrid,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: ['Option A', 'Option B', 'Option C'],
    votes: {
      'Option A': ['Player 1', 'Player 3'],
      'Option B': ['Player 2'],
      'Option C': [],
    },
  },
};
