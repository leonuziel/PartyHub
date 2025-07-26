import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EmojiReactionToolbar } from '../EmojiReactionToolbar';

describe('EmojiReactionToolbar', () => {
  const onReaction = jest.fn();

  it('renders the default set of emoji reactions', () => {
    render(<EmojiReactionToolbar onReaction={onReaction} />);
    
    expect(screen.getByText('😂')).toBeInTheDocument();
    expect(screen.getByText('👍')).toBeInTheDocument();
  });

  it('renders a custom set of emoji reactions', () => {
    const customEmojis = ['🔥', '🎉'];
    render(<EmojiReactionToolbar onReaction={onReaction} allowedReactions={customEmojis} />);
    
    expect(screen.getByText('🔥')).toBeInTheDocument();
    expect(screen.queryByText('😂')).not.toBeInTheDocument();
  });

  it('calls the onReaction callback with the correct emoji when clicked', () => {
    render(<EmojiReactionToolbar onReaction={onReaction} />);
    
    const laughEmoji = screen.getByText('😂');
    fireEvent.click(laughEmoji);
    
    expect(onReaction).toHaveBeenCalledWith('😂');
  });
});
