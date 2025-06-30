import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useRoomStore } from '../../store/roomStore';
import { socketService } from '../../services/socketService';
import { FakeNewsGameState } from '../../types/types';
import { Button } from '../../components/Button';
import './FakeNewsPlayerView.css';

const FakeNewsPlayerView: React.FC = () => {
    const { gameState } = useGameStore();
    const room = useRoomStore((state) => state.room);
    const state = gameState as FakeNewsGameState;
    const [lie, setLie] = useState('');
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        // Reset the submitted state whenever the game status changes
        setSubmitted(false);
    }, [state.status]);

    const handleSubmitLie = () => {
        if (!room) return;
        socketService.sendPlayerAction(room.roomCode, { type: 'SUBMIT_LIE', lie });
        setSubmitted(true);
    };

    const handleVote = (option: string) => {
        if (!room) return;
        socketService.sendPlayerAction(room.roomCode, { type: 'SUBMIT_VOTE', vote: option });
        setSubmitted(true);
    };

    const renderContent = () => {
        if (submitted) {
            return <h2 className="status-text">Waiting for other players...</h2>;
        }

        switch (state.status) {
            case 'WRITING':
                return (
                    <div className="player-input-container">
                        <h1 className="question-text">{state.question}</h1>
                        <textarea
                            className="lie-input"
                            value={lie}
                            onChange={(e) => setLie(e.target.value)}
                            placeholder="Enter your most believable lie..."
                            rows={3}
                        />
                        <Button onClick={handleSubmitLie} disabled={!lie}>
                            Submit Lie
                        </Button>
                    </div>
                );
            case 'VOTING':
                return (
                    <div className="player-input-container">
                        <h1 className="question-text">Vote for the truth!</h1>
                        <div className="voting-options">
                            {state.options?.map((option, index) => (
                                <Button key={index} onClick={() => handleVote(option)} variant="secondary">
                                    {option}
                                </Button>
                            ))}
                        </div>
                    </div>
                );
            case 'REVEAL':
                return <h2 className="status-text">Waiting for the next round...</h2>;
            case 'FINISHED':
                return <h1 className="question-text">Game Over!</h1>;
            default:
                return <h1 className="question-text">Loading...</h1>;
        }
    };

    return (
        <div className="game-view-container">
            {renderContent()}
        </div>
    );
};

export default FakeNewsPlayerView;
