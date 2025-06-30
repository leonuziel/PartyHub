import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useRoomStore } from '../../store/roomStore';
import { socketService } from '../../services/socketService';
import { FakeNewsGameState } from '../../types/types';
import { Button } from '../../components/Button';

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
            return <h2>Waiting for other players...</h2>;
        }

        switch (state.status) {
            case 'WRITING':
                return (
                    <div>
                        <h1>{state.question}</h1>
                        <input
                            type="text"
                            value={lie}
                            onChange={(e) => setLie(e.target.value)}
                            placeholder="Enter your lie"
                        />
                        <Button onClick={handleSubmitLie} disabled={!lie}>
                            Submit
                        </Button>
                    </div>
                );
            case 'VOTING':
                return (
                    <div>
                        <h1>Vote for the real answer!</h1>
                        {state.options?.map((option, index) => (
                            <Button key={index} onClick={() => handleVote(option)}>
                                {option}
                            </Button>
                        ))}
                    </div>
                );
            case 'REVEAL':
                return <h2>Waiting for the next round...</h2>
            case 'FINISHED':
                return <h1>Game Over!</h1>;
            default:
                return <h1>Loading...</h1>;
        }
    };

    return (
        <div>
            {renderContent()}
        </div>
    );
};

export default FakeNewsPlayerView;
