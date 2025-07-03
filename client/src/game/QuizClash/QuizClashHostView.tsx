import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { QuizClashGameState, QuizClashRevealState } from '../../types/types';
import './QuizClashHostView.css';

const answerDesigns = [
  { color: 'red', symbol: '▲' },
  { color: 'blue', symbol: '●' },
  { color: 'yellow', symbol: '■' },
  { color: 'green', symbol: '◆' },
];

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
        <div className="quiz-branding">QuizClash</div>
        <h1 className="quiz-title">Get Ready!</h1>
        <div className="quiz-countdown-container">
          <p className="quiz-countdown">{gameState.timer}</p>
        </div>
      </div>
    );
  }
  if (gameState.status === 'FINISHED') {
    const sortedScores = Object.entries(gameState.scores).sort(([, a], [, b]) => b - a);
    const topThree = sortedScores.slice(0, 3);

    return (
      <div className="quiz-finished">
        <div className="confetti"></div>
        <h1 className="quiz-title">Game Over!</h1>
        <div className="quiz-podium">
          {topThree.map(([playerId, score], index) => {
            const player = gameState.players.find(p => p.id === playerId);
            return (
              <div key={playerId} className={`podium-place place-${index + 1}`}>
                <h2 className="podium-rank">{getOrdinal(index + 1)}</h2>
                <img src={player?.avatar} alt={player?.nickname} className="podium-avatar" />
                <p className="podium-name">{player?.nickname}</p>
                <p className="podium-score">{score} pts</p>
              </div>
            );
          })}
        </div>
        <div className="quiz-full-leaderboard">
          <h3 className="quiz-subtitle">Final Scores</h3>
          {sortedScores.map(([playerId, score], index) => {
            const player = gameState.players.find(p => p.id === playerId);
            return (
              <div key={playerId} className="leaderboard-entry">
                <span>{index + 1}. {player?.nickname}</span>
                <span>{score}</span>
              </div>
            );
          })}
        </div>
        {/* The 'Play Again' button would trigger an action handled by the host, e.g., via socketService */}
        <button className="quiz-play-again-btn">Play Again</button>
      </div>
    );
  }

  if (gameState.status === 'REVEALING_ANSWERS') {
    const revealState = gameState as QuizClashRevealState;
    const answerCounts = revealState.answerCounts || {};
    const totalVotes = Object.values(answerCounts).reduce((sum, count) => sum + count, 0);

    if (!revealState.question) {
      return <div>Loading question...</div>;
    }

    return (
      <div className="quiz-reveal">
        <h1 className="quiz-question">{revealState.question.questionText}</h1>
        <div className="quiz-answers-grid reveal-grid">
          {revealState.question.answers.map((answer, index) => {
            const count = answerCounts[index] || 0;
            const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
            const isCorrect = index === revealState.correctAnswerIndex;
            return (
              <div key={index} className={`quiz-answer-result ${isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="answer-text">{answer}</div>
                <div className="answer-bar-container">
                  <div className="answer-bar" style={{ width: `${percentage}%` }}></div>
                  <span className="answer-percentage">{percentage.toFixed(0)}%</span>
                </div>
              </div>
            );
          })}
        </div>
        {/* Leaderboard would slide in and animate based on CSS */}
        <div className="quiz-leaderboard animated">
          <h3 className="leaderboard-title">Leaderboard</h3>
          {Object.entries(revealState.scores).sort(([, a], [, b]) => b - a).map(([playerId, score]) => {
            const player = revealState.players.find(p => p.id === playerId);
            // Here you could show rank change arrows, etc.
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
  }

  const answeredCount = gameState.players.filter(p => p.hasAnswered).length;
  const totalPlayers = gameState.players.length;

  if (!gameState.question) {
    return <div>Loading question...</div>;
  }

  return (
    <div className="quiz-main">
      <div className="quiz-header">
        <div className="quiz-question-counter">Question {gameState.round}/{gameState.totalRounds}</div>
        <div className="quiz-timer-container">
          <div className="quiz-timer-bar" style={{ width: `${(gameState.timer / 10) * 100}%` }}></div>
        </div>
        <div className="quiz-answer-counter">Answers: {answeredCount}/{totalPlayers}</div>
      </div>
      <h1 className="quiz-question-host">{gameState.question.questionText}</h1>
      <div className="quiz-grid-host">
        {gameState.question.answers.map((answer, index) => (
          <div key={index} className={`quiz-answer-option color-${answerDesigns[index].color}`}>
            <span className="answer-symbol">{answerDesigns[index].symbol}</span>
            <span className="answer-text">{answer}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
