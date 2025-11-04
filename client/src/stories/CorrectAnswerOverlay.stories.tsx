
import type { Meta, StoryObj } from '@storybook/react';
import { CorrectAnswerOverlay } from '../components/patterns/results/CorrectAnswerOverlay';

const meta: Meta<typeof CorrectAnswerOverlay> = {
  title: 'Patterns/Results/CorrectAnswerOverlay',
  component: CorrectAnswerOverlay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockPlayers = [
  { id: 'p1', nickname: 'Alice', avatar: '/avatars/avatar1.png', score: 100, answerId: 'opt2' },
  { id: 'p2', nickname: 'Bob', avatar: '/avatars/avatar2.png', score: 120, answerId: 'opt2' },
  { id: 'p3', nickname: 'Charlie', avatar: '/avatars/avatar3.png', score: 90, answerId: 'opt1' },
  { id: 'p4', nickname: 'Diana', avatar: '/avatars/avatar4.png', score: 150, answerId: 'opt3' },
  { id: 'p5', nickname: 'Eve', avatar: '/avatars/avatar5.png', score: 110, answerId: 'opt2' },
];

const mockOptions = [
  { id: 'opt1', content: 'London' },
  { id: 'opt2', content: 'Paris' },
  { id: 'opt3', content: 'Berlin' },
  { id: 'opt4', content: 'Madrid' },
];

export const Default: Story = {
  args: {
    options: mockOptions,
    correctAnswerId: 'opt2',
    players: mockPlayers,
    onComplete: () => alert('Overlay complete!'),
  },
};
