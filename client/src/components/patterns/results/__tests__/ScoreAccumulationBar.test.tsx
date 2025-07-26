import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ScoreAccumulationBar } from '../ScoreAccumulationBar';

jest.useFakeTimers();

describe('ScoreAccumulationBar', () => {
  const onComplete = jest.fn();

  beforeEach(() => {
    onComplete.mockClear();
  });

  it('renders the initial score and label', () => {
    render(<ScoreAccumulationBar initialScore={1000} scoreChange={500} label="Player 1" />);
    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
  });

  it('animates the score increasing over time', async () => {
    render(
      <ScoreAccumulationBar
        initialScore={1000}
        scoreChange={500}
        label="Player 1"
        onComplete={onComplete}
      />
    );

    // Initial state
    expect(screen.getByText('1,000')).toBeInTheDocument();
    expect(screen.getByText('+500')).toBeInTheDocument();

    // Fast-forward timers
    act(() => {
      jest.runAllTimers();
    });

    // Check final state
    await waitFor(() => {
      expect(screen.getByText('1,500')).toBeInTheDocument();
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('handles a score change of zero gracefully', async () => {
    render(
        <ScoreAccumulationBar
          initialScore={1000}
          scoreChange={0}
          label="Player 1"
          onComplete={onComplete}
        />
      );
  
      act(() => {
        jest.runAllTimers();
      });
  
      await waitFor(() => {
        expect(screen.getByText('1,000')).toBeInTheDocument();
      });
      expect(screen.queryByText('+0')).not.toBeInTheDocument();
      expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('animates the score decreasing over time', async () => {
    render(
      <ScoreAccumulationBar
        initialScore={1000}
        scoreChange={-500}
        label="Player 1"
        onComplete={onComplete}
      />
    );

    expect(screen.getByText('1,000')).toBeInTheDocument();
    expect(screen.getByText('-500')).toBeInTheDocument();

    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(screen.getByText('500')).toBeInTheDocument();
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('respects the start delay', async () => {
    render(
        <ScoreAccumulationBar
          initialScore={1000}
          scoreChange={100}
          label="Player 1"
          startDelay={500}
          onComplete={onComplete}
        />
      );
      
      // Right after render, score should be initial
      expect(screen.getByText('1,000')).toBeInTheDocument();

      // Advance time by less than the delay
      act(() => {
          jest.advanceTimersByTime(499);
      });
      await waitFor(() => {
        expect(screen.getByText('1,000')).toBeInTheDocument();
      });
      
      // Advance time past the delay
      act(() => {
        jest.advanceTimersByTime(1);
      });
      
      // Now the animation should start, but not be finished
      act(() => {
        jest.advanceTimersByTime(50);
      });
      await waitFor(() => {
          const score = parseInt(screen.getByText(/,/).textContent!.replace(/,/g, ''), 10);
          expect(score).toBeGreaterThan(1000);
          expect(score).toBeLessThan(1100);
      });

      // Run all timers to finish
      act(() => {
          jest.runAllTimers();
      });
      await waitFor(() => {
        expect(screen.getByText('1,100')).toBeInTheDocument();
      });

      expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
