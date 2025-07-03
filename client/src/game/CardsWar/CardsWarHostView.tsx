import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { CardsWarGameState } from '../../types/types';
import './CardsWarHostView.css';

export const CardsWarHostView: React.FC = () => {
    const gameState = useGameStore((state) => state.gameState) as CardsWarGameState;
    
    if (!gameState) {
        return <div>Loading...</div>;
    }

  const { status, players, timer } = gameState;

  if (status === 'STARTING') {
    return (
      <div className="war-starting">
        <h1 className="war-title">Get Ready!</h1>
        <div className="war-countdown">{timer}</div>
      </div>
    );
  }

  if (status === 'FINISHED') {
    const winner = players.find((p: any) => p.id === gameState.winnerId);
    return (
      <div className="war-finished">
        <h1 className="war-title">Game Over!</h1>
        <h2 className="war-winner">{winner?.nickname} Wins!</h2>
        {/* Add fun stats here */}
      </div>
    );
  }

  const player1 = players[0];
  const player2 = players[1];

  return (
    <div className="war-main">
      <div className="player-zone top">
        <div>{player1.nickname}</div>
        <div>Card Count: {gameState.player1CardCount}</div>
      </div>
      <div className="battlefield">
        {status === 'ROUND_IN_PROGRESS' && (
          <>
            <div className="card-container">
              {gameState.player1Card && <div className="card">{gameState.player1Card.name}</div>}
            </div>
            <div className="card-container">
              {gameState.player2Card && <div className="card">{gameState.player2Card.name}</div>}
            </div>
          </>
        )}
        {status === 'WAR_DECLARED' && (
            <div className="war-declaration">
                <div className="war-banner">WAR!</div>
                <div className="war-pot">
                    <div className="card face-down"></div>
                    <div className="card face-down"></div>
                    <div className="card face-down"></div>
                </div>
                <div className="versus">VS</div>
                <div className="war-pot">
                    <div className="card face-down"></div>
                    <div className="card face-down"></div>
                    <div className="card face-down"></div>
                </div>
            </div>
        )}
      </div>
      <div className="player-zone bottom">
        <div>{player2.nickname}</div>
        <div>Card Count: {gameState.player2CardCount}</div>
      </div>
    </div>
  );
};
