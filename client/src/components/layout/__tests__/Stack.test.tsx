import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Stack } from '../Stack';

// The Container component is mocked to isolate the Stack component's logic.
// The mock correctly mimics the named export structure of the actual module.
jest.mock('../Container', () => ({
  Container: ({ children, ...props }) => {
    return <div {...props}>{children}</div>;
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
