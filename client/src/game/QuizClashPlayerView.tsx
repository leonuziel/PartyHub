import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { useRoomStore } from '../store/roomStore';
import { usePlayerRole } from '../hooks/usePlayerRole';
import { socketService } from '../services/socketService';
import { QuizClashGameState, QuizClashRevealState } from '../types/types';
import { Spinner } from '../components/Spinner';

const colorClasses = ['bg-red-600 hover:bg-red-700', 'bg-blue-600 hover:bg-blue-700', 'bg-yellow-500 hover:bg-yellow-600', 'bg-green-600 hover:bg-green-700'];

export const QuizClashPlayerView: React.FC = () => {
  const gameState = useGameStore((state) => state.gameState) as QuizClashGameState | QuizClashRevealState;
  const room = useRoomStore((state) => state.room);
  const { playerId } = usePlayerRole();
  const [answered, setAnswered] = useState<number | null>(null);

  React.useEffect(() => {
    // Reset answered state on new question
    if (gameState.status === 'ASKING_QUESTION') {
      setAnswered(null);
    }
  }, [gameState.status, gameState.round]);

  const handleAnswer = (answerIndex: number) => {
    if (!room || answered !== null) return;
    setAnswered(answerIndex);
    socketService.sendPlayerAction(room.roomCode, { answerIndex });
  };
  
  const myScore = playerId ? gameState.scores[playerId] : 0;

  if (gameState.status === 'FINISHED') {
     return <div className="text-center flex items-center justify-center h-full"><h1 className="text-5xl font-bold">Game Over! Check the main screen for scores.</h1></div>
  }
  
  if (gameState.status === 'REVEALING_ANSWERS') {
     const revealState = gameState as QuizClashRevealState;
     const myAnswer = (revealState.playerAnswers as any)[playerId!]?.answerIndex;
     const wasCorrect = myAnswer === revealState.correctAnswerIndex;

     return (
        <div className="text-center flex flex-col items-center justify-center h-full">
            {wasCorrect ? (
                <h1 className="text-5xl font-bold text-green-400">Correct!</h1>
            ): (
                <h1 className="text-5xl font-bold text-red-400">Incorrect</h1>
            )}
             <p className="mt-8 text-2xl">Your score: {myScore}</p>
        </div>
     )
  }

  if (answered !== null) {
      return (
        <div className="text-center flex flex-col items-center justify-center h-full">
            <Spinner />
            <h1 className="text-3xl font-bold mt-4">Answer locked in!</h1>
            <p className="text-xl">Waiting for other players...</p>
        </div>
      )
  }

  return (
    <div className="flex flex-col h-full">
        <div className="text-center mb-8">
            <p className="text-xl">Score: {myScore}</p>
            <h1 className="text-6xl font-bold">{gameState.timer}</h1>
        </div>
        <div className="grid grid-cols-2 gap-4 flex-grow">
        {colorClasses.map((color, index) => (
            <button
            key={index}
            onClick={() => handleAnswer(index)}
            className={`${color} rounded-lg shadow-lg transform transition-transform hover:scale-105`}
            ></button>
        ))}
        </div>
    </div>
  );
};
