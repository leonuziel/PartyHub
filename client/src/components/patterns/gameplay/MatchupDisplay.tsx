import React from 'react';
import './MatchupDisplay.css';
import { PlayerAvatar } from '../../old/display/PlayerAvatar';
import { Player } from '../../../types/types';


interface MatchupDisplayProps {
  player1: Player;
  player2: Player;
  matchupTitle?: string;
}

export const MatchupDisplay: React.FC<MatchupDisplayProps> = ({ player1, player2, matchupTitle = "VS" }) => {
  return (
    <div className="matchup-display-container">
      <div className="player-side">
        <PlayerAvatar player={player1} size="large" />
        <h3>{player1.nickname}</h3>
      </div>
      <div className="matchup-center">
        <h2>{matchupTitle}</h2>
      </div>
      <div className="player-side">
        <PlayerAvatar player={player2} size="large" />
        <h3>{player2.nickname}</h3>
      </div>
    </div>
  );
};
