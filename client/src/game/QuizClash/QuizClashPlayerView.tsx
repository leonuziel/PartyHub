import React, { useState, useMemo, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useRoomStore } from '../../store/roomStore';
import { usePlayerRole } from '../../hooks/usePlayerRole';
import { socketService } from '../../services/socketService';
import { QuizClashGameState, QuizClashRevealState } from '../../types/types';
import { Spinner } from '../../components/Spinner';
import './QuizClashPlayerView.css';

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

export const QuizClashPlayerView: React.FC = () => {
  const gameState = useGameStore((state) => state.gameState) as QuizClashGameState | QuizClashRevealState;
  const room = useRoomStore((state) => state.room);
  const { player, playerId } = usePlayerRole();
  const [answered, setAnswered] = useState<number | null>(null);
  const [lastRank, setLastRank] = useState<number | null>(null);

  const sortedScores = useMemo(() => {
    return Object.entries(gameState.scores).sort(([, a], [, b]) => b - a);
  }, [gameState.scores]);

  const myRank = useMemo(() => {
    const rank = sortedScores.findIndex(([pId]) => pId === playerId);
    return rank !== -1 ? rank + 1 : null;
  }, [sortedScores, playerId]);

  useEffect(() => {
    if (gameState.status === 'ASKING_QUESTION') {
      setAnswered(null);
      setLastRank(myRank);
    }
  }, [gameState.status, gameState.round, myRank]);

  const handleAnswer = (answerIndex: number) => {
    if (!room || answered !== null) return;
    setAnswered(answerIndex);
    socketService.sendPlayerAction(room.roomCode, { answerIndex });
  };

  const myScore = playerId ? gameState.scores[playerId] : 0;

  if (gameState.status === 'STARTING') {
    return (
      <div className="player-status-container">
        <img src={player?.avatar} alt="Your avatar" className="player-avatar-small" />
        <h1 className="player-status-title">You're in, {player?.nickname}!</h1>
        <p className="player-status-subtitle">Look at the main screen!</p>
      </div>
    );
  }

  if (gameState.status === 'FINISHED') {
    const topThree = sortedScores.slice(0, 3).map(([pId, score]) => {
      const p = gameState.players.find(player => player.id === pId);
      return { ...p, score };
    });

    return (
      <div className="player-finished-container">
        <h1 className="player-final-rank">You finished {myRank ? getOrdinal(myRank) : 'N/A'} out of {gameState.players.length}!</h1>
        <p className="player-final-score">Final Score: {myScore}</p>
        <div className="player-top-winners">
          <h2 className="top-winners-title">Podium</h2>
          {topThree.map((p, index) => (
            <div key={p.id} className="winner-entry">
              <img src={p.avatar} alt={p.nickname} className="winner-avatar" />
              <span>{getOrdinal(index + 1)}: {p.nickname} ({p.score} pts)</span>
            </div>
          ))}
        </div>
        <div className="player-action-buttons">
          <button onClick={() => { /* signal host */ }}>Play Again</button>
          <button onClick={() => { /* navigate to lobby */ }}>Back to Lobby</button>
        </div>
      </div>
    );
  }

  if (gameState.status === 'REVEALING_ANSWERS') {
    const revealState = gameState as QuizClashRevealState;
    console.log("Player ID:", playerId);
    console.log("Player Answers:", revealState.playerAnswers);
    const myAnswerRecord = (revealState.playerAnswers as any)[playerId!];
    console.log("My Answer Record:", myAnswerRecord);
    const wasCorrect = myAnswerRecord?.answerIndex === revealState.correctAnswerIndex;
    const pointsGained = myAnswerRecord?.scoreGained || 0;
    const rankChange = lastRank ? lastRank - (myRank || 0) : 0;

    return (
      <div className={`player-reveal-container ${wasCorrect ? 'bg-correct' : 'bg-incorrect'}`}>
        <h1 className="reveal-verdict">{wasCorrect ? 'Correct!' : 'Incorrect!'}</h1>
        {wasCorrect && <p className="reveal-points-gained">+{pointsGained} Points</p>}
        <div className="player-rank-update">
          <p>Your new rank is {myRank ? getOrdinal(myRank) : 'N/A'}</p>
          {rankChange > 0 && <p className="rank-change up">You moved up {rankChange} spots!</p>}
          {rankChange < 0 && <p className="rank-change down">You moved down {Math.abs(rankChange)} spots.</p>}
        </div>
      </div>
    );
  }

  if (answered !== null) {
    return (
      <div className="player-status-container waiting">
        <Spinner />
        <h1 className="player-status-title">Answer locked in!</h1>
        <p className="player-status-subtitle">Waiting for others...</p>
      </div>
    );
  }

  return (
    <div className="player-answer-view">
      <div className="player-answer-grid">
        {answerDesigns.map((design, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            disabled={answered !== null}
            className={`player-answer-btn btn-${design.color} ${answered === index ? 'selected' : ''}`}
          >
            <span className="player-answer-symbol">{design.symbol}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
