import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameCard } from '../components/old/controls/GameCard';
import { socketService } from '../services/socketService';
import { usePlayerStore } from '../store/playerStore';
import './PageLayouts.css';
import './HomePage.css';

interface GameInfo {
    id: string;
    title: string;
    description: string;
    playerCount: string;
    playtime: string;
    imageUrl: string;
}

const hardcodedGames: GameInfo[] = [
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
    const [games, setGames] = useState<GameInfo[]>(hardcodedGames);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/game-configs`);
                const dynamicGames = await response.json();

                const formattedDynamicGames = dynamicGames.map((game: any) => ({
                    id: game.gameId,
                    title: game.title,
                    description: game.description,
                    playerCount: `${game.minPlayers}-${game.maxPlayers} Players`,
                    playtime: '~10-20 min', // Placeholder
                    imageUrl: game.artworkUrl || '/game-art/quizclash.png', // Default image
                }));

                // Filter out any hardcoded games that are now loaded dynamically
                const dynamicGameIds = new Set(formattedDynamicGames.map((g: GameInfo) => g.id));
                const filteredHardcodedGames = hardcodedGames.filter(g => !dynamicGameIds.has(g.id));

                setGames([...filteredHardcodedGames, ...formattedDynamicGames]);

            } catch (error) {
                console.error("Failed to fetch dynamic games:", error);
                // Fallback to only hardcoded games
                setGames(hardcodedGames);
            }
        };

        fetchGames();
    }, []);

    const handleGameSelect = (gameId: string) => {
        const hostNickname = "Host";
        setPlayerNickname(hostNickname);
        localStorage.setItem('partyhub_nickname', hostNickname);

        socketService.createRoom(hostNickname, gameId, (newRoom) => {
            navigate(`/lobby/${newRoom.roomCode}`);
        });
    };

    return (
        <div className="page-container home-container">
            <header className="home-header">
                <h1 className="page-title">PartyHub</h1>
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
