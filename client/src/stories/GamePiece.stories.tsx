
import type { Meta, StoryObj } from '@storybook/react';
import { GamePiece } from '../components/elements/GamePiece';

const meta: Meta<typeof GamePiece> = {
  title: 'Elements/GamePiece',
  component: GamePiece,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'P1',
    color: 'red',
  },
};
