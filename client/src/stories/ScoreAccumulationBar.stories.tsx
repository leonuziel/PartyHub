
import type { Meta, StoryObj } from '@storybook/react';
import { ScoreAccumulationBar } from '../components/patterns/results/ScoreAccumulationBar';

const meta: Meta<typeof ScoreAccumulationBar> = {
  title: 'Patterns/Results/ScoreAccumulationBar',
  component: ScoreAccumulationBar,
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
