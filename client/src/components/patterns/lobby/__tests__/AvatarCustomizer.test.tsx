import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AvatarCustomizer } from '../AvatarCustomizer';

describe('AvatarCustomizer', () => {
  const avatars = ['/avatar1.png', '/avatar2.png'];
  const onSubmit = jest.fn();

  beforeEach(() => {
    onSubmit.mockClear();
  });

  it('renders correctly', () => {
    render(<AvatarCustomizer avatars={avatars} onSubmit={onSubmit} />);
    expect(screen.getByText('Choose Your Look')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your nickname')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /join game/i })).toBeInTheDocument();
  });

  it('defaults to the first avatar', () => {
    render(<AvatarCustomizer avatars={avatars} onSubmit={onSubmit} />);
    const avatarImages = screen.getAllByRole('img');
    expect(avatarImages[0]).toHaveClass('selected');
  });

  it('allows changing the selected avatar', () => {
    render(<AvatarCustomizer avatars={avatars} onSubmit={onSubmit} />);
    const avatarImages = screen.getAllByRole('img');
    fireEvent.click(avatarImages[1]);
    expect(avatarImages[0]).not.toHaveClass('selected');
    expect(avatarImages[1]).toHaveClass('selected');
  });

  it('enables the submit button only when a nickname is entered', () => {
    render(<AvatarCustomizer avatars={avatars} onSubmit={onSubmit} />);
    const submitButton = screen.getByRole('button', { name: /join game/i });
    const nicknameInput = screen.getByPlaceholderText('Enter your nickname');

    expect(submitButton).toBeDisabled();

    fireEvent.change(nicknameInput, { target: { value: 'TestPlayer' } });
    expect(submitButton).not.toBeDisabled();

    fireEvent.change(nicknameInput, { target: { value: '  ' } }); // Whitespace only
    expect(submitButton).toBeDisabled();
  });

  it('calls onSubmit with the correct details when the form is submitted', () => {
    render(<AvatarCustomizer avatars={avatars} onSubmit={onSubmit} />);
    const nicknameInput = screen.getByPlaceholderText('Enter your nickname');
    const avatarImages = screen.getAllByRole('img');
    const submitButton = screen.getByRole('button', { name: /join game/i });

    fireEvent.change(nicknameInput, { target: { value: 'TestPlayer' } });
    fireEvent.click(avatarImages[1]);
    fireEvent.click(submitButton);

    expect(onSubmit).toHaveBeenCalledWith({
      nickname: 'TestPlayer',
      avatar: '/avatar2.png',
    });
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
