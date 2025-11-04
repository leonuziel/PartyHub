
import type { Meta, StoryObj } from '@storybook/react';
import { Grid } from '../components/primitives/layout/Grid';
import { TextDisplay } from '../components/primitives/display/TextDisplay';

const meta: Meta<typeof Grid> = {
  title: 'Primitives/Layout/Grid',
  component: Grid,
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
      <TextDisplay text="Item 4" />,
    ],
  },
};
