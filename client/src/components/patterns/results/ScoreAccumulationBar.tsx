import React, { useEffect, useState } from 'react';
import './ScoreAccumulationBar.css';

interface ScoreAccumulationBarProps {
  initialScore: number;
  scoreChange: number;
  label: string;
  startDelay?: number; // in ms
  onComplete?: () => void;
}

export const ScoreAccumulationBar: React.FC<ScoreAccumulationBarProps> = ({
  initialScore,
  scoreChange,
  label,
  startDelay = 0,
  onComplete,
}) => {
  const [displayScore, setDisplayScore] = useState(initialScore);
  const finalScore = initialScore + scoreChange;

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      let currentScore = initialScore;
      const increment = Math.ceil(scoreChange / 50); // Animate over ~50 frames

      if (scoreChange > 0) {
        const interval = setInterval(() => {
          currentScore += increment;
          if (currentScore >= finalScore) {
            currentScore = finalScore;
            clearInterval(interval);
            if (onComplete) onComplete();
          }
          setDisplayScore(currentScore);
        }, 20); // Update every 20ms

        return () => clearInterval(interval);
      } else if (scoreChange < 0) {
        // Handle score decrease if needed
         const decrement = Math.ceil(Math.abs(scoreChange) / 50);
         const interval = setInterval(() => {
            currentScore -= decrement;
            if (currentScore <= finalScore) {
                currentScore = finalScore;
                clearInterval(interval);
                if (onComplete) onComplete();
            }
            setDisplayScore(currentScore);
        }, 20);
        return () => clearInterval(interval);
      } else {
        if(onComplete) onComplete();
      }

    }, startDelay);

    return () => clearTimeout(delayTimer);
  }, [initialScore, scoreChange, finalScore, startDelay, onComplete]);

  return (
    <div className="score-accumulation-bar-container">
      <span className="bar-label">{label}</span>
      <div className="score-bar">
        <div className="score-text">{displayScore.toLocaleString()}</div>
        {scoreChange !== 0 && (
            <div className={`score-change ${scoreChange > 0 ? 'positive' : 'negative'}`}>
                {scoreChange > 0 ? '+' : ''}{scoreChange.toLocaleString()}
            </div>
        )}
      </div>
    </div>
  );
};
