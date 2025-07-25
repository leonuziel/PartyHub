import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with the correct text', () => {
    render(<Button text="Click me" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls the onClick handler when clicked', () => {
    const onClick = jest.fn();
    render(<Button text="Click me" onClick={onClick} />);
    fireEvent.click(screen.getByText('Click me'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when the disabled prop is true', () => {
    const onClick = jest.fn();
    render(<Button text="Click me" onClick={onClick} disabled />);
    const button = screen.getByText('Click me');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
