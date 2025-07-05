import React, { useState } from 'react';
// --- Controls ---
import { Button } from '../components/controls/Button';
import { ActionButton } from '../components/controls/ActionButton';
import { TextAreaWithCounter } from '../components/controls/TextAreaWithCounter';
import { VotingOptions } from '../components/controls/VotingOptions';
import { AnswerGrid } from '../components/controls/AnswerGrid';
import { GameCard } from '../components/controls/GameCard';

// --- Display ---
import { GameTitle } from '../components/display/GameTitle';
import { Leaderboard } from '../components/display/Leaderboard';
import { PlayerAvatar } from '../components/display/PlayerAvatar';
import { Podium } from '../components/display/Podium';
import { PlayerStatusContainer } from '../components/display/PlayerStatusContainer';
import { WinnerDisplay } from '../components/display/WinnerDisplay';
import { PlayerCard } from '../components/display/PlayerCard';
import { PlayerInfo } from '../components/display/PlayerInfo';
import { RankDisplay } from '../components/display/RankDisplay';
import { PlayerStatusGrid } from '../components/display/PlayerStatusGrid';
import { RankUpdate } from '../components/display/RankUpdate';
import { PodiumList } from '../components/display/PodiumList';
import { QuestionDisplay } from '../components/display/QuestionDisplay';
import { AnswerResult } from '../components/display/AnswerResult';
import { AwardDisplay } from '../components/display/AwardDisplay';
import { ResultsList } from '../components/display/ResultsList';
import { SpecialAwards } from '../components/display/SpecialAwards';
import { GameBranding } from '../components/display/GameBranding';
import { QuestionHeader } from '../components/display/QuestionHeader';

// --- Gameplay ---
import { CountdownTimer } from '../components/gameplay/CountdownTimer';

// --- Layout ---
import { PlayArea } from '../components/layout/PlayArea';
import { CenteredMessage } from '../components/layout/CenteredMessage';

// --- Common ---
import { Spinner } from '../components/common/Spinner';
import Modal from '../components/common/Modal';
import { DebugPanel } from '../components/common/DebugPanel';

// --- Cards ---
import { Card } from '../components/cards/Card';

// Card Game Components
import { BiddingPopup } from '../components/cards/BiddingPopup';
import { CardFan } from '../components/cards/CardFan';
import { CardSlot } from '../components/cards/CardSlot';
import { Deck } from '../components/cards/Deck';
import { DiscardPile } from '../components/cards/DiscardPile';
import { Hand } from '../components/cards/Hand';
import { LastPlayedCard } from '../components/cards/LastPlayedCard';
import { Meld } from '../components/cards/Meld';
import { PlayerHandDisplay } from '../components/cards/PlayerHandDisplay';
import { Scoreboard } from '../components/cards/Scoreboard';
import { Trick } from '../components/cards/Trick';
import { TrumpIndicator } from '../components/cards/TrumpIndicator';

// Types
import { Player, Card as CardType } from '../types/types';

const dummyPlayer: Player = { id: '1', nickname: 'Player 1', avatar: '/avatars/avatar1.png', score: 100, hasAnswered: false };
const dummyPlayers: Player[] = [
  { id: '1', nickname: 'Gold Winner', avatar: '/avatars/avatar1.png', score: 1500, hasAnswered: true },
  { id: '2', nickname: 'Silver Medalist', avatar: '/avatars/avatar2.png', score: 1200, hasAnswered: false },
  { id: '3', nickname: 'Bronze Finisher', avatar: '/avatars/avatar3.png', score: 900, hasAnswered: true },
  { id: '4', nickname: 'Fourth Place', avatar: '/avatars/avatar4.png', score: 600, hasAnswered: true },
  { id: '5', nickname: 'Fifth Place', avatar: '/avatars/avatar5.png', score: 300, hasAnswered: false },
];
const dummyCard1: CardType = { suit: '♠', rank: 14, value: 14, name: 'A' };
const dummyCard2: CardType = { suit: '♥', rank: 13, value: 13, name: 'K' };
const dummyHand: CardType[] = [
  { suit: '♠', rank: 14, value: 14, name: 'A' },
  { suit: '♥', rank: 13, value: 13, name: 'K' },
  { suit: '♣', rank: 12, value: 12, name: 'Q' },
  { suit: '♦', rank: 11, value: 11, name: 'J' },
  { suit: '♠', rank: 10, value: 10, name: '10' },
];

interface ComponentTest {
  title: string;
  component: React.ReactNode;
}

interface TestTab {
  id: string;
  name: string;
  sections: ComponentTest[];
}

const TestComponentsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const testTabs: TestTab[] = [
    {
      id: 'general',
      name: 'General',
      sections: [
        { title: 'Buttons', component: <div style={{ display: 'flex', gap: '1rem' }}><Button>Primary</Button><Button variant="secondary">Secondary</Button><Button disabled>Disabled</Button></div> },
        { title: 'Action Button', component: <ActionButton onClick={() => alert('Action!')}>Click Me!</ActionButton> },
        { title: 'Spinner', component: <Spinner /> },
        { title: 'Cards', component: <div style={{ display: 'flex', gap: '1rem' }}><Card content="Face Up" faceUp={true} /><Card content="Face Down" faceUp={false} /></div> },
        { title: 'Modal', component: <><Button onClick={() => setIsModalOpen(true)}>Open Modal</Button><Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}><h2>Modal Content</h2><p>This is the content of the modal.</p></Modal></> },
        { title: 'Text Area With Counter', component: <TextAreaWithCounter maxLength={140} placeholder="Enter text..." onChange={(v) => console.log(v)} /> },
        { title: 'Centered Message', component: <CenteredMessage><h2>Waiting for players...</h2></CenteredMessage> },
        { title: 'Play Area', component: <PlayArea><GameTitle title="Content inside PlayArea" /></PlayArea> },
      ],
    },
    {
      id: 'player-status',
      name: 'Player & Status',
      sections: [
        { title: 'Winner Display', component: <WinnerDisplay winnerName="Player 1" /> },
        { title: 'Player Avatars', component: <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><PlayerAvatar player={dummyPlayer} size="small" /><PlayerAvatar player={dummyPlayer} size="medium" /><PlayerAvatar player={dummyPlayer} size="large" /></div> },
        { title: 'Leaderboard', component: <Leaderboard players={dummyPlayers} /> },
        { title: 'Podium', component: <Podium players={dummyPlayers} /> },
        { title: 'Player Status Container', component: <PlayerStatusContainer title="Get Ready!" subtitle="The game is about to begin." /> },
        { title: 'Player Cards', component: <div style={{ display: 'flex', gap: '1rem' }}><PlayerCard player={dummyPlayer} size="small" /><PlayerCard player={dummyPlayer} size="medium" /><PlayerCard player={dummyPlayer} size="large" /></div> },
        { title: 'Player Info', component: <PlayerInfo player={dummyPlayer} /> },
        { title: 'Rank Display', component: <RankDisplay rank={3} /> },
        { title: 'Player Status Grid', component: <PlayerStatusGrid players={dummyPlayers} /> },
        { title: 'Rank Update', component: <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}><RankUpdate oldRank={5} newRank={2} /><RankUpdate oldRank={2} newRank={4} /><RankUpdate oldRank={3} newRank={3} /></div> },
        { title: 'Podium List', component: <PodiumList players={dummyPlayers} /> },
      ],
    },
    {
      id: 'game-specific',
      name: 'Game UI',
      sections: [
        { title: 'Countdown Timer', component: <CountdownTimer initialValue={5} /> },
        { title: 'Question Display', component: <QuestionDisplay question="What is the capital of France?" /> },
        { title: 'Answer Results', component: <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}><AnswerResult answer="Paris" percentage={75} isCorrect={true} /><AnswerResult answer="London" percentage={15} isCorrect={false} /><AnswerResult answer="Berlin" percentage={10} isCorrect={false} /></div> },
        { title: 'Voting Options', component: <VotingOptions options={['Option A', 'Option B', 'Option C']} onVote={(option) => alert(`You voted for ${option}`)} /> },
        { title: 'Award Display', component: <AwardDisplay award="Master Liar" description="Fooled the most players!" /> },
        { title: 'Results List', component: <ResultsList options={['Paris', 'London', 'Berlin']} votes={{ '1': 'Paris', '2': 'Paris', '3': 'London', '4': 'Paris', '5': 'Berlin' }} correctAnswer="Paris" players={dummyPlayers} /> },
        { title: 'Special Awards', component: <SpecialAwards awards={[{ awardName: 'Master Liar', player: dummyPlayers[1] }, { awardName: 'Truth Seeker', player: dummyPlayers[0] }]} /> },
        { title: 'Game Branding', component: <div style={{display: 'flex', gap: '1rem'}}><GameBranding gameTitle="QuizClash" logoUrl="/game-art/quizclash.png" /><GameBranding gameTitle="FakeNews" logoUrl="/game-art/fakenews.png" /></div> },
        { title: 'Question Header', component: <QuestionHeader round={3} totalRounds={10} timer={7} answeredCount={3} totalPlayers={5} /> },
        { title: 'Answer Grid (Player)', component: <AnswerGrid answers={['', '', '', '']} onAnswer={(index) => alert(`Chose ${index}`)} /> },
        { title: 'Answer Grid (Host)', component: <AnswerGrid answers={['Ans 1', 'Ans 2', 'Ans 3', 'Ans 4']} onAnswer={() => {}} disabled={true} /> },
      ],
    },
    {
      id: 'card-games',
      name: 'Card Game Components',
      sections: [
        { title: 'Deck', component: <Deck count={52} onDraw={() => alert('Drew card!')} /> },
        { title: 'Discard Pile', component: <DiscardPile topCard={{ suit: dummyCard1.suit, value: dummyCard1.name }} /> },
        { title: 'Hand', component: <Hand cards={dummyHand} onCardClick={(c) => alert(`Clicked ${c.name}`)} /> },
        { title: 'Card Slot', component: <div style={{display: 'flex', gap: '1rem'}}><CardSlot card={dummyCard2} /><CardSlot card={null} /></div> },
        { title: 'Player Hand Display', component: <PlayerHandDisplay cardCount={5} playerName="Opponent" /> },
        { title: 'Trick', component: <Trick cards={[{player: 'p1', card: dummyCard1}, {player: 'p2', card: dummyCard2}]} /> },
        { title: 'Bidding Popup', component: <BiddingPopup onBid={(a) => alert(`Bid ${a}`)} onPass={() => alert('Passed')} /> },
        { title: 'Scoreboard', component: <Scoreboard scores={{'Player 1': 120, 'Player 2': 95}} /> },
        { title: 'Meld', component: <Meld cards={dummyHand.slice(0,3)} /> },
        { title: 'Card Fan', component: <div style={{paddingTop: '3rem'}}><CardFan cards={dummyHand} /></div> },
        { title: 'Trump Indicator', component: <TrumpIndicator suit={'♠'} /> },
        { title: 'Last Played Card', component: <LastPlayedCard card={dummyCard2} /> },
      ],
    },
  ];

  const activeTabData = testTabs.find(tab => tab.id === activeTab);

  const tabStyles: React.CSSProperties = {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '2rem',
    borderBottom: '2px solid var(--primary-main)',
    paddingBottom: '0.5rem',
  };

  const buttonStyles: React.CSSProperties = {
    padding: '0.5rem 1rem',
    border: 'none',
    background: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: '1rem',
  };
  
  const activeButtonStyle: React.CSSProperties = {
    ...buttonStyles,
    color: 'var(--primary-main)',
    borderBottom: '2px solid var(--primary-main)',
    marginBottom: '-2px',
  };

  return (
    <div style={{ padding: '2rem', background: 'var(--background-dark)', color: 'var(--text-main)', minHeight: '100vh' }}>
      <GameTitle title="Component Test Page" />
      
      <div style={tabStyles}>
        {testTabs.map(tab => (
          <button
            key={tab.id}
            style={activeTab === tab.id ? activeButtonStyle : buttonStyles}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {activeTabData?.sections.map((section, index) => (
          <section key={index}>
            <h2>{section.title}</h2>
            <div>{section.component}</div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default TestComponentsPage;
