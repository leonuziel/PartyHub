
import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from '../components/primitives/input/Slider';

const meta: Meta<typeof Slider> = {
  title: 'Primitives/Input/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    min: 0,
    max: 100,
    defaultValue: 50,
  },
};
