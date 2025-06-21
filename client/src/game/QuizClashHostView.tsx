import React from 'react';
import { useGameStore } from '../store/gameStore';
import { QuizClashGameState, QuizClashRevealState } from '../types/types';

const colorClasses = ['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500'];

export const QuizClashHostView: React.FC = () => {
  const gameState = useGameStore((state) => state.gameState) as QuizClashGameState | QuizClashRevealState;

  if (gameState.status === 'FINISHED') {
    const sortedScores = Object.entries(gameState.scores).sort(([, a], [, b]) => b - a);
    const winner = gameState.players.find(p => p.id === sortedScores[0][0]);
    return (
      <div className="text-center flex flex-col items-center justify-center h-full">
        <h1 className="text-6xl font-bold mb-4">Game Over!</h1>
        <h2 className="text-4xl text-yellow-400 mb-8">Winner: {winner?.nickname}</h2>
        <div className="text-left bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4">Final Scores:</h3>
            {sortedScores.map(([playerId, score], index) => {
                const player = gameState.players.find(p => p.id === playerId);
                return <p key={playerId} className="text-xl">{index + 1}. {player?.nickname}: {score}</p>
            })}
        </div>
      </div>
    );
  }

  if (gameState.status === 'REVEALING_ANSWERS') {
    const revealState = gameState as QuizClashRevealState;
    return (
        <div className="text-center">
            <h1 className="text-3xl font-bold mb-8">{revealState.question?.questionText}</h1>
            <div className="grid grid-cols-2 gap-4">
                {revealState.question?.answers.map((answer, index) => (
                    <div key={index} className={`p-8 rounded-lg text-2xl font-bold flex items-center justify-center transition-all duration-300
                        ${index === revealState.correctAnswerIndex ? 'ring-4 ring-yellow-400 scale-105' : 'opacity-50'}`}>
                        {answer}
                    </div>
                ))}
            </div>
            <p className="mt-8 text-2xl font-bold">The correct answer was: {revealState.question?.answers[revealState.correctAnswerIndex]}</p>
        </div>
    );
  }

  return (
    <div className="text-center">
      <div className="flex justify-between items-center mb-4">
          <p className="text-xl">Round: {gameState.round}</p>
          <p className="text-5xl font-bold">{gameState.timer}</p>
          <p className="text-xl">Score: {gameState.scores[Object.keys(gameState.scores)[0]]}</p>
      </div>
      <h1 className="text-4xl font-bold my-12 h-24 flex items-center justify-center">
          {gameState.question?.questionText}
      </h1>
      <div className="grid grid-cols-2 gap-4">
        {gameState.question?.answers.map((answer, index) => (
          <div key={index} className={`${colorClasses[index]} p-8 rounded-lg text-3xl font-bold`}>
            {answer}
          </div>
        ))}
      </div>
    </div>
  );
};
