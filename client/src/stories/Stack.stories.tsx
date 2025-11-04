
import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '../components/primitives/layout/Stack';
import { TextDisplay } from '../components/primitives/display/TextDisplay';

const meta: Meta<typeof Stack> = {
  title: 'Primitives/Layout/Stack',
  component: Stack,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: [
      <TextDisplay text="Item 1" />,
      <TextDisplay text="Item 2" />,
      <TextDisplay text="Item 3" />,
    ],
  },
};
