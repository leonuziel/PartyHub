
import type { Meta, StoryObj } from '@storybook/react';
import { DrawingCanvas } from '../components/patterns/gameplay/DrawingCanvas';

const meta: Meta<typeof DrawingCanvas> = {
  title: 'Patterns/Gameplay/DrawingCanvas',
  component: DrawingCanvas,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 500,
    height: 500,
  },
};
