
import type { Meta, StoryObj } from '@storybook/react';
import { CardContainer } from '../components/elements/CardContainer';
import { Card } from '../components/elements/Card';

const meta: Meta<typeof CardContainer> = {
  title: 'Elements/CardContainer',
  component: CardContainer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: [
      <Card suit="hearts" rank="A" />,
      <Card suit="diamonds" rank="K" />,
      <Card suit="clubs" rank="Q" />,
      <Card suit="spades" rank="J" />,
    ],
  },
};
