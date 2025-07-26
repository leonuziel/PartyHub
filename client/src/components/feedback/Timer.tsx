import React, { useState, useEffect } from 'react';

interface TimerProps {
  duration: number; // in seconds
  type?: 'countdown' | 'progress';
  onComplete?: () => void;
  label?: string;
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  backgroundColor?: string;
  padding?: string;
  borderRadius?: string;
  border?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Timer: React.FC<TimerProps> = ({
  duration,
  type = 'countdown',
  onComplete = () => {},
  label,
  fontSize,
  fontWeight,
  fontFamily,
  color,
  textAlign,
  backgroundColor,
  padding,
  borderRadius,
  border,
  className,
  style: propStyle = {},
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
    const containerStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily,
        color,
        textAlign,
        backgroundColor,
        padding,
        borderRadius,
        border,
        ...propStyle,
    }

    const numberStyle: React.CSSProperties = {
        // Use viewport width unit for scalability. 10vw could be a good starting point.
        // The actual value might need adjustment based on desired look.
        fontSize: fontSize || 'clamp(1rem, 10vw, 8rem)', // Min, preferred, max
        lineHeight: 1,
        fontWeight: fontWeight || 'bold',
    }

    const labelStyle: React.CSSProperties = {
        fontSize: 'clamp(0.75rem, 3vw, 2rem)',
    }

    return (
      <div className={className} style={containerStyle}>
        {label && <span style={labelStyle}>{label}</span>}
        <span style={numberStyle}>{timeLeft}</span>
      </div>
    );
  };

  const renderProgressBar = () => {
    const percentage = (timeLeft / duration) * 100;
    return (
      <div data-testid="progress-bar-container" className={className} style={{ width: '100%', backgroundColor: '#eee' }}>
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
