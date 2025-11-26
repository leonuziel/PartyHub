
import type { Meta, StoryObj } from '@storybook/react';
import { PhaseBanner } from '../components/patterns/gameplay/PhaseBanner';

const meta: Meta<typeof PhaseBanner> = {
  title: 'Patterns/Gameplay/PhaseBanner',
  component: PhaseBanner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    phase: 'Bidding Phase',
  },
};
