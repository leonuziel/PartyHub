import React from 'react';
import { Player, TexasHoldemPlayer } from '../../types/types';
import './PlayerInfo.css';

interface PlayerInfoProps {
  player: Player | TexasHoldemPlayer;
  isCurrent?: boolean;
  isDealer?: boolean;
  isSmallBlind?: boolean;
  isBigBlind?: boolean;
}

export const PlayerInfo: React.FC<PlayerInfoProps> = ({ 
    player, 
    isCurrent,
    isDealer,
    isSmallBlind,
    isBigBlind
}) => {
  
  // Type guard to check if it's a poker player
  const isPokerPlayer = (p: Player | TexasHoldemPlayer): p is TexasHoldemPlayer => {
    return 'chips' in p;
  };

  const classNames = [
    'player-info',
    isCurrent ? 'is-current' : '',
    isPokerPlayer(player) && player.isFolded ? 'is-folded' : ''
  ].join(' ').trim();

  return (
    <div className={classNames}>
      <div className="player-name">{player.nickname}</div>

      {isPokerPlayer(player) ? (
        <>
            <div className="player-chips">Chips: ${player.chips}</div>
            {player.currentBet > 0 && (
                <div className="player-bet">Bet: ${player.currentBet}</div>
            )}
        </>
      ) : (
         'score' in player && player.score !== undefined && <div className="player-score">{player.score}</div>
      )}

      <div className="player-status-icons">
        {isDealer && <div className="dealer-chip">D</div>}
        {isSmallBlind && <span>SB</span>}
        {isBigBlind && <span>BB</span>}
      </div>
    </div>
  );
};
