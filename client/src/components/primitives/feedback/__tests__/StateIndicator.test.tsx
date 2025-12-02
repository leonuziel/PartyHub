import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StateIndicator } from '../StateIndicator';

describe('StateIndicator Component', () => {

  // Test 1: 'icon' indicator (default)
  test('renders an icon by default', () => {
    render(<StateIndicator status="Ready" />);
    const icon = screen.getByTestId('icon-indicator');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveTextContent('✅');
  });

  test('renders a fallback icon for unknown status', () => {
    render(<StateIndicator status="Unknown Status" />);
    const icon = screen.getByTestId('icon-indicator');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveTextContent('❔');
  });

  // Test 2: 'text' indicator
  test('renders the status text when indicator is "text"', () => {
    render(<StateIndicator status="This is a test" indicator="text" />);
    const text = screen.getByTestId('text-indicator');
    expect(text).toBeInTheDocument();
    expect(text).toHaveTextContent('This is a test');
  });

  // Test 3: 'color' indicator
  test('renders a colored div when indicator is "color"', () => {
    render(<StateIndicator status="Ready" indicator="color" />);
    const colorDiv = screen.getByTestId('color-indicator');
    expect(colorDiv).toBeInTheDocument();
    expect(colorDiv).toHaveStyle({ backgroundColor: 'rgb(0, 128, 0)' });
  });

  // Test 4: className prop
  test('applies a custom className to the root container', () => {
    const customClass = 'my-custom-indicator';
    render(<StateIndicator status="Ready" className={customClass} />);
    expect(screen.getByTestId('state-indicator')).toHaveClass(customClass);
  });
});
