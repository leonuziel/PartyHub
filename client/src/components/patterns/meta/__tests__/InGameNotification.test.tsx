import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InGameNotification } from '../InGameNotification';

jest.useFakeTimers();

describe('InGameNotification', () => {
  it('renders the message and applies the correct type class', () => {
    render(<InGameNotification message="Test Message" type="success" />);
    const notification = screen.getByText('Test Message').closest('.in-game-notification');
    expect(notification).toBeInTheDocument();
    expect(notification).toHaveClass('success');
  });

  it('uses the "info" class as a default type', () => {
    render(<InGameNotification message="Test Message" />);
    const notification = screen.getByText('Test Message').closest('.in-game-notification');
    expect(notification).toHaveClass('info');
  });

  it('disappears after the default duration of 4 seconds', async () => {
    const onComplete = jest.fn();
    render(<InGameNotification message="Test Message" onComplete={onComplete} />);

    expect(screen.getByText('Test Message')).toBeInTheDocument();

    act(() => {
        jest.advanceTimersByTime(3999);
    });
    
    await waitFor(() => {
        expect(screen.getByText('Test Message')).toBeInTheDocument();
    });

    act(() => {
        jest.advanceTimersByTime(1);
    });

    await waitFor(() => {
      expect(screen.queryByText('Test Message')).not.toBeInTheDocument();
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('disappears after a custom duration', async () => {
    const onComplete = jest.fn();
    render(<InGameNotification message="Test Message" duration={1} onComplete={onComplete} />);

    expect(screen.getByText('Test Message')).toBeInTheDocument();

    act(() => {
        jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(screen.queryByText('Test Message')).not.toBeInTheDocument();
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
