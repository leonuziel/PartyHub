import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LobbyPage from './pages/LobbyPage';
import GamePage from './pages/GamePage';
import DebugPage from './pages/DebugPage';
import JoinPage from './pages/JoinPage';
import TestComponentsPage from './pages/TestComponentsPage';
import GameUITestPage from './pages/GameUITestPage';
import { socketService } from './services/socketService';
import { DebugPanel } from './components/common/DebugPanel';

function App() {
  // Establish socket connection when the app loads
  useEffect(() => {
    socketService.connect();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/join/:roomCode" element={<JoinPage />} />
        <Route path="/lobby/:roomCode" element={<LobbyPage />} />
        <Route path="/game/:roomCode" element={<GamePage />} />
        <Route path="/debug" element={<DebugPage />} />
        <Route path="/test/components" element={<TestComponentsPage />} />
        <Route path="/test/ui" element={<GameUITestPage />} />
      </Routes>

      {/*process.env.NODE_ENV === 'development' &&*/ <DebugPanel />}
    </Router>
  );
}

export default App;
