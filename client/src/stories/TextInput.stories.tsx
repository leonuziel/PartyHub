
import type { Meta, StoryObj } from '@storybook/react';
import { TextInput } from '../components/primitives/input/TextInput';

const meta: Meta<typeof TextInput> = {
  title: 'Primitives/Input/TextInput',
  component: TextInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text here...',
  },
};
