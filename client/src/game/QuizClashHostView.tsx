import React from 'react';
import { useGameStore } from '../store/gameStore';
import { QuizClashGameState, QuizClashRevealState } from '../types/types';
import './QuizClashHostView.css';

const colorClasses = ['color-red', 'color-blue', 'color-yellow', 'color-green'];

export const QuizClashHostView: React.FC = () => {
  const gameState = useGameStore((state) => state.gameState) as QuizClashGameState | QuizClashRevealState;

  if (gameState.status === 'FINISHED') {
    const sortedScores = Object.entries(gameState.scores).sort(([, a], [, b]) => b - a);
    const winner = gameState.players.find(p => p.id === sortedScores[0][0]);
    return (
      <div className="quiz-finished">
        <h1 className="quiz-title">Game Over!</h1>
        <h2 className="quiz-winner">Winner: {winner?.nickname}</h2>
        <div className="quiz-score-box">
          <h3 className="quiz-subtitle">Final Scores:</h3>
          {sortedScores.map(([playerId, score], index) => {
            const player = gameState.players.find(p => p.id === playerId);
            return <p key={playerId} className="quiz-score-line">{index + 1}. {player?.nickname}: {score}</p>
          })}
        </div>
      </div>
    );
  }

  if (gameState.status === 'REVEALING_ANSWERS') {
    const revealState = gameState as QuizClashRevealState;
    return (
      <div className="quiz-reveal">
        <h1 className="quiz-question">{revealState.question?.questionText}</h1>
        <div className="quiz-grid">
          {revealState.question?.answers.map((answer, index) => (
            <div
              key={index}
              className={`quiz-answer ${index === revealState.correctAnswerIndex ? 'correct' : 'dimmed'}`}>
              {answer}
            </div>
          ))}
        </div>
        <p className="quiz-correct-answer">
          The correct answer was: {revealState.question?.answers[revealState.correctAnswerIndex]}
        </p>
      </div>
    );
  }

  return (
    <div className="quiz-main">
      <div className="quiz-header">
        <p className="quiz-info">Round: {gameState.round}</p>
        <p className="quiz-timer">{gameState.timer}</p>
        <p className="quiz-info">Score: {gameState.scores[Object.keys(gameState.scores)[0]]}</p>
      </div>
      <h1 className="quiz-question quiz-centered">{gameState.question?.questionText}</h1>
      <div className="quiz-grid">
        {gameState.question?.answers.map((answer, index) => (
          <div key={index} className={`quiz-answer ${colorClasses[index]}`}>
            {answer}
          </div>
        ))}
      </div>
    </div>
  );
};
