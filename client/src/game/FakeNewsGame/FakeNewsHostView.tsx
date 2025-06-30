import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { FakeNewsGameState } from '../../types/types';

const FakeNewsHostView: React.FC = () => {
    const { gameState } = useGameStore();
    const state = gameState as FakeNewsGameState;

    const renderContent = () => {
        switch (state.status) {
            case 'WRITING':
                return (
                    <div>
                        <h1>{state.question.replace('________', '...')}</h1>
                        <h2>Players are writing their lies...</h2>
                    </div>
                );
            case 'VOTING':
                return (
                    <div>
                        <h1>{state.question.replace('________', '...')}</h1>
                        <h2>Vote for the real answer!</h2>
                        <ul>
                            {state.options!.map((option, index) => (
                                <li key={index}>{option}</li>
                            ))}
                        </ul>
                    </div>
                );
            case 'REVEAL':
                return (
                    <div>
                        <h1>The correct answer was:</h1>
                        <h2>{state.correctAnswer}</h2>
                        {/* Add more reveal info here */}
                    </div>
                );
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

export default FakeNewsHostView;
