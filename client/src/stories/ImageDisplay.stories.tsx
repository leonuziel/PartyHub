
import type { Meta, StoryObj } from '@storybook/react';
import { ImageDisplay } from '../components/primitives/display/ImageDisplay';

const meta: Meta<typeof ImageDisplay> = {
  title: 'Primitives/Display/ImageDisplay',
  component: ImageDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    url: 'https://via.placeholder.com/150',
    alt: 'Placeholder Image',
  },
};
