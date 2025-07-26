import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Grid } from '../Grid';

describe('Grid Component', () => {
  // 1. Renders children correctly
  test('renders its children', () => {
    render(
      <Grid>
        <div data-testid="child">Child Element</div>
      </Grid>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  // 2. Applies default styles
  test('applies default grid styles', () => {
    render(<Grid>Content</Grid>);
    const element = screen.getByTestId('grid');
    expect(element).toHaveStyle('display: grid');
    expect(element).toHaveStyle('width: 100%');
    expect(element).toHaveStyle('height: 100%');
  });

  // 3. Applies props for styling
  test('applies grid styles based on props', () => {
    render(
      <Grid columns={3} rows={4} spacing={20}>
        Content
      </Grid>
    );
    const element = screen.getByTestId('grid');
    expect(element).toHaveStyle('grid-template-columns: repeat(3, 1fr)');
    expect(element).toHaveStyle('grid-template-rows: repeat(4, 1fr)');
    expect(element).toHaveStyle('gap: 20px');
  });
  
  // 4. Handles undefined rows prop
  test('does not apply grid-template-rows style if rows prop is not provided', () => {
    render(<Grid columns={3}>Content</Grid>);
    const element = screen.getByTestId('grid');
    expect(window.getComputedStyle(element).gridTemplateRows).toBe('');
  });

  // 5. Test className prop
  test('applies a custom className', () => {
    const customClass = 'my-custom-grid';
    render(<Grid className={customClass}>Content</Grid>);
    expect(screen.getByTestId('grid')).toHaveClass(customClass);
  });
});
