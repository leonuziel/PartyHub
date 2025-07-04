import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { useRoomStore } from '../../store/roomStore';
import { FakeNewsGameState } from '../../types/types';
import { Podium } from '../../components/Podium';
import { GameTitle } from '../../components/GameTitle';
import { ResultsList } from '../../components/ResultsList';
import { SpecialAwards } from '../../components/SpecialAwards';
import { Spinner } from '../../components/Spinner';
import { HostViewContainer } from '../../components/HostViewContainer';
import { HostStartingView } from './views/HostStartingView';
import { HostWritingView } from './views/HostWritingView';
import { HostVotingView } from './views/HostVotingView';
import './FakeNewsHostView.css';

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
                    <div className="fakenews-host-reveal">
                        <h1 className='reveal-header'>The results are in!</h1>
                        <ResultsList
                            options={state.options || []}
                            votes={state.votes || {}}
                            correctAnswer={state.correctAnswer || ''}
                            players={players}
                        />
                    </div>
                );
            case 'FINISHED':
                const masterLiar = state.gameStats?.masterLiar ? players.find(p => p.id === state.gameStats!.masterLiar) : null;
                const truthSeeker = state.gameStats?.truthSeeker ? players.find(p => p.id === state.gameStats!.truthSeeker) : null;
                const awards = [];
                if (masterLiar) awards.push({ awardName: 'Master Liar', player: masterLiar });
                if (truthSeeker) awards.push({ awardName: 'Truth Seeker', player: truthSeeker });

                return (
                    <div className='fakenews-host-finished'>
                        <GameTitle title="Game Over!" />
                        <Podium players={players} />
                        <SpecialAwards awards={awards} />
                    </div>
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
