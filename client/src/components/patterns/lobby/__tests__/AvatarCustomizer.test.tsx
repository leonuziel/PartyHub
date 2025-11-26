import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../utils/renderWithProviders';
import { AvatarCustomizer } from '../AvatarCustomizer';

describe('AvatarCustomizer', () => {
  const avatars = ['/avatar1.png', '/avatar2.png'];
  const onSubmit = jest.fn();

  beforeEach(() => {
    onSubmit.mockClear();
  });

  it('renders correctly', () => {
    renderWithProviders(<AvatarCustomizer avatars={avatars} onSubmit={onSubmit} />);
    expect(screen.getByText('Choose Your Look')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your nickname')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /join game/i })).toBeInTheDocument();
  });

  it('defaults to the first avatar', () => {
    renderWithProviders(<AvatarCustomizer avatars={avatars} onSubmit={onSubmit} />);
    const avatarImages = screen.getAllByRole('img');
    expect(avatarImages[0]).toHaveClass('selected');
  });

  it('allows changing the selected avatar', async () => {
    renderWithProviders(<AvatarCustomizer avatars={avatars} onSubmit={onSubmit} />);
    const avatarImages = screen.getAllByRole('img');
    await userEvent.click(avatarImages[1]);
    expect(avatarImages[0]).not.toHaveClass('selected');
    expect(avatarImages[1]).toHaveClass('selected');
  });

  it('enables the submit button only when a nickname is entered', async () => {
    renderWithProviders(<AvatarCustomizer avatars={avatars} onSubmit={onSubmit} />);
    const submitButton = screen.getByRole('button', { name: /join game/i });
    const nicknameInput = screen.getByPlaceholderText('Enter your nickname');

    expect(submitButton).toBeDisabled();

    await userEvent.type(nicknameInput, 'TestPlayer');
    expect(submitButton).not.toBeDisabled();

    await userEvent.clear(nicknameInput);
    await userEvent.type(nicknameInput, '  '); // Whitespace only
    expect(submitButton).toBeDisabled();
  });

  it('calls onSubmit with the correct details when the form is submitted', async () => {
    renderWithProviders(<AvatarCustomizer avatars={avatars} onSubmit={onSubmit} />);
    const nicknameInput = screen.getByPlaceholderText('Enter your nickname');
    const avatarImages = screen.getAllByRole('img');
    const submitButton = screen.getByRole('button', { name: /join game/i });

    await userEvent.type(nicknameInput, 'TestPlayer');
    await userEvent.click(avatarImages[1]);
    await userEvent.click(submitButton);

    expect(onSubmit).toHaveBeenCalledWith({
      nickname: 'TestPlayer',
      avatar: '/avatar2.png',
    });
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
