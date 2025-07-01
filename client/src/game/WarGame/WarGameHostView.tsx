import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { usePlayerRole } from '../../hooks/usePlayerRole';
import { socketService } from '../../services/socketService';
import { useRoomStore } from '../../store/roomStore';

export const WarGameHostView: React.FC = () => {
    const gameState = useGameStore((state) => state.gameState);
    const room = useRoomStore((state) => state.room);
    const { isHost } = usePlayerRole();

    const handleStartGame = () => {
        if (isHost && room) {
            socketService.sendPlayerAction(room.roomCode, { type: 'START_GAME' });
        }
    };
    
    if (!gameState || !room) {
        return <div>Loading...</div>;
    }

    if (gameState.status === 'INSTRUCTIONS') {
        return (
            <div>
                <h1>How to Play War</h1>
                <p>Each player gets half the deck. In each round, you'll both play your top card. The highest card wins the round and takes both cards. If you tie, it's WAR! You'll each place three cards face-down, then one face-up. The winner of that face-off takes all 10 cards. The game is over when one player has all the cards.</p>
                <button onClick={handleStartGame}>Start Game</button>
            </div>
        );
    }
    
    if (gameState.status === 'GAME_END') {
        const winner = gameState.players.find((p: any) => p.id === gameState.gameWinner)?.nickname;
        return (
            <div>
                <h1>Game Over!</h1>
                <h2>{winner} wins!</h2>
            </div>
        );
    }
    
    const player1 = gameState.players[0];
    const player2 = gameState.players[1];

    return (
        <div>
            <h1>War</h1>
            <div>
                <h2>{player1.nickname}</h2>
                <p>Cards: {gameState.playerCardCounts[player1.id]}</p>
                <div>{gameState.revealedCards?.[player1.id] && <img src={`/cards/${gameState.revealedCards[player1.id]}.png`} alt="card" />}</div>
            </div>
            <div>
                <h2>{player2.nickname}</h2>
                <p>Cards: {gameState.playerCardCounts[player2.id]}</p>
                <div>{gameState.revealedCards?.[player2.id] && <img src={`/cards/${gameState.revealedCards[player2.id]}.png`} alt="card" />}</div>
            </div>
            {gameState.status === 'WAR_DECLARE' && <h2>WAR!</h2>}
            {gameState.status === 'ROUND_END' && <p>{gameState.players.find((p: any) => p.id === gameState.roundWinner)?.nickname} wins the round!</p>}
        </div>
    );
};
