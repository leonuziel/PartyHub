import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChoiceSelector } from '../ChoiceSelector';

// Mock the nested Button component to simplify testing
jest.mock('../Button', () => {
  // The original Button component passes children, not a text prop.
  // The mock needs to render the children to make the text available for screen.getByText.
  // It also needs to correctly handle the `disabled` prop being passed down.
  return {
    Button: ({ onClick, disabled, children, ...props }: { onClick?: () => void; disabled?: boolean; children: React.ReactNode }) => (
      <button onClick={onClick} disabled={disabled} {...props}>
        {children}
      </button>
    ),
  };
});


describe('ChoiceSelector Component', () => {
  const options = ['Apple', 'Banana', 'Orange'];
  const complexOptions = [
    { id: '1', label: 'Apple' },
    { id: '2', label: 'Banana' },
    { id: '3', label: 'Orange' },
  ];

  // 1. Smoke test
  test('renders without crashing', () => {
    render(<ChoiceSelector options={options} onSelect={() => {}} />);
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.getByText('Orange')).toBeInTheDocument();
  });

  // 2. Test single selection mode
  test('handles single selection correctly', () => {
    const handleSelect = jest.fn();
    render(<ChoiceSelector options={options} onSelect={handleSelect} selectionMode="single" />);
    
    const bananaButton = screen.getByText('Banana');
    fireEvent.click(bananaButton);
    
    // In single-select mode, the onSelect callback should be fired immediately.
    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(['Banana']);
  });

  // 3. Test multiple selection mode
  test('handles multiple selections and submit', () => {
    const handleSelect = jest.fn();
    render(<ChoiceSelector options={complexOptions} onSelect={handleSelect} selectionMode="multiple" />);

    const appleButton = screen.getByText('Apple');
    const orangeButton = screen.getByText('Orange');
    
    fireEvent.click(appleButton);
    fireEvent.click(orangeButton);
    
    // Nothing should be called yet, need to click submit
    expect(handleSelect).not.toHaveBeenCalled();

    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(['1', '3']);
  });

  // 4. Test disabled state
  test('disables all choice buttons when disabled is true', () => {
    render(<ChoiceSelector options={options} onSelect={() => {}} disabled />);
    options.forEach(option => {
      // Find the button by its accessible name (the text content)
      // This ensures we get the <button> element, not the inner <span>
      const button = screen.getByRole('button', { name: option });
      expect(button).toBeDisabled();
    });
  });

  // 5. Test disabled state for submit button in multiple selection mode
  test('disables submit button when disabled is true in multiple selection mode', () => {
    render(<ChoiceSelector options={options} onSelect={() => {}} selectionMode="multiple" disabled />);
    const submitButton = screen.getByText('Submit');
    expect(submitButton).toBeDisabled();
  });

  // 6. Renders complex objects with labels
  test('renders options from an array of objects', () => {
    render(<ChoiceSelector options={complexOptions} onSelect={() => {}} />);
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.getByText('Orange')).toBeInTheDocument();
  });
});
