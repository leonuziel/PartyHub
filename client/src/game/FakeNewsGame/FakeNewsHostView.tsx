import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { useRoomStore } from '../../store/roomStore';
import { FakeNewsGameState } from '../../types/types';

import { Spinner } from '../../components/old/common/Spinner';
import { HostViewContainer } from '../../components/old/layout/HostViewContainer';
import { HostStartingView } from './views/HostStartingView';
import { HostWritingView } from './views/HostWritingView';
import { HostVotingView } from './views/HostVotingView';
import { HostRevealView } from './views/HostRevealView';
import { HostFinishedView } from './views/HostFinishedView';
import './FakeNews.css';

const FakeNewsHostView: React.FC = () => {
    const { gameState } = useGameStore();
    const { room } = useRoomStore();
    const state = gameState as FakeNewsGameState;

    if (!state || !room) {
        return <Spinner />;
    }

    const players = room.players.map(p => ({
        ...p,
        score: state.scores[p.id] || 0,
        hasAnswered: state.lies && !!state.lies[p.id],
    }));

    const renderContent = () => {
        switch (state.status) {
            case 'STARTING':
                return <HostStartingView timer={state.timer} />;
            case 'WRITING':
                return <HostWritingView question={state.question} players={players} />;
            case 'VOTING':
                return <HostVotingView question={state.question} options={state.options || []} />;
            case 'REVEAL':
                return (
                    <HostRevealView
                        options={state.options || []}
                        votes={state.votes || {}}
                        correctAnswer={state.correctAnswer || ''}
                        players={players}
                    />
                );
            case 'FINISHED':
                const masterLiar = state.gameStats?.masterLiar ? players.find(p => p.id === state.gameStats!.masterLiar) : null;
                const truthSeeker = state.gameStats?.truthSeeker ? players.find(p => p.id === state.gameStats!.truthSeeker) : null;
                const awards = [];
                if (masterLiar) awards.push({ awardName: 'Master Liar', player: masterLiar });
                if (truthSeeker) awards.push({ awardName: 'Truth Seeker', player: truthSeeker });

                return (
                    <HostFinishedView players={players} awards={awards} />
                );
            default:
                return <Spinner />;
        }
    };

    return (
        <HostViewContainer>
            {renderContent()}
        </HostViewContainer>
    );
};

export default FakeNewsHostView;
