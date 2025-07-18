import React from 'react';
import { useGameStore } from '../../../store/gameStore';
import { TexasHoldemGameState } from '../../../types/types';
import { CardSlot } from '../../../components/old/cards/CardSlot';
import { PlayerInfo } from '../../../components/old/display/PlayerInfo';
import '../TexasHoldemHostView.css';

export const HostPlayingView: React.FC = () => {
    const gameState = useGameStore((state) => state.gameState) as TexasHoldemGameState | null;

    if (!gameState) {
        return <div>Loading game state...</div>;
    }

    const { players, communityCards, pot, currentPlayerId, dealerId, smallBlindId, bigBlindId } = gameState;

    const getPlayerPosition = (index: number, totalPlayers: number) => {
        const angle = (index / totalPlayers) * 2 * Math.PI;
        const xRadius = 48;
        const yRadius = 45;
        const x = 50 + xRadius * Math.cos(angle);
        const y = 50 + yRadius * Math.sin(angle);
        return { top: `${y}%`, left: `${x}%` };
    };

    return (
        <div className="poker-table-container">
            <div className="poker-table">
                <div className="player-positions">
                    {players.map((player, index) => (
                        <div key={player.id} className="player-seat" style={getPlayerPosition(index, players.length)}>
                            <PlayerInfo
                                player={player}
                                isCurrent={player.id === currentPlayerId}
                                isDealer={player.id === dealerId}
                                isSmallBlind={player.id === smallBlindId}
                                isBigBlind={player.id === bigBlindId}
                            />
                        </div>
                    ))}
                </div>
                <div className="community-cards-area">
                    <div className="pot-display">Pot: ${pot}</div>
                    <div className="card-slot-row">
                        {Array(5).fill(null).map((_, index) => (
                            <CardSlot key={index} card={communityCards[index]} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
