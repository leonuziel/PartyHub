
import type { Meta, StoryObj } from '@storybook/react';
import { PlayerAnswerView } from '../components/patterns/player/PlayerAnswerView';

const meta: Meta<typeof PlayerAnswerView> = {
  title: 'Patterns/Player/PlayerAnswerView',
  component: PlayerAnswerView,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    question: 'What is your favorite color?',
    onSubmit: (answer: string) => alert(`Answered: ${answer}`),
  },
};
