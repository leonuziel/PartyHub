import React from 'react';
import './HostFrame.css';
import { Link } from 'react-router-dom';

interface HostFrameProps {
  children: React.ReactNode;
}

const HostFrame: React.FC<HostFrameProps> = ({ children }) => {
  return (
    <div className="host-frame">
      <header className="host-frame-header">
        <Link to="/">
          <img src="/Logo.png" alt="PartyHub Logo" className="host-frame-logo" />
        </Link>
        <div className="partyhub-title">PartyHub</div>
      </header>
      <main className="host-frame-content">
        {children}
      </main>
    </div>
  );
};

export default HostFrame;
