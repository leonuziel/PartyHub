import React from 'react';
import './EmojiReactionToolbar.css';

interface EmojiReactionToolbarProps {
  onReaction: (emoji: string) => void;
  allowedReactions?: string[];
}

const DEFAULT_REACTIONS = ['😂', '👍', '❤️', '🤯', '🤔'];

export const EmojiReactionToolbar: React.FC<EmojiReactionToolbarProps> = ({ onReaction, allowedReactions = DEFAULT_REACTIONS }) => {
  return (
    <div className="emoji-reaction-toolbar">
      {allowedReactions.map(emoji => (
        <button key={emoji} onClick={() => onReaction(emoji)} className="emoji-button">
          {emoji}
        </button>
      ))}
    </div>
  );
};
