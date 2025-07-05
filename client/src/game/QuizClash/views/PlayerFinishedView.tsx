import React from 'react';
import { RankDisplay } from '../../../components/display/RankDisplay';
import { PodiumList } from '../../../components/display/PodiumList';
import { Button } from '../../../components/controls/Button';
import { Player } from '../../../types/types';

interface PlayerFinishedViewProps {
  rank: number | null;
  playerCount: number;
  score: number;
  topPlayers: Player[];
  onPlayAgain: () => void;
  onBackToLobby: () => void;
}

export const PlayerFinishedView: React.FC<PlayerFinishedViewProps> = ({ rank, playerCount, score, topPlayers, onPlayAgain, onBackToLobby }) => {
  return (
    <div className="player-finished-container">
      {rank && <RankDisplay rank={rank} />}
      <p className="player-final-score">Final Score: {score}</p>
      <PodiumList players={topPlayers} />
      <div className="player-action-buttons">
        <Button onClick={onPlayAgain}>Play Again</Button>
        <Button onClick={onBackToLobby} variant="secondary">Back to Lobby</Button>
      </div>
    </div>
  );
};
