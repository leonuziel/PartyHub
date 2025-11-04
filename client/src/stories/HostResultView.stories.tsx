
import type { Meta, StoryObj } from '@storybook/react';
import { HostResultView } from '../components/patterns/host/HostResultView';

const meta: Meta<typeof HostResultView> = {
  title: 'Patterns/Host/HostResultView',
  component: HostResultView,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    results: {
      'Player 1': true,
      'Player 2': false,
      'Player 3': true,
    },
  },
};
