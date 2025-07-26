import React from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import './TeamSelectionGrid.css';

interface Player {
  id: string;
  nickname: string;
  avatar: string;
}

interface Team {
  id: string;
  name: string;
  color: string;
  players: Player[];
}

interface TeamSelectionGridProps {
  teams: Team[];
  players: Player[]; // Unassigned players
  isHost: boolean;
  onJoinTeam: (teamId: string) => void;
  onMovePlayer: (playerId: string, newTeamId: string) => void;
}

const DraggablePlayer = ({ player, isHost }: { player: Player, isHost: boolean }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: player.id,
    disabled: !isHost,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="team-player-item">
      <img src={player.avatar} alt={player.nickname} />
      <span>{player.nickname}</span>
    </div>
  );
};

const TeamColumn = ({ team, isHost, onJoinTeam }: { team: Team, isHost: boolean, onJoinTeam: (teamId: string) => void; }) => {
  const { setNodeRef, isOver } = useDroppable({ id: team.id });

  return (
    <div ref={setNodeRef} className={`team-column ${isOver ? 'is-over' : ''}`}>
      <div className="team-header" style={{ backgroundColor: team.color }}>
        <h3>{team.name}</h3>
      </div>
      <div className="team-players">
        {team.players.map(player => (
          <DraggablePlayer key={player.id} player={player} isHost={isHost} />
        ))}
      </div>
      {!isHost && <button onClick={() => onJoinTeam(team.id)}>Join Team</button>}
    </div>
  );
};

export const TeamSelectionGrid: React.FC<TeamSelectionGridProps> = ({ teams, players, isHost, onJoinTeam, onMovePlayer }) => {

  const handleDragEnd = (event: any) => {
    const { over, active } = event;
    if (isHost && over && active) {
        onMovePlayer(active.id, over.id);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
        <div className="team-selection-grid">
            {teams.map(team => (
                <TeamColumn key={team.id} team={team} isHost={isHost} onJoinTeam={onJoinTeam} />
            ))}
            {isHost && (
                <div className="unassigned-players-column">
                     <div className="team-header">
                        <h3>Unassigned</h3>
                    </div>
                    <div className="team-players">
                        {players.map(player => (
                           <DraggablePlayer key={player.id} player={player} isHost={isHost} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    </DndContext>
  );
};
