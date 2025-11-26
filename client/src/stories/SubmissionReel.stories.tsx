
import type { Meta, StoryObj } from '@storybook/react';
import { SubmissionReel } from '../components/patterns/gameplay/SubmissionReel';

const meta: Meta<typeof SubmissionReel> = {
  title: 'Patterns/Gameplay/SubmissionReel',
  component: SubmissionReel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    submissions: [
      { player: 'Player 1', text: 'Submission 1' },
      { player: 'Player 2', text: 'Submission 2' },
      { player: 'Player 3', text: 'Submission 3' },
    ],
  },
};
