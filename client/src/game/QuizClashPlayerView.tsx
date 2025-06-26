import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { useRoomStore } from '../store/roomStore';
import { usePlayerRole } from '../hooks/usePlayerRole';
import { socketService } from '../services/socketService';
import { QuizClashGameState, QuizClashRevealState } from '../types/types';
import { Spinner } from '../components/Spinner';
import './QuizClashPlayerView.css';

const colorClasses = ['btn-red', 'btn-blue', 'btn-yellow', 'btn-green'];

export const QuizClashPlayerView: React.FC = () => {
  const gameState = useGameStore((state) => state.gameState) as QuizClashGameState | QuizClashRevealState;
  const room = useRoomStore((state) => state.room);
  const { playerId } = usePlayerRole();
  const [answered, setAnswered] = useState<number | null>(null);

  React.useEffect(() => {
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
    return (
      <div className="player-center">
        <h1 className="game-finished-text">
          Game Over! Check the main screen for scores.
        </h1>
      </div>
    );
  }

  if (gameState.status === 'REVEALING_ANSWERS') {
    const revealState = gameState as QuizClashRevealState;
    const myAnswer = (revealState.playerAnswers as any)[playerId!]?.answerIndex;
    const wasCorrect = myAnswer === revealState.correctAnswerIndex;

    return (
      <div className="player-center">
        <h1 className={`reveal-title ${wasCorrect ? 'correct' : 'incorrect'}`}>
          {wasCorrect ? 'Correct!' : 'Incorrect'}
        </h1>
        <p className="reveal-score">Your score: {myScore}</p>
      </div>
    );
  }

  if (answered !== null) {
    return (
      <div className="player-center">
        <Spinner />
        <h1 className="locked-title">Answer locked in!</h1>
        <p className="locked-subtitle">Waiting for other players...</p>
      </div>
    );
  }

  return (
    <div className="player-view">
      <div className="player-header">
        <p className="player-score">Score: {myScore}</p>
        <h1 className="player-timer">{gameState.timer}</h1>
      </div>
      <div className="player-grid">
        {colorClasses.map((className, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            className={`player-button ${className}`}
          ></button>
        ))}
      </div>
    </div>
  );
};
