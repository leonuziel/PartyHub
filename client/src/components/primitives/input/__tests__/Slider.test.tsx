import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Slider } from '../Slider';

describe('Slider', () => {
  test('renders with default props', () => {
    const handleChange = jest.fn();
    render(<Slider onChange={handleChange} />);

    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '100');
    expect(slider).toHaveAttribute('step', '1');
    expect(slider).toHaveAttribute('value', '50');

    expect(screen.getByText('50')).toBeInTheDocument();
  });

  test('renders with custom props', () => {
    const handleChange = jest.fn();
    render(
      <Slider
        onChange={handleChange}
        min={10}
        max={50}
        step={5}
        defaultValue={20}
        className="custom-slider"
      />
    );

    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute('min', '10');
    expect(slider).toHaveAttribute('max', '50');
    expect(slider).toHaveAttribute('step', '5');
    expect(slider).toHaveAttribute('value', '20');
    expect(screen.getByText('20')).toBeInTheDocument();

    const container = screen.getByRole('slider').parentElement;
    expect(container).toHaveClass('custom-slider');
  });

  test('calls onChange when value is changed', () => {
    const handleChange = jest.fn();
    render(<Slider onChange={handleChange} />);

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '75' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(75);
  });

  test('updates the displayed value when changed', () => {
    const handleChange = jest.fn();
    render(<Slider onChange={handleChange} />);

    const slider = screen.getByRole('slider');
    expect(screen.getByText('50')).toBeInTheDocument(); // Initial value

    fireEvent.change(slider, { target: { value: '80' } });

    expect(screen.getByText('80')).toBeInTheDocument(); // New value
    expect(screen.queryByText('50')).not.toBeInTheDocument();
  });
});
