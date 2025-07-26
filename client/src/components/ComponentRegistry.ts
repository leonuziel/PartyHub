// --- New Generic Components ---

// Layout
import { Container } from './primitives/layout/Container';
import { Grid } from './primitives/layout/Grid';
import { Spacer } from './primitives/layout/Spacer';
import { Stack } from './primitives/layout/Stack';

// Display
import { ImageDisplay } from './primitives/display/ImageDisplay';
import { KeyValueDisplay } from './primitives/display/KeyValueDisplay';
import { ListDisplay } from './primitives/display/ListDisplay';
import { TextDisplay } from './primitives/display/TextDisplay';

// Input
import { Button as NewButton } from './primitives/input/Button';
import { ChoiceSelector } from './primitives/input/ChoiceSelector';
import { Slider } from './primitives/input/Slider';
import { TextInput } from './primitives/input/TextInput';

// Feedback
import { StateIndicator } from './primitives/feedback/StateIndicator';
import { Timer } from './primitives/feedback/Timer';

// Game Tools
import { Card as NewCard } from './elements/Card';
import { CardContainer } from './elements/CardContainer';
import { Dice } from './elements/Dice';
import { GameBoard } from './elements/GameBoard';
import { GamePiece } from './elements/GamePiece';

// Patterns
import { PhaseBanner } from './patterns/gameplay/PhaseBanner';
import { DrawingCanvas } from './patterns/gameplay/DrawingCanvas';
import { RoleRevealCard } from './patterns/gameplay/RoleRevealCard';
import { WordGuesserInput } from './patterns/gameplay/WordGuesserInput';
import { SubmissionReel } from './patterns/gameplay/SubmissionReel';
import { AvatarCustomizer } from './patterns/lobby/AvatarCustomizer';
import { InstructionCarousel } from './patterns/lobby/InstructionCarousel';
import { ReadyCheckDisplay } from './patterns/lobby/ReadyCheckDisplay';
import { TeamSelectionGrid } from './patterns/lobby/TeamSelectionGrid';
import { CorrectAnswerOverlay } from './patterns/results/CorrectAnswerOverlay';
import { ScoreAccumulationBar } from './patterns/results/ScoreAccumulationBar';
import { VotingGrid } from './patterns/results/VotingGrid';
import { InGameNotification } from './patterns/meta/InGameNotification';
import { PlayerHandView } from './patterns/card_games/PlayerHandView';
import { CommunityCardsView } from './patterns/card_games/CommunityCardsView';
import { BiddingView } from './patterns/card_games/BiddingView';
import { HostQuestionView } from './patterns/host/HostQuestionView';
import { HostLeaderboardView } from './patterns/host/HostLeaderboardView';
import { HostResultView } from './patterns/host/HostResultView';
import { PlayerLobbyView } from './patterns/player/PlayerLobbyView';
import { PlayerAnswerView } from './patterns/player/PlayerAnswerView';
import { PlayerVotingView } from './patterns/player/PlayerVotingView';
import { PlayerResultView } from './patterns/player/PlayerResultView';
import { TurnOrderDisplay } from './patterns/gameplay/TurnOrderDisplay';
import { MatchupDisplay } from './patterns/gameplay/MatchupDisplay';
import { PersonalScoreCard } from './patterns/results/PersonalScoreCard';
import { FinalResultsScreen } from './patterns/results/FinalResultsScreen';
import { EmojiReactionToolbar } from './patterns/feedback/EmojiReactionToolbar';


// --- Old Components (for backward compatibility) ---

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


// This registry maps string names (used in the game config) to actual React components.
export const ComponentRegistry: Record<string, React.ComponentType<any>> = {
    // --- New Generic Components ---
    Container,
    Grid,
    Spacer,
    Stack,
    ImageDisplay,
    KeyValueDisplay,
    ListDisplay,
    TextDisplay,
    Button: NewButton,
    ChoiceSelector,
    Slider,
    TextInput,
    StateIndicator,
    Timer,
    Card: NewCard,
    CardContainer,
    Dice,
    GameBoard,
    GamePiece,
    PhaseBanner,
    AvatarCustomizer,
    ReadyCheckDisplay,
    SubmissionReel,
    VotingGrid,
    CorrectAnswerOverlay,
    ScoreAccumulationBar,
    InGameNotification,
    InstructionCarousel,
    TeamSelectionGrid,
    RoleRevealCard,
    DrawingCanvas,
    WordGuesserInput,
    PlayerHandView,
    CommunityCardsView,
    BiddingView,
    HostQuestionView,
    HostLeaderboardView,
    HostResultView,
    PlayerLobbyView,
    PlayerAnswerView,
    PlayerVotingView,
    PlayerResultView,
    TurnOrderDisplay,
    MatchupDisplay,
    PersonalScoreCard,
    FinalResultsScreen,
    EmojiReactionToolbar,


    // --- Old Components ---
    // Cards
    'BiddingPopup': BiddingPopup,
    'OldCard': Card, // Renamed to avoid conflict
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
    'OldButton': Button, // Renamed to avoid conflict
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
    'PlayerViewContainer': PlayerViewContainer
};
