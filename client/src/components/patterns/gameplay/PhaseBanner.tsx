import React, { useEffect, useState } from 'react';
import './PhaseBanner.css';

interface PhaseBannerProps {
  title: string;
  subtitle?: string;
  duration?: number; // in seconds
  onComplete?: () => void;
}

export const PhaseBanner: React.FC<PhaseBannerProps> = ({ title, subtitle, duration = 3, onComplete }) => {
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
    <div className="phase-banner-overlay">
      <div className="phase-banner-content">
        <h1>{title}</h1>
        {subtitle && <h2>{subtitle}</h2>}
      </div>
    </div>
  );
};
