import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { usePlayerRole } from '../../hooks/usePlayerRole';
import { socketService } from '../../services/socketService';
import { useRoomStore } from '../../store/roomStore';

export const WarGamePlayerView: React.FC = () => {
    const gameState = useGameStore((state) => state.gameState);
    const room = useRoomStore((state) => state.room);
    const { playerId } = usePlayerRole();

    const handlePlayCard = () => {
        if (room) {
            socketService.sendPlayerAction(room.roomCode, { type: 'PLAY_CARD' });
        }
    };

    if (!gameState || !playerId || !room) {
        return <div>Loading...</div>;
    }
    
    const canPlayCard = gameState.status === 'ROUND_START' || gameState.status === 'WAR_IN_PROGRESS';

    if (gameState.status === 'INSTRUCTIONS') {
        return (
            <div>
                <h1>How to Play War</h1>
                <p>Each player gets half the deck. In each round, you'll both play your top card. The highest card wins the round and takes both cards. If you tie, it's WAR! You'll each place three cards face-down, then one face-up. The winner of that face-off takes all 10 cards. The game is over when one player has all the cards.</p>
                <p>Waiting for the host to start the game...</p>
            </div>
        );
    }
    
    if (gameState.status === 'GAME_END') {
        const winner = gameState.players.find((p: any) => p.id === gameState.gameWinner)?.nickname;
        const amWinner = gameState.gameWinner === playerId;
        return (
            <div>
                <h1>{amWinner ? "You Win!" : "You Lose!"}</h1>
                <h2>{winner} has all the cards!</h2>
            </div>
        );
    }

    const opponent = gameState.players.find((p: any) => p.id !== playerId);
    const opponentId = opponent?.id;

    return (
        <div>
            <h1>War</h1>
            {opponentId && (
                <div>
                    <h2>{opponent.nickname}'s Cards: {gameState.playerCardCounts[opponentId]}</h2>
                    <div>{gameState.revealedCards?.[opponentId] && <img src={`/cards/${gameState.revealedCards[opponentId]}.png`} alt="card" />}</div>
                </div>
            )}
            <div>
                <h2>Your Cards: {gameState.myCardCount}</h2>
                <div>{gameState.revealedCards?.[playerId] && <img src={`/cards/${gameState.revealedCards[playerId]}.png`} alt="card" />}</div>
            </div>
            
            <button onClick={handlePlayCard} disabled={!canPlayCard || gameState.revealedCards?.[playerId]}>
                Play Card
            </button>

            {gameState.status === 'WAR_DECLARE' && <h2>WAR!</h2>}
            {gameState.status === 'ROUND_END' && <p>{gameState.players.find((p: any) => p.id === gameState.roundWinner)?.nickname} wins the round!</p>}
        </div>
    );
};

export {};
