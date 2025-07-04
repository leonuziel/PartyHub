import React from 'react';
import './HostViewContainer.css';

interface HostViewContainerProps {
  children: React.ReactNode;
}

export const HostViewContainer: React.FC<HostViewContainerProps> = ({ children }) => {
  return (
    <div className="host-view-container">
      {children}
    </div>
  );
};
