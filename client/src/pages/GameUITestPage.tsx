import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/old/controls/Button';
import { Player, RoomData, RoomState } from '../types/types';
import { DynamicViewRenderer } from '../game/DynamicViewRenderer';
import { useGameStore } from '../store/gameStore';
import { usePlayerStore } from '../store/playerStore';
import { useRoomStore } from '../store/roomStore';

// QuizClash Views
import { HostStartingView as QuizClashHostStartingView } from '../game/QuizClash/views/HostStartingView';
import { HostAskingQuestionView as QuizClashHostAskingQuestionView } from '../game/QuizClash/views/HostAskingQuestionView';
import { HostFinishedView as QuizClashHostFinishedView } from '../game/QuizClash/views/HostFinishedView';
import { HostRevealView as QuizClashHostRevealView } from '../game/QuizClash/views/HostRevealView';
import { PlayerAnsweringView as QuizClashPlayerAnsweringView } from '../game/QuizClash/views/PlayerAnsweringView';
import { PlayerAnsweredView as QuizClashPlayerAnsweredView } from '../game/QuizClash/views/PlayerAnsweredView';
import { PlayerFinishedView as QuizClashPlayerFinishedView } from '../game/QuizClash/views/PlayerFinishedView';
import { PlayerRevealingAnswerView as QuizClashPlayerRevealingAnswerView } from '../game/QuizClash/views/PlayerRevealingAnswerView';
import { PlayerStartingView as QuizClashPlayerStartingView } from '../game/QuizClash/views/PlayerStartingView';

// FakeNews Views
import { HostStartingView as FakeNewsHostStartingView } from '../game/FakeNewsGame/views/HostStartingView';
import { HostWritingView as FakeNewsHostWritingView } from '../game/FakeNewsGame/views/HostWritingView';
import { HostVotingView as FakeNewsHostVotingView } from '../game/FakeNewsGame/views/HostVotingView';
import { HostRevealView as FakeNewsHostRevealView } from '../game/FakeNewsGame/views/HostRevealView';
import { HostFinishedView as FakeNewsHostFinishedView } from '../game/FakeNewsGame/views/HostFinishedView';
import { PlayerStartingView as FakeNewsPlayerStartingView } from '../game/FakeNewsGame/views/PlayerStartingView';
import { PlayerWritingView as FakeNewsPlayerWritingView } from '../game/FakeNewsGame/views/PlayerWritingView';
import { PlayerVotingView as FakeNewsPlayerVotingView } from '../game/FakeNewsGame/views/PlayerVotingView';
import { PlayerRevealView as FakeNewsPlayerRevealView } from '../game/FakeNewsGame/views/PlayerRevealView';
import { PlayerFinishedView as FakeNewsPlayerFinishedView } from '../game/FakeNewsGame/views/PlayerFinishedView';

// CardsWar Views
import { HostStartingView as CardsWarHostStartingView } from '../game/CardsWar/views/HostStartingView';
import { HostFinishedView as CardsWarHostFinishedView } from '../game/CardsWar/views/HostFinishedView';
import { HostRoundInProgressView as CardsWarHostRoundInProgressView } from '../game/CardsWar/views/HostRoundInProgressView';
import { HostWarDeclaredView as CardsWarHostWarDeclaredView } from '../game/CardsWar/views/HostWarDeclaredView';
import { PlayerStartingView as CardsWarPlayerStartingView } from '../game/CardsWar/views/PlayerStartingView';
import { PlayerPlayingView as CardsWarPlayerPlayingView } from '../game/CardsWar/views/PlayerPlayingView';
import { PlayerWarDeclaredView as CardsWarPlayerWarDeclaredView } from '../game/CardsWar/views/PlayerWarDeclaredView';
import { PlayerFinishedView as CardsWarPlayerFinishedView } from '../game/CardsWar/views/PlayerFinishedView';
import { PlayerWarTransitionView as CardsWarPlayerWarTransitionView } from '../game/CardsWar/views/PlayerWarTransitionView';
import HostFrame from '../components/old/layout/HostFrame';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://partyhubback.onrender.com';

const dummyPlayer: Player = {
  id: '1',
  nickname: 'Player 1',
  avatar: '/avatars/avatar1.png',
  score: 100,
  hasAnswered: false,
};

const dummyPlayers: Player[] = [
  { id: '1', nickname: 'Gold Winner', avatar: '/avatars/avatar1.png', score: 1500, hasAnswered: true },
  { id: '2', nickname: 'Silver Medalist', avatar: '/avatars/avatar2.png', score: 1200, hasAnswered: false },
  { id: '3', nickname: 'Bronze Finisher', avatar: '/avatars/avatar3.png', score: 900, hasAnswered: true },
  { id: '4', nickname: 'Fourth Place', avatar: '/avatars/avatar4.png', score: 600, hasAnswered: true },
  { id: '5', nickname: 'Fifth Place', avatar: '/avatars/avatar5.png', score: 300, hasAnswered: false },
];

const quizClashViews = {
  'Starting': {
    host: <HostFrame><QuizClashHostStartingView timer={10} /></HostFrame>,
    player: <QuizClashPlayerStartingView player={dummyPlayer} />
  },
  'Asking Question': {
    host: <HostFrame><QuizClashHostAskingQuestionView round={1} totalRounds={10} timer={10} answeredCount={2} totalPlayers={5} question="What is the capital of France?" answers={['Paris', 'London', 'Berlin', 'Madrid']} /></HostFrame>,
    player: <QuizClashPlayerAnsweringView answers={['Paris', 'London', 'Berlin', 'Madrid']} onAnswer={() => { }} disabled={false} selectedAnswer={null} />
  },
  'Answered': {
    host: null,
    player: <QuizClashPlayerAnsweredView />
  },
  'Reveal': {
    host: <HostFrame><QuizClashHostRevealView question="What is the capital of France?" answers={['Paris', 'London', 'Berlin', 'Madrid']} answerCounts={{ 0: 3, 1: 1, 2: 1 }} correctAnswerIndex={0} players={dummyPlayers} /></HostFrame>,
    player: <QuizClashPlayerRevealingAnswerView wasCorrect={true} pointsGained={100} lastRank={3} newRank={2} />
  },
  'Finished': {
    host: <HostFrame><QuizClashHostFinishedView players={dummyPlayers} onPlayAgain={() => { }} /></HostFrame>,
    player: <QuizClashPlayerFinishedView rank={2} playerCount={5} score={1200} topPlayers={dummyPlayers} onPlayAgain={() => { }} onBackToLobby={() => { }} />
  }
};

const fakeNewsViews = {
  'Starting': {
    host: <HostFrame><FakeNewsHostStartingView timer={10} /></HostFrame>,
    player: <FakeNewsPlayerStartingView />
  },
  'Writing': {
    host: <HostFrame><FakeNewsHostWritingView question="The best thing about pineapple on pizza is ________." players={dummyPlayers} /></HostFrame>,
    player: <FakeNewsPlayerWritingView question="The best thing about pineapple on pizza is ________." onLieChange={() => { }} onSubmit={() => { }} lie="" />
  },
  'Voting': {
    host: <HostFrame><FakeNewsHostVotingView question="The best thing about pineapple on pizza is ________." options={['its sweetness', 'its juiciness', 'the texture', 'absolutely nothing']} /></HostFrame>,
    player: <FakeNewsPlayerVotingView options={['its sweetness', 'its juiciness', 'the texture', 'absolutely nothing']} onVote={() => { }} />
  },
  'Reveal': {
    host: <HostFrame><FakeNewsHostRevealView options={['a', 'b']} votes={{}} correctAnswer="a" players={dummyPlayers} /></HostFrame>,
    player: <FakeNewsPlayerRevealView wasCorrect={true} playerLie="My Lie" foolingCount={2} />
  },
  'Finished': {
    host: <HostFrame><FakeNewsHostFinishedView players={dummyPlayers} awards={[]} /></HostFrame>,
    player: <FakeNewsPlayerFinishedView myFinalRank={1} iAmMasterLiar={true} iAmTruthSeeker={false} />
  }
};

const cardsWarViews = {
  'Starting': {
    host: <HostFrame><CardsWarHostStartingView timer={10} /></HostFrame>,
    player: <CardsWarPlayerStartingView />
  },
  'Playing': {
    host: <HostFrame><CardsWarHostRoundInProgressView player1={dummyPlayers[0]} player2={dummyPlayers[1]} player1Card={{ suit: 'hearts', rank: 10, value: 10, name: '10' }} player2Card={{ suit: 'spades', rank: 5, value: 5, name: '5' }} /></HostFrame>,
    player: <CardsWarPlayerPlayingView onPlayCard={() => { }} />
  },
  'War Transition': {
    host: null,
    player: <CardsWarPlayerWarTransitionView />
  },
  'War Declared': {
    host: <HostFrame><CardsWarHostWarDeclaredView player1Card={{ suit: 'hearts', rank: 10, value: 10, name: '10' }} player2Card={{ suit: 'spades', rank: 5, value: 5, name: '5' }} /></HostFrame>,
    player: <CardsWarPlayerWarDeclaredView onPlayCard={() => { }} />
  },
  'Finished': {
    host: <HostFrame><CardsWarHostFinishedView winner={dummyPlayer} /></HostFrame>,
    player: <CardsWarPlayerFinishedView isWinner={true} />
  }
};

const hardcodedViews = {
  'QuizClash': quizClashViews,
  'FakeNews': fakeNewsViews,
  'CardsWar': cardsWarViews,
};

const ServerGameViewRenderer: React.FC<{ game: any; view: string; role: 'host' | 'player' }> = ({ game, view, role }) => {
  const setGameState = useGameStore(state => state.setGameState);
  const setSocketId = usePlayerStore(state => state.setSocketId);
  const setRoom = useRoomStore(state => state.setRoom);

  useEffect(() => {
    const hostId = 'host-id';
    const playerId = role === 'host' ? hostId : '1';

    // Set up the game state with the correct structure for DynamicViewRenderer
    const gameState = {
      ...game,
      currentState: view,
      players: dummyPlayers,
      hostId: hostId,
      // The UI should contain the entire UI object, not just the specific view
      ui: game.ui
    };

    setGameState(gameState, true);
    setSocketId(playerId);
    const roomData: RoomData = {
      roomCode: 'test',
      host: dummyPlayers[0],
      hostId: hostId,
      players: dummyPlayers,
      state: RoomState.IN_GAME,
      gameId: game.metadata.gameId,
    };
    setRoom(roomData);

  }, [game, view, role, setGameState, setSocketId, setRoom]);

  return <DynamicViewRenderer />;
};

const HostResolutions = {
  'Desktop (Default)': { width: '100%', height: '100%' },
  'iPad Air': { height: '820px', width: '1180px' },
  'iPad Pro 12.9"': { height: '1024px', width: '1366px' },
};
const playerResolutions = {
  'iPhone 12/13 Pro': { width: '390px', height: '844px' },
  'Samsung Galaxy S21': { width: '360px', height: '800px' },
  'Google Pixel 5': { width: '393px', height: '851px' },
  'iPhone 14 Pro Max': { width: '430px', height: '932px' },
  'Samsung Galaxy S23 Ultra': { width: '412px', height: '892px' },
  'Google Pixel 7 Pro': { width: '412px', height: '892px' },
  'iPad Air': { width: '820px', height: '1180px' },
  'iPad Pro 12.9"': { width: '1024px', height: '1366px' },
};

const GameUITestPage: React.FC = () => {
  const { '*': path } = useParams();
  const navigate = useNavigate();
  const [gameName, viewName] = path?.split('/') || [];

  const [allViews, setAllViews] = useState<any>(hardcodedViews);
  const [currentGame, setCurrentGame] = useState<string>('QuizClash');
  const [currentStateName, setCurrentStateName] = useState(Object.keys(hardcodedViews['QuizClash'])[0]);
  const [viewType, setViewType] = useState<'host' | 'player'>('host');
  const [resolutions, setResolutions] = useState({
    host: 'Desktop (Default)',
    player: 'iPhone 14 Pro Max',
  });

  useEffect(() => {
    const fetchServerGames = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/game-configs`);
        const gameslist: { gameId: string }[] = await response.json();
        const gameConfigs = await Promise.all(
          gameslist.map((game) =>
            fetch(`${BACKEND_URL}/api/game-configs/${game.gameId}`).then((res) => res.json())
          )
        );

        const serverViews: { [key: string]: any } = {};
        gameConfigs.forEach((game: any) => {
          const views: { [key: string]: any } = {};
          Object.keys(game.ui).forEach((stateName: string) => {
            views[stateName] = {
              host: { game, view: stateName, role: 'host' },
              player: { game, view: stateName, role: 'player' },
            };
          });
          serverViews[game.metadata.gameId] = views;
        });

        setAllViews({ ...hardcodedViews, ...serverViews });
      } catch (error) {
        console.error("Failed to fetch server games", error);
      }
    };

    fetchServerGames();
  }, []);

  useEffect(() => {
    if (gameName && allViews[gameName]) {
      setCurrentGame(gameName);
      if (viewName && allViews[gameName][viewName]) {
        setCurrentStateName(viewName);
      } else {
        setCurrentStateName(Object.keys(allViews[gameName])[0]);
      }
    } else {
      setCurrentGame('QuizClash');
      setCurrentStateName(Object.keys(hardcodedViews['QuizClash'])[0]);
    }
  }, [gameName, viewName, allViews]);

  const handleGameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newGame = event.target.value;
    navigate(`/test/ui/${newGame}`);
  };

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = event.target.value;
    navigate(`/test/ui/${currentGame}/${newState}`);
  };

  const gameViews = allViews[currentGame];
  const gameStates = gameViews ? Object.keys(gameViews) : [];
  const currentStateIndex = gameStates.indexOf(currentStateName);

  const handleNextView = () => {
    const nextIndex = (currentStateIndex + 1) % gameStates.length;
    navigate(`/test/ui/${currentGame}/${gameStates[nextIndex]}`);
  };

  const handlePrevView = () => {
    const prevIndex = (currentStateIndex - 1 + gameStates.length) % gameStates.length;
    navigate(`/test/ui/${currentGame}/${gameStates[prevIndex]}`);
  };

  const currentView = gameViews?.[currentStateName]?.[viewType];

  // Check if this is a server view (has game, view, role properties) or a hardcoded view
  const isServerView = currentView && typeof currentView === 'object' && 'game' in currentView;

  let renderedView;
  if (isServerView) {
    // Render the ServerGameViewRenderer for server views
    renderedView = <ServerGameViewRenderer game={currentView.game} view={currentView.view} role={currentView.role} />;
  } else {
    // Use the hardcoded view directly
    renderedView = currentView;
  }

  const currentResolutionSet = viewType === 'host' ? HostResolutions : playerResolutions;
  const currentResolutionName = resolutions[viewType];

  const containerStyle = {
    border: '2px solid var(--border-color)',
    borderRadius: 'var(--border-radius)',
    padding: '2rem',
    background: `var(--background-light)`,
    minHeight: '60vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: currentResolutionSet[currentResolutionName as keyof typeof currentResolutionSet]?.width ?? '100%',
    height: currentResolutionSet[currentResolutionName as keyof typeof currentResolutionSet]?.height ?? '100%',
    margin: 'auto',
    overflow: 'auto',
    transition: 'width 0.3s, height 0.3s'
  };

  return (
    <div style={{ padding: '2rem', background: 'var(--background-dark)', color: 'var(--text-main)', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Button onClick={handlePrevView} disabled={gameStates.length < 2}>Previous State</Button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '1rem' }}>
            <select value={currentGame} onChange={handleGameChange} style={{ marginRight: '1rem' }}>
              {Object.keys(allViews).map(game => <option key={game} value={game}>{game}</option>)}
            </select>
            <select value={currentStateName} onChange={handleStateChange} style={{ marginRight: '1rem' }}>
              {gameStates.map(state => <option key={state} value={state}>{state}</option>)}
            </select>
            <label style={{ marginRight: '1rem' }}>
              <input type="radio" name="viewType" value="host" checked={viewType === 'host'} onChange={() => setViewType('host')} /> Host
            </label>
            <label>
              <input type="radio" name="viewType" value="player" checked={viewType === 'player'} onChange={() => setViewType('player')} /> Player
            </label>
          </div>
          <div>
            <select value={currentResolutionName} onChange={(e) => setResolutions(prev => ({ ...prev, [viewType]: e.target.value }))}>
              {Object.keys(currentResolutionSet).map(res => <option key={res} value={res}>{res}</option>)}
            </select>
          </div>
        </div>
        <Button onClick={handleNextView} disabled={gameStates.length < 2}>Next State</Button>
      </div>
      <div style={containerStyle}>
        {renderedView}
      </div>
    </div>
  );
};

export default GameUITestPage;
