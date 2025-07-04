import React, { useState, useMemo, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useRoomStore } from '../../store/roomStore';
import { usePlayerRole } from '../../hooks/usePlayerRole';
import { socketService } from '../../services/socketService';
import { QuizClashGameState, QuizClashRevealState } from '../../types/types';
import { Spinner } from '../../components/Spinner';
import { PlayerStatusContainer } from '../../components/PlayerStatusContainer';
import { PlayerStartingView } from './views/PlayerStartingView';
import { PlayerFinishedView } from './views/PlayerFinishedView';
import { PlayerAnsweringView } from './views/PlayerAnsweringView';
import { PlayerRevealingAnswerView } from './views/PlayerRevealingAnswerView';
import './QuizClashPlayerView.css';


export const QuizClashPlayerView: React.FC = () => {
  const gameState = useGameStore((state) => state.gameState) as QuizClashGameState | QuizClashRevealState;
  const room = useRoomStore((state) => state.room);
  const { player, playerId } = usePlayerRole();
  const [answered, setAnswered] = useState<number | null>(null);
  const [lastRank, setLastRank] = useState<number | null>(null);

  const playersWithScores = useMemo(() => {
    return gameState.players.map(p => ({
        ...p,
        score: gameState.scores[p.id] || 0
    })).sort((a, b) => b.score - a.score);
  }, [gameState.players, gameState.scores]);

  const myRank = useMemo(() => {
    const rank = playersWithScores.findIndex(p => p.id === playerId);
    return rank !== -1 ? rank + 1 : null;
  }, [playersWithScores, playerId]);

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

  const myScore = player ? player.score : 0;

  if (gameState.status === 'STARTING') {
    return <PlayerStartingView player={player} />;
  }

  if (gameState.status === 'FINISHED') {
    return (
      <PlayerFinishedView
        rank={myRank}
        playerCount={gameState.players.length}
        score={myScore}
        topPlayers={playersWithScores}
        onPlayAgain={() => { /* signal host */ }}
        onBackToLobby={() => { /* navigate to lobby */ }}
      />
    );
  }

  if (gameState.status === 'REVEALING_ANSWERS') {
    const revealState = gameState as QuizClashRevealState;
    const myAnswerRecord = (revealState.playerAnswers as any)[playerId!];
    const wasCorrect = myAnswerRecord?.answerIndex === revealState.correctAnswerIndex;
    const pointsGained = myAnswerRecord?.scoreGained || 0;

    return (
      <PlayerRevealingAnswerView
        wasCorrect={wasCorrect}
        pointsGained={pointsGained}
        lastRank={lastRank}
        newRank={myRank}
      />
    );
  }

  if (answered !== null) {
    return <PlayerStatusContainer title="Answer locked in!" subtitle="Waiting for others..." />;
  }

  if (!gameState.question) {
    return <Spinner />;
  }
  
  if (gameState.status === 'ASKING_QUESTION') {
    return (
        <PlayerAnsweringView
          answers={gameState.question.answers.map(() => '')}
          onAnswer={handleAnswer}
          disabled={answered !== null}
          selectedAnswer={answered}
        />
    );
  }
  return <Spinner />
};
