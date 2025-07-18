import React from 'react';
import './Scoreboard.css';

interface ScoreboardProps {
  scores: { [playerName: string]: number };
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ scores }) => {
  return (
    <div className="scoreboard">
      <h2>Scoreboard</h2>
      <ul>
        {Object.entries(scores).map(([player, score]) => (
          <li key={player}>
            {player}: {score}
          </li>
        ))}
      </ul>
    </div>
  );
};
