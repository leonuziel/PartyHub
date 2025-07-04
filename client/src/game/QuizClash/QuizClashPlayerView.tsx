import React, { useState, useMemo, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useRoomStore } from '../../store/roomStore';
import { usePlayerRole } from '../../hooks/usePlayerRole';
import { socketService } from '../../services/socketService';
import { QuizClashGameState, QuizClashRevealState } from '../../types/types';
import { Spinner } from '../../components/Spinner';
import { PlayerStatusContainer } from '../../components/PlayerStatusContainer';
import { AnswerGrid } from '../../components/AnswerGrid';
import { RankUpdate } from '../../components/RankUpdate';
import { PodiumList } from '../../components/PodiumList';
import { Button } from '../../components/Button';
import { RankDisplay } from '../../components/RankDisplay';
import { PlayerViewContainer } from '../../components/PlayerViewContainer';
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
    return <PlayerStatusContainer title={`You're in, ${player?.nickname}!`} subtitle="Look at the main screen!" />;
  }

  if (gameState.status === 'FINISHED') {
    return (
      <div className="player-finished-container">
        {myRank && <RankDisplay rank={myRank} />}
        <p className="player-final-score">Final Score: {myScore}</p>
        <PodiumList players={playersWithScores} />
        <div className="player-action-buttons">
          <Button onClick={() => { /* signal host */ }}>Play Again</Button>
          <Button onClick={() => { /* navigate to lobby */ }} variant="secondary">Back to Lobby</Button>
        </div>
      </div>
    );
  }

  if (gameState.status === 'REVEALING_ANSWERS') {
    const revealState = gameState as QuizClashRevealState;
    const myAnswerRecord = (revealState.playerAnswers as any)[playerId!];
    const wasCorrect = myAnswerRecord?.answerIndex === revealState.correctAnswerIndex;
    const pointsGained = myAnswerRecord?.scoreGained || 0;

    return (
      <div className={`player-reveal-container ${wasCorrect ? 'bg-correct' : 'bg-incorrect'}`}>
        <PlayerStatusContainer title={wasCorrect ? 'Correct!' : 'Incorrect!'} subtitle={wasCorrect ? `+${pointsGained} Points` : ''} />
        {lastRank && myRank && <RankUpdate oldRank={lastRank} newRank={myRank} />}
      </div>
    );
  }

  if (answered !== null) {
    return <PlayerStatusContainer title="Answer locked in!" subtitle="Waiting for others..." />;
  }

  if (!gameState.question) {
    return <Spinner />;
  }

  return (
    <PlayerViewContainer>
      <AnswerGrid answers={gameState.question.answers.map(() => '')} onAnswer={handleAnswer} disabled={answered !== null} selectedAnswer={answered}/>
    </PlayerViewContainer>
  );
};
