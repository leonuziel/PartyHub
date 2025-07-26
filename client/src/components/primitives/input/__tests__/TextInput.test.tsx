import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextInput } from '../TextInput';

describe('TextInput Component', () => {
  // 1. Smoke test: Does it render without crashing?
  test('renders without crashing', () => {
    render(<TextInput />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeInTheDocument();
  });

  // 2. Test onChange handler
  test('calls onChange handler when text is entered', () => {
    const handleChange = jest.fn();
    render(<TextInput onChange={handleChange} />);
    const inputElement = screen.getByRole('textbox');
    fireEvent.change(inputElement, { target: { value: 'hello' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('hello');
  });

  // 3. Test placeholder prop
  test('displays the correct placeholder text', () => {
    const placeholderText = 'Enter your name';
    render(<TextInput placeholder={placeholderText} />);
    expect(screen.getByPlaceholderText(placeholderText)).toBeInTheDocument();
  });

  // 4. Test multiline prop
  test('renders a textarea when multiline is true', () => {
    render(<TextInput multiline />);
    const textareaElement = screen.getByRole('textbox');
    expect(textareaElement.tagName).toBe('TEXTAREA');
  });


  // 6. Test showCounter prop
  test('displays character count when showCounter is true', () => {
    render(<TextInput maxLength={20} showCounter />);
    const inputElement = screen.getByRole('textbox');
    fireEvent.change(inputElement, { target: { value: 'test' } });
    const counterElement = screen.getByText('4 / 20');
    expect(counterElement).toBeInTheDocument();
  });

  // 7. Test disabled prop
  test('disables the input when disabled prop is true', () => {
    render(<TextInput disabled />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeDisabled();
  });
});
