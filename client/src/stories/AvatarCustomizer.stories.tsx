
import type { Meta, StoryObj } from '@storybook/react';
import { AvatarCustomizer } from '../components/patterns/lobby/AvatarCustomizer';

const meta: Meta<typeof AvatarCustomizer> = {
  title: 'Patterns/Lobby/AvatarCustomizer',
  component: AvatarCustomizer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    avatars: ['avatar1.png', 'avatar2.png', 'avatar3.png'],
    onSelect: (avatar: string) => alert(`Selected: ${avatar}`),
  },
};
