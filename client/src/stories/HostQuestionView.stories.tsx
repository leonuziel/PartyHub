
import type { Meta, StoryObj } from '@storybook/react';
import { HostQuestionView } from '../components/patterns/host/HostQuestionView';

const meta: Meta<typeof HostQuestionView> = {
  title: 'Patterns/Host/HostQuestionView',
  component: HostQuestionView,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    question: 'What is the capital of France?',
    answers: ['London', 'Berlin', 'Paris', 'Madrid'],
  },
};
