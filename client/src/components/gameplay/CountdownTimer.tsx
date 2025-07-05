import React, { useState, useEffect } from 'react';
import './CountdownTimer.css';

interface CountdownTimerProps {
  initialValue: number;
  onComplete?: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ initialValue, onComplete }) => {
  const [count, setCount] = useState(initialValue);

  useEffect(() => {
    if (count <= 0) {
      if (onComplete) {
        onComplete();
      }
      return;
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <div className="countdown-timer">
      <div className="countdown-number">{count}</div>
    </div>
  );
};
