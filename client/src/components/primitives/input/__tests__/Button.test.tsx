
import React from 'react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, screen } from '../../../../utils/renderWithProviders';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with the correct text', () => {
    renderWithProviders(<Button text="Click me" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls the onClick handler when clicked', async () => {
    const onClick = jest.fn();
    renderWithProviders(<Button text="Click me" onClick={onClick} />);
    await userEvent.click(screen.getByText('Click me'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when the disabled prop is true', async () => {
    const onClick = jest.fn();
    renderWithProviders(<Button text="Click me" onClick={onClick} disabled />);
    const button = screen.getByText('Click me');
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
