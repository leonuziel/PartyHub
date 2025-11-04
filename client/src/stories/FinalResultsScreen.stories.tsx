
import type { Meta, StoryObj } from '@storybook/react';
import { FinalResultsScreen } from '../components/patterns/results/FinalResultsScreen';

const meta: Meta<typeof FinalResultsScreen> = {
  title: 'Patterns/Results/FinalResultsScreen',
  component: FinalResultsScreen,
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
