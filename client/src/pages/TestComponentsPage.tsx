import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { CountdownTimer } from '../components/CountdownTimer';
import { GameTitle } from '../components/GameTitle';
import { Leaderboard } from '../components/Leaderboard';
import { PlayerAvatar } from '../components/PlayerAvatar';
import { Podium } from '../components/Podium';
import { Spinner } from '../components/Spinner';
import { PlayerStatusContainer } from '../components/PlayerStatusContainer';
import { WinnerDisplay } from '../components/WinnerDisplay';
import { Player } from '../types/types';
import Modal from '../components/Modal';
import { TextAreaWithCounter } from '../components/TextAreaWithCounter';
import { PlayerCard } from '../components/PlayerCard';
import { QuestionDisplay } from '../components/QuestionDisplay';
import { AnswerResult } from '../components/AnswerResult';
import { ActionButton } from '../components/ActionButton';
import { PlayerInfo } from '../components/PlayerInfo';
import { PlayArea } from '../components/PlayArea';
import { CenteredMessage } from '../components/CenteredMessage';
import { VotingOptions } from '../components/VotingOptions';
import { RankDisplay } from '../components/RankDisplay';
import { AwardDisplay } from '../components/AwardDisplay';
import { PlayerStatusGrid } from '../components/PlayerStatusGrid';
import { ResultsList } from '../components/ResultsList';
import { SpecialAwards } from '../components/SpecialAwards';
import { RankUpdate } from '../components/RankUpdate';
import { PodiumList } from '../components/PodiumList';
import { GameBranding } from '../components/GameBranding';
import { QuestionHeader } from '../components/QuestionHeader';
import { AnswerGrid } from '../components/AnswerGrid';

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

const TestComponentsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ 
        padding: '2rem', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '3rem', /* Increased gap for better separation */
        background: 'var(--background-dark)', 
        color: 'var(--text-main)' 
    }}>
        <GameTitle title="Component Test Page" />

        <section>
        <h2>Buttons</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button>Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button disabled>Disabled Button</Button>
        </div>
      </section>

      <section>
        <h2>Spinner</h2>
        <Spinner />
      </section>

      <section>
        <h2>Countdown Timer</h2>
        <CountdownTimer initialValue={5} />
      </section>

      <section>
        <h2>Winner Display</h2>
        <WinnerDisplay winnerName="Player 1" />
      </section>

      <section>
        <h2>Player Avatars</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <PlayerAvatar player={dummyPlayer} size="small" />
          <PlayerAvatar player={dummyPlayer} size="medium" />
          <PlayerAvatar player={dummyPlayer} size="large" />
        </div>
      </section>

      <section>
        <h2>Cards</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Card content="Face Up" faceUp={true} />
          <Card content="Face Down" faceUp={false} />
        </div>
      </section>

      <section>
        <h2>Leaderboard</h2>
        <Leaderboard players={dummyPlayers} />
      </section>

      <section>
        <h2>Podium</h2>
        <Podium players={dummyPlayers} />
      </section>

      <section>
        <h2>Player Status Container</h2>
        <PlayerStatusContainer title="Get Ready!" subtitle="The game is about to begin." />
      </section>

      <section>
        <h2>Modal</h2>
        <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2>This is a modal!</h2>
          <p>You can put any content you want in here.</p>
        </Modal>
      </section>

      <section>
        <h2>Text Area With Counter</h2>
        <TextAreaWithCounter
          maxLength={140}
          placeholder="Enter your text here..."
          onChange={(value) => console.log(value)}
        />
      </section>

      <section>
        <h2>Player Cards</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <PlayerCard player={dummyPlayer} size="small" />
          <PlayerCard player={dummyPlayer} size="medium" />
          <PlayerCard player={dummyPlayer} size="large" />
        </div>
      </section>

      <section>
        <h2>Question Display</h2>
        <QuestionDisplay question="What is the capital of France?" />
      </section>

      <section>
        <h2>Answer Results</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AnswerResult answer="Paris" percentage={75} isCorrect={true} />
          <AnswerResult answer="London" percentage={15} isCorrect={false} />
          <AnswerResult answer="Berlin" percentage={10} isCorrect={false} />
        </div>
      </section>

      <section>
        <h2>Action Button</h2>
        <ActionButton onClick={() => alert('Action!')}>Click Me!</ActionButton>
      </section>

      <section>
        <h2>Player Info</h2>
        <PlayerInfo player={dummyPlayer} />
      </section>

      <section>
        <h2>Play Area</h2>
        <PlayArea>
          <GameTitle title="Content inside PlayArea" />
        </PlayArea>
      </section>

      <section>
        <h2>Centered Message</h2>
        <CenteredMessage>
          <h2>Waiting for players...</h2>
        </CenteredMessage>
      </section>

      <section>
        <h2>Voting Options</h2>
        <VotingOptions
          options={['Option A', 'Option B', 'Option C']}
          onVote={(option) => alert(`You voted for ${option}`)}
        />
      </section>

      <section>
        <h2>Rank Display</h2>
        <RankDisplay rank={3} />
      </section>

      <section>
        <h2>Award Display</h2>
        <AwardDisplay award="Master Liar" description="Fooled the most players!" />
      </section>

      <section>
        <h2>Player Status Grid</h2>
        <PlayerStatusGrid players={dummyPlayers} />
      </section>

      <section>
        <h2>Results List</h2>
        <ResultsList
          options={['Paris', 'London', 'Berlin']}
          votes={{
            '1': 'Paris',
            '2': 'Paris',
            '3': 'London',
            '4': 'Paris',
            '5': 'Berlin',
          }}
          correctAnswer="Paris"
          players={dummyPlayers}
        />
      </section>

      <section>
        <h2>Special Awards</h2>
        <SpecialAwards
          awards={[
            { awardName: 'Master Liar', player: dummyPlayers[1] },
            { awardName: 'Truth Seeker', player: dummyPlayers[0] },
          ]}
        />
      </section>

      <section>
        <h2>Rank Update</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <RankUpdate oldRank={5} newRank={2} />
          <RankUpdate oldRank={2} newRank={4} />
          <RankUpdate oldRank={3} newRank={3} />
        </div>
      </section>

      <section>
        <h2>Podium List</h2>
        <PodiumList players={dummyPlayers} />
      </section>

      <section>
        <h2>Game Branding</h2>
        <GameBranding gameTitle="QuizClash" logoUrl="/game-art/quizclash.png" />
        <GameBranding gameTitle="FakeNews" logoUrl="/game-art/fakenews.png" />
      </section>

      <section>
        <h2>Question Header</h2>
        <QuestionHeader
          round={3}
          totalRounds={10}
          timer={7}
          answeredCount={3}
          totalPlayers={5}
        />
      </section>

      <section>
        <h2>Answer Grid (Player View)</h2>
        <AnswerGrid
            answers={['','','','']}
            onAnswer={(index) => alert(`You chose answer ${index + 1}`)}
        />
      </section>

      <section>
        <h2>Answer Grid (Host View)</h2>
        <AnswerGrid
            answers={['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4']}
            onAnswer={() => {}}
            disabled={true}
        />
      </section>
    </div>
  );
};

export default TestComponentsPage;
