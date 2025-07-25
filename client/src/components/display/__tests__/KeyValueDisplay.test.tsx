import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { KeyValueDisplay } from '../KeyValueDisplay';
// NOTE: We are no longer mocking the Stack component.

describe('KeyValueDisplay Component', () => {
  const testData = {
    Player: 'Alice',
    Score: 100,
    Status: 'Active',
  };

  // 1. Renders all key-value pairs
  test('displays all key-value pairs correctly', () => {
    render(<KeyValueDisplay data={testData} />);
    for (const [key, value] of Object.entries(testData)) {
      // The component adds a colon, which we need to account for.
      const keyElement = screen.getByText(`${key}:`);
      const valueElement = screen.getByText(String(value));
      expect(keyElement).toBeInTheDocument();
      expect(valueElement).toBeInTheDocument();
    }
  });

  // 2. Test vertical layout (default)
  test('applies vertical layout by default', () => {
    const { container } = render(<KeyValueDisplay data={testData} />);
    // The Stack component renders a div with flex-direction. Let's find it.
    // It's the first child of the root container div.
    const stackContainer = container.firstChild?.firstChild;
    expect(stackContainer).toHaveStyle('flex-direction: column');
  });

  // 3. Test horizontal layout
  test('applies horizontal layout when specified', () => {
    const { container } = render(<KeyValueDisplay data={testData} layout="horizontal" />);
    const stackContainer = container.firstChild?.firstChild;
    expect(stackContainer).toHaveStyle('flex-direction: row');
  });

  // 4. Test with empty data
  test('renders an empty container when data is empty', () => {
    const { container } = render(<KeyValueDisplay data={{}} />);
    // The Stack component will be rendered, but it will have no children.
    const stackContainer = container.firstChild?.firstChild;
    expect(stackContainer).toBeInTheDocument();
    expect(stackContainer?.hasChildNodes()).toBe(false);
  });

  // 5. Test className prop
  test('applies a custom className to the root container', () => {
    const customClass = 'my-custom-kv';
    const { container } = render(<KeyValueDisplay data={testData} className={customClass} />);
    expect(container.firstChild).toHaveClass(customClass);
  });
});
