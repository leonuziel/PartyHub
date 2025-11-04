
import type { Meta, StoryObj } from '@storybook/react';
import { ListDisplay } from '../components/primitives/display/ListDisplay';

const meta: Meta<typeof ListDisplay> = {
  title: 'Primitives/Display/ListDisplay',
  component: ListDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: ['Apple', 'Banana', 'Orange'],
  },
};
