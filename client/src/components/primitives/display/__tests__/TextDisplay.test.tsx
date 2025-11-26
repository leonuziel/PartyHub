import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextDisplay } from '../TextDisplay';

describe('TextDisplay Component', () => {
  // 1. Smoke test
  test('renders without crashing', () => {
    render(<TextDisplay text="Hello World" />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  // 2. Test text prop
  test('displays the correct text', () => {
    const sampleText = 'This is a test.';
    render(<TextDisplay text={sampleText} />);
    expect(screen.getByText(sampleText)).toBeInTheDocument();
  });

  // 3. Test styling props
  test('applies styling props correctly', () => {
    const styleProps = {
      fontSize: '24px',
      fontWeight: 'bold',
      fontFamily: 'Arial',
      color: 'blue',
      textAlign: 'center' as const,
    };
    render(<TextDisplay text="Styled text" {...styleProps} />);
    const element = screen.getByText('Styled text');
    expect(element).toHaveStyle({
      'font-size': styleProps.fontSize,
      'font-weight': styleProps.fontWeight,
      'font-family': styleProps.fontFamily,
      color: styleProps.color,
      'text-align': styleProps.textAlign,
    });
  });

  // 4. Test className prop
  test('applies a custom className', () => {
    const customClass = 'my-custom-class';
    render(<TextDisplay text="Classy text" className={customClass} />);
    const element = screen.getByText('Classy text');
    expect(element).toHaveClass(customClass);
  });
});
