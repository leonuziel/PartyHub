
import type { Meta, StoryObj } from '@storybook/react';
import { Container } from '../components/primitives/layout/Container';
import { TextDisplay } from '../components/primitives/display/TextDisplay';

const meta: Meta<typeof Container> = {
  title: 'Primitives/Layout/Container',
  component: Container,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <TextDisplay text="This is a container" />,
  },
};
