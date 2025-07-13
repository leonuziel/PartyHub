// Cards
import { BiddingPopup } from './cards/BiddingPopup';
import { Card } from './cards/Card';
import { CardFan } from './cards/CardFan';
import { CardSlot } from './cards/CardSlot';
import { Deck } from './cards/Deck';
import { DiscardPile } from './cards/DiscardPile';
import { Hand } from './cards/Hand';
import { LastPlayedCard } from './cards/LastPlayedCard';
import { Meld } from './cards/Meld';
import { PlayerHandDisplay } from './cards/PlayerHandDisplay';
import { Scoreboard } from './cards/Scoreboard';
import { Trick } from './cards/Trick';
import { TrumpIndicator } from './cards/TrumpIndicator';

// Common
import { DebugPanel } from './common/DebugPanel';
import {Modal} from './common/Modal';
import { Spinner } from './common/Spinner';

// Controls
import { ActionButton } from './controls/ActionButton';
import { AnswerGrid } from './controls/AnswerGrid';
import { Button } from './controls/Button';
import { GameCard } from './controls/GameCard';
import { TextAreaWithCounter } from './controls/TextAreaWithCounter';
import { VotingOptions } from './controls/VotingOptions';

// Display
import { AnswerResult } from './display/AnswerResult';
import { AwardDisplay } from './display/AwardDisplay';
import { GameBranding } from './display/GameBranding';
import { GameTitle } from './display/GameTitle';
import { Leaderboard } from './display/Leaderboard';
import { PlayerAvatar } from './display/PlayerAvatar';
import { PlayerCard } from './display/PlayerCard';
import { PlayerInfo } from './display/PlayerInfo';
import { PlayerStatusContainer } from './display/PlayerStatusContainer';
import { PlayerStatusGrid } from './display/PlayerStatusGrid';
import { Podium } from './display/Podium';
import { PodiumList } from './display/PodiumList';
import { QuestionDisplay } from './display/QuestionDisplay';
import { QuestionHeader } from './display/QuestionHeader';
import { RankDisplay } from './display/RankDisplay';
import { RankUpdate } from './display/RankUpdate';
import { ResultsList } from './display/ResultsList';
import { SpecialAwards } from './display/SpecialAwards';
import { WinnerDisplay } from './display/WinnerDisplay';

// Gameplay
import { CountdownTimer } from './gameplay/CountdownTimer';

// Layout
import { CenteredMessage } from './layout/CenteredMessage';
import  HostFrame  from './layout/HostFrame';
import { HostViewContainer } from './layout/HostViewContainer';
import { PlayArea } from './layout/PlayArea';
import { PlayerViewContainer } from './layout/PlayerViewContainer';
import { VStack } from './layout/structural/VStack';
import { HStack } from './layout/structural/HStack';
import { Spacer } from './layout/structural/Spacer';

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
