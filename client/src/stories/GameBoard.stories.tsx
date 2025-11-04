
import type { Meta, StoryObj } from '@storybook/react';
import { GameBoard } from '../components/elements/GameBoard';
import { TextDisplay } from '../components/primitives/display/TextDisplay';

const meta: Meta<typeof GameBoard> = {
  title: 'Elements/GameBoard',
  component: GameBoard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <TextDisplay text="Game board content" />,
  },
};
