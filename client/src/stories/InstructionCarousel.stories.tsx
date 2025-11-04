
import type { Meta, StoryObj } from '@storybook/react';
import { InstructionCarousel } from '../components/patterns/lobby/InstructionCarousel';

const meta: Meta<typeof InstructionCarousel> = {
  title: 'Patterns/Lobby/InstructionCarousel',
  component: InstructionCarousel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    slides: [
      { title: 'Step 1', text: 'Welcome to the game! Follow these instructions to get started.' },
      { title: 'Step 2', text: 'Your main objective is to complete the tasks shown on the screen.' },
      { title: 'Step 3', text: 'Have fun and may the best player win! Good luck!' },
    ],
  },
};
