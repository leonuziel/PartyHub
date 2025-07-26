import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReadyCheckDisplay } from '../ReadyCheckDisplay';

const mockPlayers = [
  { id: '1', nickname: 'PlayerOne', avatar: '/avatar1.png', isReady: true },
  { id: '2', nickname: 'PlayerTwo', avatar: '/avatar2.png', isReady: false },
];

describe('ReadyCheckDisplay', () => {
  const onPlayerReadyToggle = jest.fn();
  const onStartGame = jest.fn();

  beforeEach(() => {
    onPlayerReadyToggle.mockClear();
    onStartGame.mockClear();
  });

  it('renders player rows correctly', () => {
    render(
      <ReadyCheckDisplay
        players={mockPlayers}
        isHost={false}
        currentPlayerId="2"
        onPlayerReadyToggle={onPlayerReadyToggle}
        onStartGame={onStartGame}
      />
    );

    expect(screen.getByText('PlayerOne')).toBeInTheDocument();
    expect(screen.getByText('PlayerTwo')).toBeInTheDocument();
    expect(screen.getByText('Ready')).toBeInTheDocument();
    expect(screen.getByText('Not Ready')).toBeInTheDocument();
  });

  it('shows the "Ready Up" button for the current player', () => {
    render(
      <ReadyCheckDisplay
        players={mockPlayers}
        isHost={false}
        currentPlayerId="2"
        onPlayerReadyToggle={onPlayerReadyToggle}
        onStartGame={onStartGame}
      />
    );
    // Player 2 is not ready, so the button should say "Ready Up"
    const readyButton = screen.getByRole('button', { name: /ready up/i });
    expect(readyButton).toBeInTheDocument();

    fireEvent.click(readyButton);
    expect(onPlayerReadyToggle).toHaveBeenCalledWith('2');
  });

  it('shows the "Unready" button for the current player if they are ready', () => {
    render(
        <ReadyCheckDisplay
          players={mockPlayers}
          isHost={false}
          currentPlayerId="1" // Player 1 is ready
          onPlayerReadyToggle={onPlayerReadyToggle}
          onStartGame={onStartGame}
        />
      );
      const unreadyButton = screen.getByRole('button', { name: /unready/i });
      expect(unreadyButton).toBeInTheDocument();

      fireEvent.click(unreadyButton);
      expect(onPlayerReadyToggle).toHaveBeenCalledWith('1');
  });


  it('shows the "Start Game" button for the host', () => {
    render(
      <ReadyCheckDisplay
        players={mockPlayers}
        isHost={true}
        onPlayerReadyToggle={onPlayerReadyToggle}
        onStartGame={onStartGame}
      />
    );

    const startButton = screen.getByRole('button', { name: /start game/i });
    expect(startButton).toBeInTheDocument();
  });

  it('disables the "Start Game" button if not all players are ready', () => {
    render(
      <ReadyCheckDisplay
        players={mockPlayers} // One player is not ready
        isHost={true}
        onPlayerReadyToggle={onPlayerReadyToggle}
        onStartGame={onStartGame}
      />
    );

    const startButton = screen.getByRole('button', { name: /start game/i });
    expect(startButton).toBeDisabled();
  });

  it('enables the "Start Game" button when all players are ready', () => {
    const allReadyPlayers = mockPlayers.map(p => ({ ...p, isReady: true }));
    render(
      <ReadyCheckDisplay
        players={allReadyPlayers}
        isHost={true}
        onPlayerReadyToggle={onPlayerReadyToggle}
        onStartGame={onStartGame}
      />
    );

    const startButton = screen.getByRole('button', { name: /start game/i });
    expect(startButton).not.toBeDisabled();

    fireEvent.click(startButton);
    expect(onStartGame).toHaveBeenCalledTimes(1);
  });
});
