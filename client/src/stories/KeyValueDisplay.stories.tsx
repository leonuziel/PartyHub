
import type { Meta, StoryObj } from '@storybook/react';
import { KeyValueDisplay } from '../components/primitives/display/KeyValueDisplay';

const meta: Meta<typeof KeyValueDisplay> = {
  title: 'Primitives/Display/KeyValueDisplay',
  component: KeyValueDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: {
      'Player': 'John Doe',
      'Score': 100,
      'Status': 'Active',
    }
  },
};
