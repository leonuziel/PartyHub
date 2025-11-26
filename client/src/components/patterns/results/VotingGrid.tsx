import React, { useState } from 'react';
import './VotingGrid.css';

interface VoteOption {
  id: string;
  content: string;
  type: 'text' | 'image';
}

interface VotingGridProps {
  options: VoteOption[];
  onVote: (optionId: string) => void;
  disabled?: boolean;
}

export const VotingGrid: React.FC<VotingGridProps> = ({ options, onVote, disabled = false }) => {
  const [votedFor, setVotedFor] = useState<string | null>(null);

  const handleVote = (optionId: string) => {
    if (disabled || votedFor) return;
    setVotedFor(optionId);
    onVote(optionId);
  };

  return (
    <div className="voting-grid">
      {options.map(option => (
        <div
          key={option.id}
          className={`vote-option-card ${votedFor ? 'voted' : ''} ${votedFor === option.id ? 'selected-vote' : ''}`}
          onClick={() => handleVote(option.id)}
        >
          <div className="card-content">
            {option.type === 'image' ? (
              <img src={option.content} alt={`Vote option ${option.id}`} />
            ) : (
              <p>{option.content}</p>
            )}
          </div>
          {votedFor === option.id && <div className="voted-indicator">Voted</div>}
        </div>
      ))}
    </div>
  );
};
