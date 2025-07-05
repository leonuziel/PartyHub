import React from 'react';
import './CenteredMessage.css';

interface CenteredMessageProps {
  children: React.ReactNode;
}

export const CenteredMessage: React.FC<CenteredMessageProps> = ({ children }) => {
  return (
    <div className="centered-message">
      {children}
    </div>
  );
};
