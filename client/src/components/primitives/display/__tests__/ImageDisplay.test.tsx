import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ImageDisplay } from '../ImageDisplay';

describe('ImageDisplay Component', () => {
  const testImage = {
    src: 'test-image.jpg',
    alt: 'A test image',
  };

  // 1. Smoke test
  test('renders without crashing', () => {
    render(<ImageDisplay src={testImage.src} alt={testImage.alt} />);
    const imgElement = screen.getByRole('img');
    expect(imgElement).toBeInTheDocument();
  });

  // 2. Test src and alt attributes
  test('displays an image with the correct src and alt attributes', () => {
    render(<ImageDisplay src={testImage.src} alt={testImage.alt} />);
    const imgElement = screen.getByAltText(testImage.alt);
    expect(imgElement).toHaveAttribute('src', testImage.src);
  });

  // 3. Test fit prop 'contain' (default)
  test('applies "contain" object-fit by default', () => {
    render(<ImageDisplay src={testImage.src} alt={testImage.alt} />);
    const imgElement = screen.getByAltText(testImage.alt);
    expect(imgElement).toHaveStyle({ 'object-fit': 'contain' });
  });

  // 4. Test fit prop 'cover'
  test('applies "cover" object-fit when specified', () => {
    render(<ImageDisplay src={testImage.src} alt={testImage.alt} fit="cover" />);
    const imgElement = screen.getByAltText(testImage.alt);
    expect(imgElement).toHaveStyle({ 'object-fit': 'cover' });
  });

  // 5. Test fit prop 'fill'
  test('applies "fill" object-fit when specified', () => {
    render(<ImageDisplay src={testImage.src} alt={testImage.alt} fit="fill" />);
    const imgElement = screen.getByAltText(testImage.alt);
    expect(imgElement).toHaveStyle({ 'object-fit': 'fill' });
  });

  // 6. Test className prop
  test('applies a custom className', () => {
    const customClass = 'my-custom-image';
    render(<ImageDisplay src={testImage.src} alt={testImage.alt} className={customClass} />);
    const imgElement = screen.getByAltText(testImage.alt);
    expect(imgElement).toHaveClass(customClass);
  });
});
