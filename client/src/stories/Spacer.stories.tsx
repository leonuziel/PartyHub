
import type { Meta, StoryObj } from '@storybook/react';
import { Spacer } from '../components/primitives/layout/Spacer';

const meta: Meta<typeof Spacer> = {
  title: 'Primitives/Layout/Spacer',
  component: Spacer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: '1rem',
  },
};
