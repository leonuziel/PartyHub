import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Container } from '../Container';

describe('Container Component', () => {
  // 1. Renders children correctly
  test('renders its children', () => {
    render(
      <Container>
        <div data-testid="child">Child Element</div>
      </Container>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Child Element')).toBeInTheDocument();
  });

  // 2. Applies default styles
  test('applies default flex styles', () => {
    render(<Container>Content</Container>);
    const element = screen.getByTestId('container');
    expect(element).toHaveStyle('display: flex');
    expect(element).toHaveStyle('flex-direction: column');
  });

  // 3. Applies props for styling
  test('applies styles based on props', () => {
    render(
      <Container
        display="grid"
        gap={16}
        alignItems="center"
        justifyContent="space-between"
      >
        Content
      </Container>
    );
    const element = screen.getByTestId('container');
    expect(element).toHaveStyle('display: grid');
    expect(element).toHaveStyle('gap: 16px');
    expect(element).toHaveStyle('align-items: center');
    expect(element).toHaveStyle('justify-content: space-between');
  });

  // 4. Test className prop
  test('applies a custom className', () => {
    const customClass = 'my-custom-container';
    render(<Container className={customClass}>Content</Container>);
    const element = screen.getByTestId('container');
    expect(element).toHaveClass(customClass);
  });
});
