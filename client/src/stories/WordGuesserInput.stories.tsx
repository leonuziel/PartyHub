
import type { Meta, StoryObj } from '@storybook/react';
import { WordGuesserInput } from '../components/patterns/gameplay/WordGuesserInput';

const meta: Meta<typeof WordGuesserInput> = {
  title: 'Patterns/Gameplay/WordGuesserInput',
  component: WordGuesserInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    word: 'storybook',
    onGuess: (guess: string) => alert(`Guessed: ${guess}`),
  },
};
