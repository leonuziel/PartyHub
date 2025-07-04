import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { useRoomStore } from '../../store/roomStore';
import { FakeNewsGameState } from '../../types/types';
import { Podium } from '../../components/Podium';
import { GameTitle } from '../../components/GameTitle';
import { CountdownTimer } from '../../components/CountdownTimer';
import { PlayerStatusGrid } from '../../components/PlayerStatusGrid';
import { ResultsList } from '../../components/ResultsList';
import { SpecialAwards } from '../../components/SpecialAwards';
import { CenteredMessage } from '../../components/CenteredMessage';
import { Spinner } from '../../components/Spinner';
import { QuestionDisplay } from '../../components/QuestionDisplay';
import { HostViewContainer } from '../../components/HostViewContainer';
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
                return (
                    <CenteredMessage>
                        <GameTitle title="FakeNews" />
                        <CountdownTimer initialValue={state.timer} />
                    </CenteredMessage>
                )
            case 'WRITING':
                return (
                    <div className="fakenews-host-writing">
                        <QuestionDisplay question={state.question.replace('________', '...')} />
                        <PlayerStatusGrid players={players} />
                    </div>
                );
            case 'VOTING':
                return (
                    <div className="fakenews-host-voting">
                        <QuestionDisplay question={state.question.replace('________', '...')} />
                        <h2 className="sub-header">One of these is TRUE. The rest are FAKE NEWS.</h2>
                        <ul>
                            {state.options!.map((option, index) => (
                                <li key={index} className="option-item"><span>{index + 1}.</span> {option}</li>
                            ))}
                        </ul>
                    </div>
                );
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
