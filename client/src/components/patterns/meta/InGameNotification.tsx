import React, { useEffect, useState } from 'react';
import './InGameNotification.css';

interface InGameNotificationProps {
  message: string;
  type?: 'info' | 'warning' | 'success';
  duration?: number; // in seconds
  onComplete?: () => void;
}

export const InGameNotification: React.FC<InGameNotificationProps> = ({
  message,
  type = 'info',
  duration = 4,
  onComplete,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) {
        onComplete();
      }
    }, duration * 1000);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!visible) {
    return null;
  }

  return (
    <div className={`in-game-notification ${type}`}>
      <p>{message}</p>
    </div>
  );
};
