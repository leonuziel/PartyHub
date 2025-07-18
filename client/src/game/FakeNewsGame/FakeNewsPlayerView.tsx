import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useRoomStore } from '../../store/roomStore';
import { usePlayerStore } from '../../store/playerStore';
import { socketService } from '../../services/socketService';
import { FakeNewsGameState } from '../../types/types';

import { Spinner } from '../../components/old/common/Spinner';
import { PlayerViewContainer } from '../../components/old/layout/PlayerViewContainer';
import { PlayerStartingView } from './views/PlayerStartingView';
import { PlayerWritingView } from './views/PlayerWritingView';
import { PlayerVotingView } from './views/PlayerVotingView';
import { PlayerRevealView } from './views/PlayerRevealView';
import { PlayerFinishedView } from './views/PlayerFinishedView';
import { PlayerStatusContainer } from '../../components/old/display/PlayerStatusContainer';
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
                return <PlayerStartingView />;
            case 'WRITING':
                if (submitted) {
                    return <PlayerStatusContainer title="Lie submitted!" subtitle="Now, look innocent..." />;
                }
                return <PlayerWritingView question={state.question} onLieChange={setLie} onSubmit={handleSubmitLie} lie={lie} />;
            case 'VOTING':
                if (voted) {
                    return <PlayerStatusContainer title="Vote locked in!" subtitle="Let's see who you fooled..." />;
                }
                const votingOptions = state.options?.filter(o => o !== playerLie) || [];
                return <PlayerVotingView options={votingOptions} onVote={handleVote} />;
            case 'REVEAL':
                const myVote = currentPlayer && state.votes ? state.votes[currentPlayer.id] : null;
                const wasCorrect = myVote === state.correctAnswer;
                const foolingCount = (playerLie && state.votes) ? Object.values(state.votes).filter(vote => vote === playerLie).length : 0;
                return <PlayerRevealView wasCorrect={wasCorrect} playerLie={playerLie} foolingCount={foolingCount} />;
            case 'FINISHED':
                const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
                const myFinalRank = currentPlayer ? sortedPlayers.findIndex(p => p.id === currentPlayer.id) + 1 : 0;
                const iAmMasterLiar = state.gameStats?.masterLiar === currentPlayer?.id;
                const iAmTruthSeeker = state.gameStats?.truthSeeker === currentPlayer?.id;
                return <PlayerFinishedView myFinalRank={myFinalRank} iAmMasterLiar={iAmMasterLiar} iAmTruthSeeker={iAmTruthSeeker} />;
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
