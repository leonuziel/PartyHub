import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { QuizClashGameState, QuizClashRevealState } from '../../types/types';
import './QuizClashHostView.css';

const colorClasses = ['color-red', 'color-blue', 'color-yellow', 'color-green'];

const getOrdinal = (n: number) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const QuizClashHostView: React.FC = () => {
  const gameState = useGameStore((state) => state.gameState) as QuizClashGameState | QuizClashRevealState;

  if (gameState.status === 'STARTING') {
    return (
      <div className="quiz-starting">
        <h1 className="quiz-title">Get Ready!</h1>
        <p className="quiz-countdown">{gameState.timer}</p>
      </div>
    );
  }
  if (gameState.status === 'FINISHED') {
    const sortedScores = Object.entries(gameState.scores).sort(([, a], [, b]) => b - a);
    const topThree = sortedScores.slice(0, 3);

    return (
      <div className="quiz-finished">
        <h1 className="quiz-title">Game Over!</h1>
        <div className="quiz-podium">
          {topThree.map(([playerId, score], index) => {
            const player = gameState.players.find(p => p.id === playerId);
            return (
              <div key={playerId} className={`podium-place place-${index + 1}`}>
                <h2 className="podium-rank">{getOrdinal(index + 1)}</h2>
                <p className="podium-name">{player?.nickname}</p>
                <p className="podium-score">{score} pts</p>
              </div>
            );
          })}
        </div>
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
    const totalVotes = revealState.answerCounts
      ? Object.values(revealState.answerCounts).reduce((sum, count) => sum + count, 0)
      : 0;

    return (
      <div className="quiz-reveal">
        <h1 className="quiz-question">{revealState.question?.questionText}</h1>
        <div className="quiz-answers-grid">
          {revealState.question?.answers.map((answer, index) => {
            const count = revealState.answerCounts?.[index] || 0;
            const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
            return (
              <div
                key={index}
                className={`quiz-answer-result ${index === revealState.correctAnswerIndex ? 'correct' : 'incorrect'}`}
              >
                <div className={`answer-text ${index === revealState.correctAnswerIndex ? 'correct-text' : 'incorrect-text'}`}>{answer}</div>
                <div className="answer-bar" style={{ width: `${percentage}%` }}></div>
                <div className={`answer-percentage ${index === revealState.correctAnswerIndex ? 'correct-text' : 'incorrect-text'}`}>{percentage.toFixed(0)}%</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const sortedScores = Object.entries(gameState.scores).sort(([, a], [, b]) => b - a);

  return (
    <div className="quiz-main">
      <div className="quiz-header">
        <p className="quiz-info">Question {gameState.round}/{gameState.totalRounds}</p>
        <div className="quiz-timer">{gameState.timer}</div>
      </div>
      <h1 className="quiz-question-host">{gameState.question?.questionText}</h1>
      <div className="quiz-grid-host">
        {gameState.question?.answers.map((answer, index) => (
          <div key={index} className={`quiz-answer-option ${colorClasses[index]}`}>
            {answer}
          </div>
        ))}
      </div>
      <div className="quiz-leaderboard">
        <h3 className="leaderboard-title">Top 5</h3>
        {sortedScores.slice(0, 5).map(([playerId, score]) => {
          const player = gameState.players.find(p => p.id === playerId);
          return (
            <div key={playerId} className="leaderboard-entry">
              <span>{player?.nickname}</span>
              <span>{score}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
