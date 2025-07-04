import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { useRoomStore } from '../../store/roomStore';
import { CardsWarGameState, Player } from '../../types/types';
import { Card } from '../../components/Card';
import { PlayerInfo } from '../../components/PlayerInfo';
import { WinnerDisplay } from '../../components/WinnerDisplay';
import { CountdownTimer } from '../../components/CountdownTimer';
import { CenteredMessage } from '../../components/CenteredMessage';
import { GameTitle } from '../../components/GameTitle';
import { PlayArea } from '../../components/PlayArea';
import { Spinner } from '../../components/Spinner';
import { HostViewContainer } from '../../components/HostViewContainer';
import './CardsWarHostView.css';

export const CardsWarHostView: React.FC = () => {
    const gameState = useGameStore((state) => state.gameState) as CardsWarGameState;
    const hostId = useRoomStore((state) => state.room?.hostId);
    
    if (!gameState) {
        return <Spinner />;
    }

  const { status, players, timer, winnerId } = gameState;

  if (status === 'STARTING') {
    return (
        <CenteredMessage>
            <GameTitle title="Get Ready!" />
            <CountdownTimer initialValue={timer} />
        </CenteredMessage>
    );
  }

  if (status === 'FINISHED') {
    const winner = players.find((p: Player) => p.id === winnerId);
    return (
        <CenteredMessage>
            <GameTitle title="Game Over!" />
            {winner && <WinnerDisplay winnerName={winner.nickname} />}
        </CenteredMessage>
    );
  }

  const competingPlayers = players.filter(p => p.id !== hostId);
  const player1 = competingPlayers[0];
  const player2 = competingPlayers[1];

  return (
    <HostViewContainer>
        {player1 && <PlayerInfo player={player1} />}
        <PlayArea>
            {status === 'ROUND_IN_PROGRESS' && (
            <>
                {gameState.player1Card && <Card faceUp={true} content={gameState.player1Card.name} />}
                {gameState.player2Card && <Card faceUp={true} content={gameState.player2Card.name} />}
            </>
            )}
            {status === 'WAR_DECLARED' && (
                <div className="war-declaration">
                    <div className="war-banner">WAR!</div>
                    <div className="war-pot">
                        <Card /><Card /><Card />
                    </div>
                    <div className="war-showdown">
                        {gameState.player1Card && <Card faceUp={true} content={gameState.player1Card.name} />}
                        <div className="versus">VS</div>
                        {gameState.player2Card && <Card faceUp={true} content={gameState.player2Card.name} />}
                    </div>
                    <div className="war-pot">
                        <Card /><Card /><Card />
                    </div>
                </div>
            )}
        </PlayArea>
        {player2 && <PlayerInfo player={player2} />}
    </HostViewContainer>
  );
};
