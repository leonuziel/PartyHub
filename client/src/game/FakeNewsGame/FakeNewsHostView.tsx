import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useRoomStore } from '../../store/roomStore';
import { FakeNewsGameState, Player } from '../../types/types';
import './FakeNewsHostView.css';
import { PlayerCard } from '../../components/PlayerCard';

const Podium: React.FC<{ players: Player[] }> = ({ players }) => {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    return (
        <div className="podium">
            {sortedPlayers.slice(0, 3).map((player, index) => (
                <div key={player.id} className={`podium-place podium-${index + 1}`}>
                    <PlayerCard player={player} />
                    <div className="podium-rank">{index + 1}</div>
                    <div className="podium-name">{player.nickname}</div>
                    <div className="podium-score">{player.score}</div>
                </div>
            ))}
        </div>
    );
};

const FakeNewsHostView: React.FC = () => {
    const { gameState } = useGameStore();
    const { room } = useRoomStore();
    const state = gameState as FakeNewsGameState;
    const players = room!.players.map(p => ({
        ...p,
        score: state.scores[p.id] || 0,
    }));
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        if (state.status === 'STARTING') {
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev === 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [state.status]);


    const renderContent = () => {
        switch (state.status) {
            case 'STARTING':
                return (
                    <div className='fakenews-host-starting'>
                        <h1 className="game-title">FakeNews</h1>
                        {countdown > 0 ? <div className="countdown">{countdown}</div> : <h2>Get Ready!</h2>}
                    </div>
                )
            case 'WRITING':
                return (
                    <div className="fakenews-host-writing">
                        <h1 className="question-prompt">{state.question.replace('________', '...')}</h1>
                        <div className="player-status-grid">
                            {players.map(p => {
                                const submitted = state.lies && state.lies[p.id];
                                return (
                                <div key={p.id} className={`player-status ${submitted ? 'submitted' : ''}`}>
                                        <PlayerCard player={p} />
                                        <span>{p.nickname}</span>
                                        {submitted && <div className="submitted-check">✔</div>}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                );
            case 'VOTING':
                return (
                    <div className="fakenews-host-voting">
                        <h1 className="question-prompt">{state.question.replace('________', '...')}</h1>
                        <h2 className="sub-header">One of these is TRUE. The rest are FAKE NEWS.</h2>
                        <ul className="options-list">
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
                        <ul className="reveal-list">
                            {state.options?.map((option, index) => {
                                const isCorrect = option === state.correctAnswer;
                                // Defensive checks to prevent crash if votes or lies are not yet populated
                                const voters = state.votes ? Object.values(state.votes).filter(vote => vote === option) : [];
                                const authorId = state.lies ? Object.keys(state.lies).find(key => state.lies![key] === option) : null;
                                const author = players.find((p: Player) => p.id === authorId);

                                return (
                                    <li key={index} className={`reveal-item ${isCorrect ? 'correct' : 'fake'}`}>
                                        <div className="option-text">{option}</div>
                                        {isCorrect && <div className="truth-stamp">TRUTH!</div>}
                                        {author && (
                                            <div className="author-reveal">
                                                <span>Submitted by: {author.nickname}</span>
                                            </div>
                                        )}
                                        <div className="voters">
                                            {voters.map((voterId: string) => {
                                                const voter = players.find((p: Player) => p.id === voterId);
                                                return voter && <PlayerCard key={voterId} player={voter} size="small" />
                                            })}
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                );
            case 'FINISHED':
                const masterLiar = state.gameStats?.masterLiar ? players.find((p: Player) => p.id === state.gameStats!.masterLiar) : null;
                const truthSeeker = state.gameStats?.truthSeeker ? players.find((p: Player) => p.id === state.gameStats!.truthSeeker) : null;

                return (
                    <div className='fakenews-host-finished'>
                        <h1>Game Over!</h1>
                        <Podium players={players} />
                        <div className="special-awards">
                            {masterLiar && <h2>Master Liar: {masterLiar.nickname}</h2>}
                            {truthSeeker && <h2>Truth Seeker: {truthSeeker.nickname}</h2>}
                        </div>
                    </div>
                );
            default:
                return <h1 className="loading-text">Loading...</h1>;
        }
    };

    return (
        <div className="fakenews-host-container">
            {renderContent()}
        </div>
    );
};

export default FakeNewsHostView;
