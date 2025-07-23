import { StateTimer } from '../StateTimer.js';
import { jest } from '@jest/globals';

jest.useFakeTimers();

describe('StateTimer', () => {
  let stateTimer: StateTimer;
  let onExpireCallback: jest.Mock;

  beforeEach(() => {
    stateTimer = new StateTimer();
    onExpireCallback = jest.fn();
  });

  it('should start a timer and call the callback on expiration', () => {
    stateTimer.startTimer(5, onExpireCallback);

    // Fast-forward time by 5 seconds
    jest.advanceTimersByTime(5000);

    expect(onExpireCallback).toHaveBeenCalledTimes(1);
  });

  it('should not call the callback before the timer expires', () => {
    stateTimer.startTimer(5, onExpireCallback);

    // Fast-forward time by less than 5 seconds
    jest.advanceTimersByTime(4999);

    expect(onExpireCallback).not.toHaveBeenCalled();
  });

  it('should cancel a running timer', () => {
    stateTimer.startTimer(5, onExpireCallback);
    stateTimer.cancelTimer();

    // Fast-forward time past the expiration
    jest.advanceTimersByTime(5000);

    expect(onExpireCallback).not.toHaveBeenCalled();
  });

  it('should reset the timer when startTimer is called again', () => {
    stateTimer.startTimer(5, onExpireCallback);
    
    // Fast-forward time a bit
    jest.advanceTimersByTime(2000);

    // Start a new timer
    const newCallback = jest.fn();
    stateTimer.startTimer(3, newCallback);

    // Fast-forward time by 3 seconds
    jest.advanceTimersByTime(3000);

    expect(onExpireCallback).not.toHaveBeenCalled();
    expect(newCallback).toHaveBeenCalledTimes(1);
  });
});
