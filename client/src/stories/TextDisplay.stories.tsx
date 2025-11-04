
import type { Meta, StoryObj } from '@storybook/react';
import { TextDisplay } from '../components/primitives/display/TextDisplay';

const meta: Meta<typeof TextDisplay> = {
  title: 'Primitives/Display/TextDisplay',
  component: TextDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Hello, World!',
  },
};

export const Large: Story = {
  args: {
    text: 'Hello, World!',
    size: 'large',
  },
};

export const Small: Story = {
  args: {
    text: 'Hello, World!',
    size: 'small',
  },
};
