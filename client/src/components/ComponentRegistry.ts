// Cards
import { BiddingPopup } from './old/cards/BiddingPopup';
import { Card } from './old/cards/Card';
import { CardFan } from './old/cards/CardFan';
import { CardSlot } from './old/cards/CardSlot';
import { Deck } from './old/cards/Deck';
import { DiscardPile } from './old/cards/DiscardPile';
import { Hand } from './old/cards/Hand';
import { LastPlayedCard } from './old/cards/LastPlayedCard';
import { Meld } from './old/cards/Meld';
import { PlayerHandDisplay } from './old/cards/PlayerHandDisplay';
import { Scoreboard } from './old/cards/Scoreboard';
import { Trick } from './old/cards/Trick';
import { TrumpIndicator } from './old/cards/TrumpIndicator';

// Common
import { DebugPanel } from './old/common/DebugPanel';
import { Modal } from './old/common/Modal';
import { Spinner } from './old/common/Spinner';

// Controls
import { ActionButton } from './old/controls/ActionButton';
import { AnswerGrid } from './old/controls/AnswerGrid';
import { Button } from './old/controls/Button';
import { GameCard } from './old/controls/GameCard';
import { TextAreaWithCounter } from './old/controls/TextAreaWithCounter';
import { VotingOptions } from './old/controls/VotingOptions';

// Display
import { AnswerResult } from './old/display/AnswerResult';
import { AwardDisplay } from './old/display/AwardDisplay';
import { GameBranding } from './old/display/GameBranding';
import { GameTitle } from './old/display/GameTitle';
import { Leaderboard } from './old/display/Leaderboard';
import { PlayerAvatar } from './old/display/PlayerAvatar';
import { PlayerCard } from './old/display/PlayerCard';
import { PlayerInfo } from './old/display/PlayerInfo';
import { PlayerStatusContainer } from './old/display/PlayerStatusContainer';
import { PlayerStatusGrid } from './old/display/PlayerStatusGrid';
import { Podium } from './old/display/Podium';
import { PodiumList } from './old/display/PodiumList';
import { QuestionDisplay } from './old/display/QuestionDisplay';
import { QuestionHeader } from './old/display/QuestionHeader';
import { RankDisplay } from './old/display/RankDisplay';
import { RankUpdate } from './old/display/RankUpdate';
import { ResultsList } from './old/display/ResultsList';
import { SpecialAwards } from './old/display/SpecialAwards';
import { WinnerDisplay } from './old/display/WinnerDisplay';

// Gameplay
import { CountdownTimer } from './old/gameplay/CountdownTimer';

// Layout
import { CenteredMessage } from './old/layout/CenteredMessage';
import HostFrame from './old/layout/HostFrame';
import { HostViewContainer } from './old/layout/HostViewContainer';
import { PlayArea } from './old/layout/PlayArea';
import { PlayerViewContainer } from './old/layout/PlayerViewContainer';
import { VStack } from './old/structural/VStack';
import { HStack } from './old/structural/HStack';
import { Spacer } from './old/structural/Spacer';

// This registry maps string names (used in the game config) to actual React components.
export const ComponentRegistry: Record<string, React.ComponentType<any>> = {
    // Cards
    'BiddingPopup': BiddingPopup,
    'Card': Card,
    'CardFan': CardFan,
    'CardSlot': CardSlot,
    'Deck': Deck,
    'DiscardPile': DiscardPile,
    'Hand': Hand,
    'LastPlayedCard': LastPlayedCard,
    'Meld': Meld,
    'PlayerHandDisplay': PlayerHandDisplay,
    'Scoreboard': Scoreboard,
    'Trick': Trick,
    'TrumpIndicator': TrumpIndicator,

    // Common
    'DebugPanel': DebugPanel,
    'Modal': Modal,
    'Spinner': Spinner,

    // Controls
    'ActionButton': ActionButton,
    'AnswerGrid': AnswerGrid,
    'Button': Button,
    'GameCard': GameCard,
    'TextAreaWithCounter': TextAreaWithCounter,
    'VotingOptions': VotingOptions,

    // Display
    'AnswerResult': AnswerResult,
    'AwardDisplay': AwardDisplay,
    'GameBranding': GameBranding,
    'GameTitle': GameTitle,
    'Leaderboard': Leaderboard,
    'PlayerAvatar': PlayerAvatar,
    'PlayerCard': PlayerCard,
    'PlayerInfo': PlayerInfo,
    'PlayerStatusContainer': PlayerStatusContainer,
    'PlayerStatusGrid': PlayerStatusGrid,
    'Podium': Podium,
    'PodiumList': PodiumList,
    'QuestionDisplay': QuestionDisplay,
    'QuestionHeader': QuestionHeader,
    'RankDisplay': RankDisplay,
    'RankUpdate': RankUpdate,
    'ResultsList': ResultsList,
    'SpecialAwards': SpecialAwards,
    'WinnerDisplay': WinnerDisplay,

    // Gameplay
    'CountdownTimer': CountdownTimer,

    // Layout
    'CenteredMessage': CenteredMessage,
    'HostFrame': HostFrame,
    'HostViewContainer': HostViewContainer,
    'PlayArea': PlayArea,
    'PlayerViewContainer': PlayerViewContainer,
    'VStack': VStack,
    'HStack': HStack,
    'Spacer': Spacer,
};
