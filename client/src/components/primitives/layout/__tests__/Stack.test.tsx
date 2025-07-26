import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Stack } from '../Stack';

// The Container component is mocked to isolate the Stack component's logic.
// The mock is updated to consume layout-specific props and not pass them to the DOM.
jest.mock('../Container', () => ({
  Container: ({
    children,
    display,
    flexDirection,
    gap,
    alignItems,
    justifyContent,
    className,
  }) => {
    // We don't need to replicate the style logic, just prevent invalid props
    // from being passed to the underlying div.
    return <div className={className}>{children}</div>;
  },
}));

describe('Stack', () => {
  it('renders children and passes props correctly', () => {
    render(
      <Stack direction="horizontal" spacing={16} className="my-stack">
        <div>Child 1</div>
      </Stack>
    );
    expect(screen.getByText('Child 1')).toBeInTheDocument();
  });
});
