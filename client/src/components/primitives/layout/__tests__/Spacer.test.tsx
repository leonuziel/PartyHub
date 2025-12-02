import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Spacer } from '../Spacer';

describe('Spacer', () => {
  test('renders with default styles', () => {
    render(<Spacer />);
    const spacer = screen.getByTestId('spacer');
    expect(spacer).toBeInTheDocument();
    expect(spacer).toHaveStyle('flex-grow: 1');
  });

  test('accepts and applies custom styles', () => {
    const customStyle = {
      height: '50px',
      backgroundColor: 'red',
    };
    render(<Spacer style={customStyle} />);
    const spacer = screen.getByTestId('spacer');
    expect(spacer).toBeInTheDocument();
    expect(spacer).toHaveStyle('flex-grow: 1');
    expect(spacer).toHaveStyle('height: 50px');
    expect(spacer).toHaveStyle('background-color: rgb(255, 0, 0)');
  });

  test('can override default styles', () => {
    const overrideStyle = {
      flexGrow: 0,
    };
    render(<Spacer style={overrideStyle} />);
    const spacer = screen.getByTestId('spacer');
    expect(spacer).toBeInTheDocument();
    expect(spacer).toHaveStyle('flex-grow: 0');
  });
});
