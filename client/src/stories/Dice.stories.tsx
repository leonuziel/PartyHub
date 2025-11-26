
import type { Meta, StoryObj } from '@storybook/react';
import { Dice } from '../components/elements/Dice';

const meta: Meta<typeof Dice> = {
  title: 'Elements/Dice',
  component: Dice,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 6,
  },
};
