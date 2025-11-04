
import type { Meta, StoryObj } from '@storybook/react';
import { GameBoard } from '../components/elements/GameBoard';
import { TextDisplay } from '../components/primitives/display/TextDisplay';
import { GamePiece } from '../components/elements/GamePiece';

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
    size: { rows: 8, cols: 16 },
    children: <><TextDisplay text="Game board content" /><TextDisplay text="Game board content" /><TextDisplay text="Game board content" /><TextDisplay text="Game board content" /><GamePiece position={{ row: 3, col: 3 }} shape='square' /></>,
  },
};
