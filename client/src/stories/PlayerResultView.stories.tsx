
import type { Meta, StoryObj } from '@storybook/react';
import { PlayerResultView } from '../components/patterns/player/PlayerResultView';

const meta: Meta<typeof PlayerResultView> = {
  title: 'Patterns/Player/PlayerResultView',
  component: PlayerResultView,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isCorrect: true,
    correctAnswer: 'Paris',
  },
};
