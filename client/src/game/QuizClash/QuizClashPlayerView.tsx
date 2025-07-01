import React, { useState, useMemo } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useRoomStore } from '../../store/roomStore';
import { usePlayerRole } from '../../hooks/usePlayerRole';
import { socketService } from '../../services/socketService';
import { QuizClashGameState, QuizClashRevealState, Player } from '../../types/types';
import { Spinner } from '../../components/Spinner';
import './QuizClashPlayerView.css';

const colorClasses = ['btn-red', 'btn-blue', 'btn-yellow', 'btn-green'];
const getOrdinal = (n: number) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const QuizClashPlayerView: React.FC = () => {
  const gameState = useGameStore((state) => state.gameState) as QuizClashGameState | QuizClashRevealState;
  const room = useRoomStore((state) => state.room);
  const { player, playerId } = usePlayerRole();
  const [answered, setAnswered] = useState<number | null>(null);

  const sortedScores = useMemo(() => {
    return Object.entries(gameState.scores).sort(([, a], [, b]) => b - a);
  }, [gameState.scores]);

  const myRank = useMemo(() => {
    const rank = sortedScores.findIndex(([pId]) => pId === playerId);
    return rank !== -1 ? rank + 1 : null;
  }, [sortedScores, playerId]);

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

  if (gameState.status === 'STARTING') {
    return (
      <div className="player-status-container">
        <h1 className="player-status-title">Get Ready!</h1>
        <p className="player-name">{player?.nickname}</p>
      </div>
    );
  }

  if (gameState.status === 'FINISHED') {
    const topThree = sortedScores.slice(0, 3).map(([pId, score]) => {
      const player = gameState.players.find(p => p.id === pId);
      return { ...player, score };
    });

    return (
      <div className="player-finished-container">
        <h1 className="player-final-rank">You finished {myRank ? getOrdinal(myRank) : 'N/A'}!</h1>
        <p className="player-final-score">Final Score: {myScore}</p>
        <div className="player-top-winners">
          <h2 className="top-winners-title">Top 3</h2>
          {topThree.map((p, index) => (
            <div key={p.id} className="winner-entry">
              <span>{getOrdinal(index + 1)}: {p.nickname}</span>
              <span>{p.score} pts</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (gameState.status === 'REVEALING_ANSWERS') {
    const revealState = gameState as QuizClashRevealState;
    const myAnswer = (revealState.playerAnswers as any)[playerId!]?.answerIndex;
    const wasCorrect = myAnswer === revealState.correctAnswerIndex;
    const pointsGained = (revealState.playerAnswers as any)[playerId!]?.scoreGained || 0;

    return (
      <div className="player-reveal-container">
        <h1 className={`reveal-verdict ${wasCorrect ? 'correct' : 'incorrect'}`}>
          {wasCorrect ? 'Correct!' : 'Incorrect'}
        </h1>
        {wasCorrect && <p className="reveal-points-gained">+{pointsGained} points</p>}
        <div className="player-current-stats">
          <p>Total Score: {myScore}</p>
          <p>Rank: {myRank ? getOrdinal(myRank) : 'N/A'}</p>
        </div>
      </div>
    );
  }

  if (answered !== null) {
    return (
      <div className="player-status-container">
        <Spinner />
        <h1 className="player-status-title">Answer locked in!</h1>
        <p className="player-status-subtitle">Waiting for other players...</p>
      </div>
    );
  }

  return (
    <div className="player-answer-view">
      <div className="player-game-header">
        <div className="player-stat">Score: {myScore}</div>
        <div className="player-stat">Rank: {myRank ? getOrdinal(myRank) : 'N/A'}</div>
      </div>
      <div className="player-answer-grid">
        {colorClasses.map((className, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            disabled={answered !== null}
            className={`player-answer-btn ${className}`}
          ></button>
        ))}
      </div>
    </div>
  );
};
