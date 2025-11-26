import React from 'react';
import './FinalResultsScreen.css';
import { Podium } from '../../old/display/Podium';
import { ListDisplay } from '../../primitives/display/ListDisplay';
import { Player } from '../../../types/types';


interface FinalResultsScreenProps {
  players: Player[]; // Should be sorted by rank
  onPlayAgain: () => void;
  onExit: () => void;
}

export const FinalResultsScreen: React.FC<FinalResultsScreenProps> = ({ players, onPlayAgain, onExit }) => {
  const topThree = players.slice(0, 3);
  const otherPlayers = players.slice(3);

  return (
    <div className="final-results-screen">
      <h1>Final Results</h1>
      <Podium players={topThree} />
      {otherPlayers.length > 0 && (
        <div className="other-players-list">
          <h4>Full Standings</h4>
          <ListDisplay
            items={otherPlayers}
            renderItem={({ item, index }: { item: Player, index: number }) => (
              <div className="player-rank-item">
                <span>{index + 4}.</span>
                <span>{item.nickname}</span>
                <span>{item.score}</span>
              </div>
            )}
          />
        </div>
      )}
      <div className="results-actions">
        <button onClick={onPlayAgain}>Play Again</button>
        <button onClick={onExit}>Exit to Lobby</button>
      </div>
    </div>
  );
};
