
import type { Meta, StoryObj } from '@storybook/react';
import { ChoiceSelector } from '../components/primitives/input/ChoiceSelector';

const meta: Meta<typeof ChoiceSelector> = {
  title: 'Primitives/Input/ChoiceSelector',
  component: ChoiceSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    onSelect: (choice: string) => alert(`Selected: ${choice}`),
  },
};
