import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Timer } from '../Timer';

describe('Timer Component', () => {
  // Use fake timers to control setInterval and setTimeout
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  
  // 1. Renders the initial time
  test('displays the initial duration correctly', () => {
    render(<Timer duration={10} />);
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  // 2. Countdown functionality
  test('counts down every second', () => {
    render(<Timer duration={5} />);
    
    expect(screen.getByText('5')).toBeInTheDocument();

    // Advance time by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText('4')).toBeInTheDocument();
    
    // Advance time by another 2 seconds
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  // 3. onComplete callback
  test('calls onComplete callback when timer finishes', () => {
    const handleComplete = jest.fn();
    render(<Timer duration={3} onComplete={handleComplete} />);

    expect(handleComplete).not.toHaveBeenCalled();

    // Advance time past the end of the timer
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(handleComplete).toHaveBeenCalledTimes(1);
  });
  
    // 4. Progress bar type
  test('renders a progress bar when type is "progress"', () => {
    render(<Timer duration={10} type="progress" />);
    const progressBar = screen.getByTestId('progress-bar-container');
    expect(progressBar).toBeInTheDocument();
  });
  
  // 5. Renders a label
  test('displays a label if provided', () => {
    render(<Timer duration={10} label="Time Left" />);
    expect(screen.getByText('Time Left')).toBeInTheDocument();
  });
  
  // 6. Cleans up timer on unmount
  test('clears interval on unmount', () => {
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
    const { unmount } = render(<Timer duration={10} />);
    
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
    clearIntervalSpy.mockRestore();
  });
});
