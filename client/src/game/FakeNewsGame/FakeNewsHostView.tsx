import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { FakeNewsGameState } from '../../types/types';
import './FakeNewsHostView.css';

const FakeNewsHostView: React.FC = () => {
    const { gameState } = useGameStore();
    const state = gameState as FakeNewsGameState;

    const renderContent = () => {
        switch (state.status) {
            case 'WRITING':
                return (
                    <>
                        <h1 className="question-text">{state.question.replace('________', '...')}</h1>
                        <h2 className="status-text">Players are writing their lies...</h2>
                    </>
                );
            case 'VOTING':
                return (
                    <>
                        <h1 className="question-text">{state.question.replace('________', '...')}</h1>
                        <h2 className="status-text">Vote for the real answer!</h2>
                        <ul className="options-list">
                            {state.options!.map((option, index) => (
                                <li key={index} className="option-item">{option}</li>
                            ))}
                        </ul>
                    </>
                );
            case 'REVEAL':
                return (
                    <>
                        <h1 className="status-text">The correct answer was:</h1>
                        <h2 className="question-text">{state.correctAnswer}</h2>
                        {/* Add more reveal info here */}
                    </>
                );
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

export default FakeNewsHostView;
