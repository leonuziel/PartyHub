
import type { Meta, StoryObj } from '@storybook/react';
import { EmojiReactionToolbar } from '../components/patterns/feedback/EmojiReactionToolbar';

const meta: Meta<typeof EmojiReactionToolbar> = {
  title: 'Patterns/Feedback/EmojiReactionToolbar',
  component: EmojiReactionToolbar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onReaction: (emoji: string) => alert(`Reacted with: ${emoji}`),
  },
};
