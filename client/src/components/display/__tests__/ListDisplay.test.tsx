import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ListDisplay } from '../ListDisplay';
import { ComponentRenderer } from '../../utility/ComponentRenderer';

// Mock the ComponentRenderer as ListDisplay depends on it.
// This allows us to inspect the props passed to it.
jest.mock('../../utility/ComponentRenderer', () => ({
  ComponentRenderer: jest.fn(() => null),
}));

// A simple component to use for rendering items in tests
const MockRenderComponent = ({ item }: { item: { name: string } }) => <div>{item.name}</div>;

describe('ListDisplay Component', () => {
  const testItems = [
    { id: '1', name: 'Apple' },
    { id: '2', name: 'Banana' },
    { id: '3', name: 'Orange' },
  ];

  const renderItemProps = {
    component: 'MockRenderComponent',
    props: {
      // In a real scenario, this would use template strings like '{{item.name}}'
    },
  };

  beforeEach(() => {
    // Clear mock calls before each test
    (ComponentRenderer as jest.Mock).mockClear();
  });

  // 1. Smoke test
  test('renders without crashing', () => {
    const { container } = render(<ListDisplay items={[]} renderItem={renderItemProps} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  // 2. Renders a list of items
  test('calls ComponentRenderer for each item in the list', () => {
    render(<ListDisplay items={testItems} renderItem={renderItemProps} />);
    
    // Check that ComponentRenderer was called 3 times
    expect(ComponentRenderer).toHaveBeenCalledTimes(testItems.length);
  });

  // 3. Passes correct props to ComponentRenderer
  test('passes the correct props and context to ComponentRenderer for each item', () => {
    render(<ListDisplay items={testItems} renderItem={renderItemProps} />);

    // Check the props of the first call
    // The first argument to the mock is the props object.
    // The second argument is the ref, which is undefined in this test environment.
    expect((ComponentRenderer as jest.Mock).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        config: renderItemProps,
        context: { item: testItems[0] },
      })
    );
    
    // Check the props of the second call
    expect((ComponentRenderer as jest.Mock).mock.calls[1][0]).toEqual(
      expect.objectContaining({
        config: renderItemProps,
        context: { item: testItems[1] },
      })
    );
  });

  // 4. Handles an empty item list gracefully
  test('renders nothing and does not call ComponentRenderer when items array is empty', () => {
    const { container } = render(<ListDisplay items={[]} renderItem={renderItemProps} />);
    expect(ComponentRenderer).not.toHaveBeenCalled();
    // The main container div should have no children
    expect(container.querySelector('div')?.childElementCount).toBe(0);
  });

  // 5. Applies custom className
  test('applies a custom className to the container', () => {
    const customClass = 'my-custom-list';
    const { container } = render(<ListDisplay items={testItems} renderItem={renderItemProps} className={customClass} />);
    expect(container.firstChild).toHaveClass(customClass);
  });
});
