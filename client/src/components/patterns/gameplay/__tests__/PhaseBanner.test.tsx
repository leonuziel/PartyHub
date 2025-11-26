import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PhaseBanner } from '../PhaseBanner';

jest.useFakeTimers();

describe('PhaseBanner', () => {
  it('renders the title and subtitle', () => {
    render(<PhaseBanner title="Test Title" subtitle="Test Subtitle" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('does not render the subtitle if it is not provided', () => {
    render(<PhaseBanner title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.queryByText('Test Subtitle')).not.toBeInTheDocument();
  });

  it('disappears after the specified duration', async () => {
    const onComplete = jest.fn();
    render(<PhaseBanner title="Test Title" duration={1} onComplete={onComplete} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();

    act(() => {
        jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('uses the default duration of 3 seconds if none is provided', async () => {
    render(<PhaseBanner title="Test Title" />);
    
    act(() => {
        jest.advanceTimersByTime(2999);
    });
    
    await waitFor(() => {
        expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    act(() => {
        jest.advanceTimersByTime(1);
    });

    await waitFor(() => {
      expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
    });
  });
});
