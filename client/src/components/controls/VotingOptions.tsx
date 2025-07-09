import React from 'react';
import { Button } from './Button';
import './VotingOptions.css';

interface VotingOptionsProps {
  options: string[];
  onVote: (option: string) => void;
  disabled?: boolean;
}

export const VotingOptions: React.FC<VotingOptionsProps> = ({ options, onVote=()=>{}, disabled=false }) => {
  return (
    <div className="voting-options">
      {options.map((option, index) => (
        <Button
          key={index}
          onClick={() => onVote(option)}
          disabled={disabled}
          variant="secondary"
        >
          {option}
        </Button>
      ))}
    </div>
  );
};
