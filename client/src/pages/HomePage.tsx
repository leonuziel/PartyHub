import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GameCard } from '../components/GameCard';
import { socketService } from '../services/socketService';
import { usePlayerStore } from '../store/playerStore';
import './HomePage.css';

const games = [
  {
    id: 'quizclash',
    title: 'QuizClash',
    description: 'The fast-paced trivia showdown!',
    playerCount: '2-8 Players',
    playtime: '~15-20 min',
    imageUrl: '/game-art/quizclash.png',
  },
  {
    id: 'fakenews',
    title: 'Fake News',
    description: 'The hilarious game of lies.',
    playerCount: '3-8 Players',
    playtime: '~10-15 min',
    imageUrl: '/game-art/fakenews.png',
  },
    {
    id: 'cardswar',
    title: 'War',
    description: 'The classic card game of chance.',
    playerCount: '2 Players',
    playtime: '~5-10 min',
    imageUrl: '/game-art/wargame.png',
  },
  {
    id: 'texas-holdem-poker',
    title: 'Texas Hold\'em',
    description: 'The classic poker game of skill and luck.',
    playerCount: '2-8 Players',
    playtime: '~30-60 min',
    imageUrl: '/game-art/texasholdem.png',
  },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const setPlayerNickname = usePlayerStore((state) => state.setNickname);

  const handleGameSelect = (gameId: string) => {
    const hostNickname = "Host";
    setPlayerNickname(hostNickname);
    localStorage.setItem('partyhub_nickname', hostNickname);
    
    socketService.createRoom(hostNickname, gameId, (newRoom) => {
        // No need to set room here, the 'room:update' event will do it
        navigate(`/lobby/${newRoom.roomCode}`);
    });
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-title">PartyHub</h1>
        <p className="home-subtitle">Let's Get the Party Started!</p>
      </header>
      <div className="game-grid">
        {games.map((game) => (
          <GameCard
            key={game.id}
            title={game.title}
            description={game.description}
            playerCount={game.playerCount}
            playtime={game.playtime}
            imageUrl={game.imageUrl}
            onClick={() => handleGameSelect(game.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
