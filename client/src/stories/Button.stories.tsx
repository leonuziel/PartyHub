
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/primitives/input/Button';

const meta: Meta<typeof Button> = {
    title: 'Primitives/Input/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        onClick: { action: 'clicked' },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        label: 'Button',
        variant: 'primary',
    },
};

export const Secondary: Story = {
    args: {
        label: 'Button',
        variant: 'secondary',
    },
};
