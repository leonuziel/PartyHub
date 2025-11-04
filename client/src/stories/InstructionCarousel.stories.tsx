
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
    instructions: [
      'Instruction 1',
      'Instruction 2',
      'Instruction 3',
    ],
  },
};
