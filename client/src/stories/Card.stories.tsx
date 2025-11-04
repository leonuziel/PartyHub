
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '../components/elements/Card';

const meta: Meta<typeof Card> = {
  title: 'Elements/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    suit: 'hearts',
    rank: 'A',
    faceUp: true,
  },
};
