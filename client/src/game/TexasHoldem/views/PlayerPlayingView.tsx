import React, { useState } from 'react';
import { useGameStore } from '../../../store/gameStore';
import { usePlayerHandStore } from '../../../store/playerHandStore';
import { usePlayerStore } from '../../../store/playerStore';
import { useRoomStore } from '../../../store/roomStore';
import { socketService } from '../../../services/socketService';
import { TexasHoldemGameState, TexasHoldemAction } from '../../../types/types';
import { CardSlot } from '../../../components/cards/CardSlot';
import { Button } from '../../../components/controls/Button';
import { CenteredMessage } from '../../../components/layout/CenteredMessage';
import '../TexasHoldemPlayerView.css';

const SMALL_BLIND = 10; // This should ideally come from a shared config

export const PlayerPlayingView: React.FC = () => {
    const gameState = useGameStore((state) => state.gameState) as TexasHoldemGameState | null;
    const { hand } = usePlayerHandStore();
    const { socketId } = usePlayerStore();
    const room = useRoomStore((state) => state.room);
    const [betAmount, setBetAmount] = useState(0);

    if (!gameState) {
        return <div>Loading...</div>;
    }
    
    const me = gameState.players.find(p => p.id === socketId);
    const isMyTurn = gameState.currentPlayerId === socketId;

    const handleAction = (actionType: TexasHoldemAction['type'], amount?: number) => {
        if (!isMyTurn || !room) return;
        socketService.sendPlayerAction(room.roomCode, { type: actionType, amount });
    };
    
    const canCheck = me && me.currentBet === gameState.currentBet;
    const canBet = me && gameState.currentBet === 0;

    return (
        <div className="player-view-container">
            <div className="player-hand-area">
                {hand.map((card, index) => (
                    <CardSlot key={index} card={card} isFaceUp={true} />
                ))}
            </div>
            
            {isMyTurn && (
                <div className="action-buttons">
                    <Button onClick={() => handleAction('FOLD')} disabled={!isMyTurn || me?.isFolded}>Fold</Button>
                    {canCheck ? (
                        <Button onClick={() => handleAction('CHECK')} disabled={!isMyTurn}>Check</Button>
                    ) : (
                        <Button onClick={() => handleAction('CALL')} disabled={!isMyTurn}>Call ${gameState.currentBet - (me?.currentBet || 0)}</Button>
                    )}
                    {canBet ? (
                        <Button onClick={() => handleAction('BET', betAmount)} disabled={!isMyTurn || betAmount < gameState.minRaise}>Bet</Button>
                    ) : (
                        <Button onClick={() => handleAction('RAISE', betAmount)} disabled={!isMyTurn || betAmount < gameState.minRaise}>Raise</Button>
                    )}
                </div>
            )}

            {isMyTurn && (canBet || gameState.currentBet > 0) && (
                 <div className="bet-slider-container">
                    <input 
                        type="range" 
                        min={gameState.minRaise}
                        max={me?.chips || 100} 
                        value={betAmount}
                        onChange={(e) => setBetAmount(Number(e.target.value))}
                        step={SMALL_BLIND}
                    />
                    <div className="bet-amount-display">${betAmount}</div>
                </div>
            )}

            {!isMyTurn && !me?.isFolded && (
                 <CenteredMessage>Waiting for other players...</CenteredMessage>
            )}
            {me?.isFolded && (
                <CenteredMessage>You have folded.</CenteredMessage>
            )}
        </div>
    );
};
