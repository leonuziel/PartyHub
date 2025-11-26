
import type { Meta, StoryObj } from '@storybook/react';
import { PlayerVotingView } from '../components/patterns/player/PlayerVotingView';

const meta: Meta<typeof PlayerVotingView> = {
  title: 'Patterns/Player/PlayerVotingView',
  component: PlayerVotingView,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: ['Option A', 'Option B', 'Option C'],
    onVote: (option: string) => alert(`Voted for: ${option}`),
  },
};
