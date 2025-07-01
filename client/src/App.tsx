import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LobbyPage from './pages/LobbyPage';
import GamePage from './pages/GamePage';
import DebugPage from './pages/DebugPage';
import { socketService } from './services/socketService';
import { DebugPanel } from './components/DebugPanel';

function App() {
  // Establish socket connection when the app loads
  useEffect(() => {
    socketService.connect();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lobby/:roomCode" element={<LobbyPage />} />
        <Route path="/game/:roomCode" element={<GamePage />} />
        <Route path="/debug" element={<DebugPage />} />
      </Routes>

      {process.env.NODE_ENV === 'development' && <DebugPanel />}
    </Router>
  );
}

export default App;
