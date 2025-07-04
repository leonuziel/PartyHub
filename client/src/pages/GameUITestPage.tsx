import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Player } from '../types/types';

// QuizClash Views
import { HostStartingView as QuizClashHostStartingView } from '../game/QuizClash/views/HostStartingView';
import { HostAskingQuestionView as QuizClashHostAskingQuestionView } from '../game/QuizClash/views/HostAskingQuestionView';
import { HostFinishedView as QuizClashHostFinishedView } from '../game/QuizClash/views/HostFinishedView';
import { HostRevealView as QuizClashHostRevealView } from '../game/QuizClash/views/HostRevealView';
import { PlayerAnsweringView as QuizClashPlayerAnsweringView } from '../game/QuizClash/views/PlayerAnsweringView';
import { PlayerFinishedView as QuizClashPlayerFinishedView } from '../game/QuizClash/views/PlayerFinishedView';
import { PlayerRevealingAnswerView as QuizClashPlayerRevealingAnswerView } from '../game/QuizClash/views/PlayerRevealingAnswerView';
import { PlayerStartingView as QuizClashPlayerStartingView } from '../game/QuizClash/views/PlayerStartingView';

// FakeNews Views
import { HostStartingView as FakeNewsHostStartingView } from '../game/FakeNewsGame/views/HostStartingView';
import { HostWritingView as FakeNewsHostWritingView } from '../game/FakeNewsGame/views/HostWritingView';
import { HostVotingView as FakeNewsHostVotingView } from '../game/FakeNewsGame/views/HostVotingView';
import { PlayerStartingView as FakeNewsPlayerStartingView } from '../game/FakeNewsGame/views/PlayerStartingView';
import { PlayerWritingView as FakeNewsPlayerWritingView } from '../game/FakeNewsGame/views/PlayerWritingView';

// CardsWar Views
import { HostStartingView as CardsWarHostStartingView } from '../game/CardsWar/views/HostStartingView';
import { HostFinishedView as CardsWarHostFinishedView } from '../game/CardsWar/views/HostFinishedView';
import { HostRoundInProgressView as CardsWarHostRoundInProgressView } from '../game/CardsWar/views/HostRoundInProgressView';


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

const quizClashViews = [
    { name: 'Host Starting', component: <QuizClashHostStartingView timer={10} /> },
    { name: 'Host Asking Question', component: <QuizClashHostAskingQuestionView round={1} totalRounds={10} timer={10} answeredCount={2} totalPlayers={5} question="What is the capital of France?" answers={['Paris', 'London', 'Berlin', 'Madrid']} /> },
    { name: 'Host Reveal', component: <QuizClashHostRevealView question="What is the capital of France?" answers={['Paris', 'London', 'Berlin', 'Madrid']} answerCounts={{0: 3, 1: 1, 2: 1}} correctAnswerIndex={0} players={dummyPlayers} /> },
    { name: 'Host Finished', component: <QuizClashHostFinishedView players={dummyPlayers} onPlayAgain={() => {}} /> },
    { name: 'Player Starting', component: <QuizClashPlayerStartingView player={dummyPlayer} /> },
    { name: 'Player Answering', component: <QuizClashPlayerAnsweringView answers={['', '', '', '']} onAnswer={() => {}} disabled={false} selectedAnswer={null} /> },
    { name: 'Player Reveal (Correct)', component: <QuizClashPlayerRevealingAnswerView wasCorrect={true} pointsGained={100} lastRank={3} newRank={2} /> },
    { name: 'Player Reveal (Incorrect)', component: <QuizClashPlayerRevealingAnswerView wasCorrect={false} pointsGained={0} lastRank={2} newRank={3} /> },
    { name: 'Player Finished', component: <QuizClashPlayerFinishedView rank={2} playerCount={5} score={1200} topPlayers={dummyPlayers} onPlayAgain={() => {}} onBackToLobby={() => {}} /> },
];

const fakeNewsViews = [
    { name: 'Host Starting', component: <FakeNewsHostStartingView timer={10} /> },
    { name: 'Host Writing', component: <FakeNewsHostWritingView question="The best thing about pineapple on pizza is ________." players={dummyPlayers} /> },
    { name: 'Host Voting', component: <FakeNewsHostVotingView question="The best thing about pineapple on pizza is ________." options={['its sweetness', 'its juiciness', 'the texture', 'absolutely nothing']} /> },
    { name: 'Player Starting', component: <FakeNewsPlayerStartingView /> },
    { name: 'Player Writing', component: <FakeNewsPlayerWritingView question="The best thing about pineapple on pizza is ________." onLieChange={() => {}} onSubmit={() => {}} lie="" /> },
];

const cardsWarViews = [
    { name: 'Host Starting', component: <CardsWarHostStartingView timer={10} /> },
    { name: 'Host Round in Progress', component: <CardsWarHostRoundInProgressView player1={dummyPlayers[0]} player2={dummyPlayers[1]} player1Card={{ suit: 'hearts', rank: 10, value: 10, name: '10' }} player2Card={{ suit: 'spades', rank: 5, value: 5, name: '5' }} /> },
    { name: 'Host Finished', component: <CardsWarHostFinishedView winner={dummyPlayer} /> },
];


const allViews = {
    'QuizClash': quizClashViews,
    'FakeNews': fakeNewsViews,
    'CardsWar': cardsWarViews,
};


const GameUITestPage: React.FC = () => {
  const [currentGame, setCurrentGame] = useState('QuizClash');
  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [viewType, setViewType] = useState('host'); // 'host' or 'player'

  const handleGameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentGame(event.target.value);
    setCurrentViewIndex(0);
  };

  const filteredViews = allViews[currentGame as keyof typeof allViews].filter(view =>
    view.name.toLowerCase().includes(viewType)
  );

  const handleNextView = () => {
    setCurrentViewIndex((prevIndex) => (prevIndex + 1) % filteredViews.length);
  };

  const handlePrevView = () => {
    setCurrentViewIndex((prevIndex) => (prevIndex - 1 + filteredViews.length) % filteredViews.length);
  };

  const currentView = filteredViews[currentViewIndex];

  return (
    <div style={{ padding: '2rem', background: 'var(--background-dark)', color: 'var(--text-main)', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Button onClick={handlePrevView} disabled={filteredViews.length < 2}>Previous View</Button>
        <div style={{ textAlign: 'center' }}>
          <div>
            <select value={currentGame} onChange={handleGameChange} style={{ marginRight: '1rem' }}>
              <option value="QuizClash">QuizClash</option>
              <option value="FakeNews">FakeNews</option>
              <option value="CardsWar">CardsWar</option>
            </select>
            <label style={{ marginRight: '1rem' }}>
              <input type="radio" name="viewType" value="host" checked={viewType === 'host'} onChange={() => { setViewType('host'); setCurrentViewIndex(0); }} /> Host
            </label>
            <label>
              <input type="radio" name="viewType" value="player" checked={viewType === 'player'} onChange={() => { setViewType('player'); setCurrentViewIndex(0); }} /> Player
            </label>
          </div>
          <h2 style={{ marginTop: '1rem' }}>{currentView?.name || 'No views available'}</h2>
        </div>
        <Button onClick={handleNextView} disabled={filteredViews.length < 2}>Next View</Button>
      </div>
      <div style={{ border: '2px solid var(--border-color)', borderRadius: 'var(--border-radius)', padding: '2rem', background: 'var(--background-light)', minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {currentView ? currentView.component : <p>No {viewType} views defined for this game.</p>}
      </div>
    </div>
  );
};

export default GameUITestPage;
