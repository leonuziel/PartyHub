
import type { Meta, StoryObj } from '@storybook/react';
import { CorrectAnswerOverlay } from '../components/patterns/results/CorrectAnswerOverlay';

const meta: Meta<typeof CorrectAnswerOverlay> = {
  title: 'Patterns/Results/CorrectAnswerOverlay',
  component: CorrectAnswerOverlay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    correctAnswer: 'Paris',
  },
};
