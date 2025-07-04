import React from 'react';

interface TrumpIndicatorProps {
  suit: string;
}

export const TrumpIndicator: React.FC<TrumpIndicatorProps> = ({ suit }) => {
  return (
    <div className="trump-indicator">
      Trump: {suit}
    </div>
  );
};
