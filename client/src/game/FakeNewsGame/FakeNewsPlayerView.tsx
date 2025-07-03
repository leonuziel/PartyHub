import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useRoomStore } from '../../store/roomStore';
import { usePlayerStore } from '../../store/playerStore';
import { socketService } from '../../services/socketService';
import { FakeNewsGameState } from '../../types/types';
import { Button } from '../../components/Button';
import './FakeNewsPlayerView.css';

const FakeNewsPlayerView: React.FC = () => {
    const { gameState } = useGameStore();
    const { room } = useRoomStore();
    const { socketId } = usePlayerStore();
    const state = gameState as FakeNewsGameState;
    const [lie, setLie] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [voted, setVoted] = useState('');

    const players = room!.players.map(p => ({
        ...p,
        score: state.scores[p.id] || 0,
    }));
    const currentPlayer = players.find(p => p.id === socketId);
    const playerLie = currentPlayer && state.lies ? state.lies[currentPlayer.id] : null;

    useEffect(() => {
        setSubmitted(false);
        setVoted('');
    }, [state.status]);

    const handleSubmitLie = () => {
        if (!room || !lie.trim()) return;
        socketService.sendPlayerAction(room.roomCode, { type: 'SUBMIT_LIE', lie });
        setSubmitted(true);
    };

    const handleVote = (option: string) => {
        if (!room) return;
        socketService.sendPlayerAction(room.roomCode, { type: 'SUBMIT_VOTE', vote: option });
        setVoted(option);
    };

    const renderContent = () => {
        switch (state.status) {
            case 'STARTING':
                return (
                    <div className="fakenews-player-view centered-view">
                        <h2 className='get-ready-text'>Get Ready!</h2>
                        <p>Look at the main screen for the prompt!</p>
                    </div>
                )
            case 'WRITING':
                if (submitted) {
                    return (
                        <div className="fakenews-player-view centered-view">
                            <h2>Lie submitted!</h2>
                            <p>Now, look innocent...</p>
                        </div>
                    );
                }
                return (
                    <div className="fakenews-player-view">
                        <h3 className="prompt-reminder">{state.question}</h3>
                        <textarea
                            className="lie-input"
                            value={lie}
                            onChange={(e) => setLie(e.target.value)}
                            placeholder="Enter your most believable lie..."
                            maxLength={80}
                            rows={4}
                        />
                        <div className="char-counter">{lie.length} / 80</div>
                        <Button onClick={handleSubmitLie} disabled={!lie.trim()}>
                            Submit Your Fake
                        </Button>
                    </div>
                );
            case 'VOTING':
                if (voted) {
                    return (
                        <div className="fakenews-player-view centered-view">
                            <h2>Vote locked in!</h2>
                            <p>Let's see who you fooled...</p>
                        </div>
                    );
                }
                return (
                    <div className="fakenews-player-view">
                        <h2 className='voting-header'>Vote for the TRUTH!</h2>
                        <div className="voting-options-list">
                            {state.options?.map((option, index) => {
                                const isPlayerLie = option === playerLie;
                                return (
                                    <Button
                                        key={index}
                                        onClick={() => handleVote(option)}
                                        variant={"secondary"}
                                        disabled={isPlayerLie}
                                        className="vote-option-button"
                                    >
                                        {option}
                                        {isPlayerLie && <small>(Your Lie)</small>}
                                    </Button>
                                )
                            })}
                        </div>
                    </div>
                );
            case 'REVEAL':
                const myVote = currentPlayer && state.votes ? state.votes[currentPlayer.id] : null;
                const wasCorrect = myVote === state.correctAnswer;
                const foolingCount = (playerLie && state.votes) ? Object.values(state.votes).filter(vote => vote === playerLie).length : 0;

                return (
                    <div className="fakenews-player-view centered-view">
                        <h2 className={wasCorrect ? 'reveal-success' : 'reveal-fail'}>
                            {wasCorrect ? "You found the TRUTH!" : "You got FOOLED!"}
                        </h2>
                        {playerLie && (
                            <div className="fooling-score">
                                Your lie fooled {foolingCount} player(s)!
                                <div className='points-gained'>+{foolingCount * 500} Fooling Points</div>
                            </div>
                        )}
                        <p>Next round starting soon...</p>
                    </div>
                );
            case 'FINISHED':
                const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
                const myFinalRank = currentPlayer ? sortedPlayers.findIndex(p => p.id === currentPlayer.id) + 1 : null;
                const iAmMasterLiar = state.gameStats?.masterLiar === currentPlayer?.id;
                const iAmTruthSeeker = state.gameStats?.truthSeeker === currentPlayer?.id;

                return (
                    <div className="fakenews-player-view centered-view">
                        <h2>Game Over!</h2>
                        {myFinalRank && <h3 className='final-rank'>Your Rank: #{myFinalRank}</h3>}
                        <div className="personal-awards">
                            {iAmMasterLiar && <div className="award">🏆 Master Liar 🏆</div>}
                            {iAmTruthSeeker && <div className="award">🎯 Truth Seeker 🎯</div>}
                        </div>
                        {/* Add Play Again / Back to lobby buttons */}
                    </div>
                );
            default:
                return <h1 className="loading-text">Loading...</h1>;
        }
    };

    return (
        <div className="fakenews-player-container">
            {renderContent()}
        </div>
    );
};

export default FakeNewsPlayerView;
