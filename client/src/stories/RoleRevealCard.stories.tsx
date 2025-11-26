
import type { Meta, StoryObj } from '@storybook/react';
import { RoleRevealCard } from '../components/patterns/gameplay/RoleRevealCard';

const meta: Meta<typeof RoleRevealCard> = {
  title: 'Patterns/Gameplay/RoleRevealCard',
  component: RoleRevealCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    role: 'Imposter',
    description: 'You are the imposter! Sabotage the mission.',
  },
};
