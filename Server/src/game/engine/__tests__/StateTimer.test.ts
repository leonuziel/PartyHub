import { StateTimer } from '../StateTimer.js';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('StateTimer', () => {
  let stateTimer: StateTimer;
  let onExpireCallback: any;
  let mockExecutor: any;

  beforeEach(() => {
    vi.useFakeTimers();
    stateTimer = new StateTimer();
    onExpireCallback = vi.fn();
    mockExecutor = {
      execute: vi.fn((effect) => {
        if (typeof effect === 'function') {
          effect();
        }
      })
    };
    stateTimer.setEffectExecutor(mockExecutor);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should start a timer and call the callback on expiration', () => {
    stateTimer.startTimer(5, onExpireCallback);

    // Fast-forward time by 5 seconds
    vi.advanceTimersByTime(5000);

    expect(onExpireCallback).toHaveBeenCalledTimes(1);
  });

  it('should not call the callback before the timer expires', () => {
    stateTimer.startTimer(5, onExpireCallback);

    // Fast-forward time by less than 5 seconds
    vi.advanceTimersByTime(4999);

    expect(onExpireCallback).not.toHaveBeenCalled();
  });

  it('should cancel a running timer', () => {
    stateTimer.startTimer(5, onExpireCallback);
    stateTimer.cancelTimer();

    // Fast-forward time past the expiration
    vi.advanceTimersByTime(5000);

    expect(onExpireCallback).not.toHaveBeenCalled();
  });

  it('should reset the timer when startTimer is called again', () => {
    stateTimer.startTimer(5, onExpireCallback);

    // Fast-forward time a bit
    vi.advanceTimersByTime(2000);

    // Start a new timer
    const newCallback = vi.fn();
    stateTimer.startTimer(3, newCallback);

    // Fast-forward time by 3 seconds
    vi.advanceTimersByTime(3000);

    expect(onExpireCallback).not.toHaveBeenCalled();
    expect(newCallback).toHaveBeenCalledTimes(1);
  });
});
