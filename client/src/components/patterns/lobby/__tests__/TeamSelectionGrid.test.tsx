import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TeamSelectionGrid } from '../TeamSelectionGrid';

// Mock dnd-kit components
jest.mock('@dnd-kit/core', () => ({
    DndContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    useDraggable: ({ id, disabled }: { id: string, disabled: boolean }) => ({
      attributes: {},
      listeners: {},
      setNodeRef: jest.fn(),
      transform: null,
    }),
    useDroppable: ({ id }: { id: string }) => ({
      setNodeRef: jest.fn(),
      isOver: false,
    }),
}));

const mockTeams = [
  { id: 't1', name: 'Team Red', color: '#e63946', players: [{ id: 'p1', nickname: 'PlayerOne', avatar: '/avatar1.png' }] },
  { id: 't2', name: 'Team Blue', color: '#2f80ed', players: [] },
];

const mockUnassignedPlayers = [
    { id: 'p2', nickname: 'PlayerTwo', avatar: '/avatar2.png' },
];

describe('TeamSelectionGrid', () => {
  const onJoinTeam = jest.fn();
  const onMovePlayer = jest.fn();

  beforeEach(() => {
    onJoinTeam.mockClear();
    onMovePlayer.mockClear();
  });

  it('renders team columns and players', () => {
    render(
      <TeamSelectionGrid
        teams={mockTeams}
        players={mockUnassignedPlayers}
        isHost={false}
        onJoinTeam={onJoinTeam}
        onMovePlayer={onMovePlayer}
      />
    );

    expect(screen.getByText('Team Red')).toBeInTheDocument();
    expect(screen.getByText('Team Blue')).toBeInTheDocument();
    expect(screen.getByText('PlayerOne')).toBeInTheDocument();
  });

  it('shows "Join Team" buttons for players', () => {
    render(
      <TeamSelectionGrid
        teams={mockTeams}
        players={mockUnassignedPlayers}
        isHost={false}
        onJoinTeam={onJoinTeam}
        onMovePlayer={onMovePlayer}
      />
    );
    
    const joinButtons = screen.getAllByRole('button', { name: /join team/i });
    expect(joinButtons.length).toBe(2);

    fireEvent.click(joinButtons[1]); // Click to join Team Blue
    expect(onJoinTeam).toHaveBeenCalledWith('t2');
  });

  it('shows the unassigned players column for the host', () => {
    render(
        <TeamSelectionGrid
          teams={mockTeams}
          players={mockUnassignedPlayers}
          isHost={true}
          onJoinTeam={onJoinTeam}
          onMovePlayer={onMovePlayer}
        />
      );

      expect(screen.getByText('Unassigned')).toBeInTheDocument();
      expect(screen.getByText('PlayerTwo')).toBeInTheDocument();
  });

  it('does not show "Join Team" buttons for the host', () => {
    render(
        <TeamSelectionGrid
          teams={mockTeams}
          players={mockUnassignedPlayers}
          isHost={true}
          onJoinTeam={onJoinTeam}
          onMovePlayer={onMovePlayer}
        />
      );
      
      const joinButtons = screen.queryAllByRole('button', { name: /join team/i });
      expect(joinButtons.length).toBe(0);
  });
});
