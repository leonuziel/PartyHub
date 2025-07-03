import React from 'react';
import './HostFrame.css';
import logo from '../logo.svg';
import { Link } from 'react-router-dom';

interface HostFrameProps {
  children: React.ReactNode;
}

const HostFrame: React.FC<HostFrameProps> = ({ children }) => {
  return (
    <div className="host-frame">
      <header className="host-frame-header">
        <Link to="/">
          <img src={logo} className="host-frame-logo" alt="logo" />
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
