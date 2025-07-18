import React, { useState, useEffect } from 'react';

interface TimerProps {
  duration: number; // in seconds
  type?: 'countdown' | 'progress';
  onComplete?: () => void;
  label?: string;
  className?: string;
}

export const Timer: React.FC<TimerProps> = ({
  duration,
  type = 'countdown',
  onComplete = () => {},
  label,
  className,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onComplete) {
        onComplete();
      }
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onComplete]);

  const renderCountdown = () => {
    return (
      <div className={className}>
        {label && <span>{label}: </span>}
        <span>{timeLeft}</span>
      </div>
    );
  };

  const renderProgressBar = () => {
    const percentage = (timeLeft / duration) * 100;
    return (
      <div className={className} style={{ width: '100%', backgroundColor: '#eee' }}>
        <div
          style={{
            width: `${percentage}%`,
            height: '20px',
            backgroundColor: '#8A2BE2',
            transition: 'width 1s linear',
          }}
        />
        {label && <span>{label}</span>}
      </div>
    );
  };

  return type === 'countdown' ? renderCountdown() : renderProgressBar();
};
