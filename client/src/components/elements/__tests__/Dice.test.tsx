import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Dice } from '../Dice';

describe('Dice Component', () => {
  it('renders without crashing', () => {
    render(<Dice />);
  });

  it('renders a single die by default', () => {
    const { container } = render(<Dice />);
    expect(container.querySelectorAll('.die-wrapper').length).toBe(1);
  });

  it('renders the correct number of dice based on the count prop', () => {
    const { container } = render(<Dice count={3} />);
    expect(container.querySelectorAll('.die-wrapper').length).toBe(3);
  });

  it('renders the correct values on the dice', () => {
    render(<Dice values={[2, 4, 6]} />);
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('gives precedence to values prop over count prop', () => {
    const { container } = render(<Dice count={5} values={[1, 2]} />);
    expect(container.querySelectorAll('.die-wrapper').length).toBe(2);
  });

  it('applies the rolling animation when isRolling is true', () => {
    const { container } = render(<Dice isRolling={true} />);
    expect(container.firstChild).toHaveStyle('animation: shake 0.5s infinite');
  });
});
