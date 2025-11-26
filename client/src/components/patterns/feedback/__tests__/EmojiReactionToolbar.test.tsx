import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../utils/renderWithProviders';
import { EmojiReactionToolbar } from '../EmojiReactionToolbar';

describe('EmojiReactionToolbar', () => {
  const onReaction = jest.fn();

  it('renders the default set of emoji reactions', () => {
    renderWithProviders(<EmojiReactionToolbar onReaction={onReaction} />);

    expect(screen.getByText('😂')).toBeInTheDocument();
    expect(screen.getByText('👍')).toBeInTheDocument();
  });

  it('renders a custom set of emoji reactions', () => {
    const customEmojis = ['🔥', '🎉'];
    renderWithProviders(<EmojiReactionToolbar onReaction={onReaction} allowedReactions={customEmojis} />);

    expect(screen.getByText('🔥')).toBeInTheDocument();
    expect(screen.queryByText('😂')).not.toBeInTheDocument();
  });

  it('calls the onReaction callback with the correct emoji when clicked', async () => {
    renderWithProviders(<EmojiReactionToolbar onReaction={onReaction} />);

    const laughEmoji = screen.getByText('😂');
    await userEvent.click(laughEmoji);

    expect(onReaction).toHaveBeenCalledWith('😂');
  });
});
