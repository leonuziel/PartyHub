import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InstructionCarousel } from '../InstructionCarousel';

jest.useFakeTimers();

const mockSlides = [
  { title: 'Slide 1', text: 'This is the first slide.' },
  { title: 'Slide 2', text: 'This is the second slide.', imageUrl: '/image.png' },
];

describe('InstructionCarousel', () => {
  it('renders the first slide by default', () => {
    render(<InstructionCarousel slides={mockSlides} />);
    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('This is the first slide.')).toBeInTheDocument();
  });

  it('automatically advances to the next slide after the interval', async () => {
    render(<InstructionCarousel slides={mockSlides} autoPlayInterval={3} />);
    
    expect(screen.getByText('Slide 1')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() => {
        expect(screen.getByText('Slide 2')).toBeInTheDocument();
    });
  });

  it('loops back to the first slide after the last one', async () => {
    render(<InstructionCarousel slides={mockSlides} autoPlayInterval={3} />);
    
    act(() => {
        jest.advanceTimersByTime(3000); // To slide 2
    });
    
    await waitFor(() => {
        expect(screen.getByText('Slide 2')).toBeInTheDocument();
    });

    act(() => {
        jest.advanceTimersByTime(3000); // To slide 1
    });

    await waitFor(() => {
        expect(screen.getByText('Slide 1')).toBeInTheDocument();
    });
  });

  it('allows manual navigation by clicking the dots', () => {
    render(<InstructionCarousel slides={mockSlides} />);
    const dots = document.querySelectorAll('.dot');
    
    fireEvent.click(dots[1]);
    expect(screen.getByText('Slide 2')).toBeInTheDocument();
  });

  it('does not render if there are no slides', () => {
    const { container } = render(<InstructionCarousel slides={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
