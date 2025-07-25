import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Stack } from '../Stack';

// The Container component is mocked to isolate the Stack component's logic.
// The mock correctly mimics the named export structure of the actual module.
jest.mock('../Container', () => ({
  Container: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: any;
  }) => (
// The mock passes through children and any other props it receives.
    // It includes the 'data-testid' so that it can be found by the tests.
    <div data-testid="container" {...props}>
      {children}
    </div>
  ),
}));

describe('Stack', () => {
  // Clear mock history after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders children correctly', () => {
    render(
      <Stack>
        <div>Child 1</div>
        <div>Child 2</div>
      </Stack>
    );
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

test('applies default props by passing them to the Container', () => {
    render(
      <Stack>
        <div />
      </Stack>
    );
    const container = screen.getByTestId('container');

    // The Stack component should pass the correct style-related props to the Container.
    // We check these props on the mocked Container.
    expect(container).toHaveAttribute('display', 'flex');
    expect(container).toHaveAttribute('flexdirection', 'column');
    expect(container).toHaveAttribute('gap', '8');
  });

  test('renders as a horizontal stack when specified', () => {
    render(
      <Stack direction="horizontal">
        <div />
      </Stack>
    );
    const container = screen.getByTestId('container');
    expect(container).toHaveAttribute('flexdirection', 'row');
  });

  test('applies custom spacing', () => {
    render(
      <Stack spacing={16}>
        <div />
      </Stack>
    );
    const container = screen.getByTestId('container');
    expect(container).toHaveAttribute('gap', '16');
  });

  test('passes down the className', () => {
    render(
      <Stack className="my-custom-stack">
        <div />
      </Stack>
    );
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('my-custom-stack');
  });
});
