import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useRoomStore } from '../../store/roomStore';
import { usePlayerStore } from '../../store/playerStore';
import { socketService } from '../../services/socketService';
import { FakeNewsGameState } from '../../types/types';
import { Button } from '../../components/Button';
import { PlayerStatusContainer } from '../../components/PlayerStatusContainer';
import { TextAreaWithCounter } from '../../components/TextAreaWithCounter';
import { VotingOptions } from '../../components/VotingOptions';
import { RankDisplay } from '../../components/RankDisplay';
import { AwardDisplay } from '../../components/AwardDisplay';
import { Spinner } from '../../components/Spinner';
import { PlayerViewContainer } from '../../components/PlayerViewContainer';
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
                return <PlayerStatusContainer title="Get Ready!" subtitle="Look at the main screen for the prompt!" />;
            case 'WRITING':
                if (submitted) {
                    return <PlayerStatusContainer title="Lie submitted!" subtitle="Now, look innocent..." />;
                }
                return (
                    <div className="fakenews-player-view">
                        <h3 className="prompt-reminder">{state.question}</h3>
                        <TextAreaWithCounter
                            maxLength={80}
                            onChange={setLie}
                            placeholder="Enter your most believable lie..."
                        />
                        <Button onClick={handleSubmitLie} disabled={!lie.trim()}>
                            Submit Your Fake
                        </Button>
                    </div>
                );
            case 'VOTING':
                if (voted) {
                    return <PlayerStatusContainer title="Vote locked in!" subtitle="Let's see who you fooled..." />;
                }
                const votingOptions = state.options?.filter(o => o !== playerLie) || [];
                return (
                    <div className="fakenews-player-view">
                        <h2 className='voting-header'>Vote for the TRUTH!</h2>
                        <VotingOptions
                            options={votingOptions}
                            onVote={handleVote}
                        />
                    </div>
                );
            case 'REVEAL':
                const myVote = currentPlayer && state.votes ? state.votes[currentPlayer.id] : null;
                const wasCorrect = myVote === state.correctAnswer;
                const foolingCount = (playerLie && state.votes) ? Object.values(state.votes).filter(vote => vote === playerLie).length : 0;

                return (
                    <PlayerStatusContainer
                        title={wasCorrect ? "You found the TRUTH!" : "You got FOOLED!"}
                        subtitle={playerLie ? `Your lie fooled ${foolingCount} player(s)!` : "Next round starting soon..."}
                    />
                );
            case 'FINISHED':
                const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
                const myFinalRank = currentPlayer ? sortedPlayers.findIndex(p => p.id === currentPlayer.id) + 1 : 0;
                const iAmMasterLiar = state.gameStats?.masterLiar === currentPlayer?.id;
                const iAmTruthSeeker = state.gameStats?.truthSeeker === currentPlayer?.id;

                return (
                    <div className="fakenews-player-view centered-view">
                        <PlayerStatusContainer title="Game Over!" />
                        {myFinalRank > 0 && <RankDisplay rank={myFinalRank} />}
                        <div className="personal-awards">
                            {iAmMasterLiar && <AwardDisplay award="Master Liar" description="You were the best at fooling others!" />}
                            {iAmTruthSeeker && <AwardDisplay award="Truth Seeker" description="You had a keen eye for the truth!" />}
                        </div>
                    </div>
                );
            default:
                return <Spinner />;
        }
    };

    return (
        <PlayerViewContainer>
            {renderContent()}
        </PlayerViewContainer>
    );
};

export default FakeNewsPlayerView;
