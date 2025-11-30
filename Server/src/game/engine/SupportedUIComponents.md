# Supported UI Components

This document lists all available UI components that can be used in the game configuration (`ui` section).

## Layout Components

| Component | Properties | Description |
| :--- | :--- | :--- |
| **Container** | `children`, `display`, `flexDirection`, `gap`, `alignItems`, `justifyContent`, `layout` | A generic container for grouping other components. Supports Flexbox layout. |
| **Grid** | `columns`, `rows`, `spacing`, `children`, `layout` | A grid layout container. |
| **Stack** | `children`, `direction`, `spacing`, `layout` | A simplified container for stacking items vertically or horizontally. |
| **Spacer** | `layout` | An empty component used to create space between other components. |

## Display Components

| Component | Properties | Description |
| :--- | :--- | :--- |
| **TextDisplay** | `text`, `layout` | Displays static or dynamic text. |
| **ImageDisplay** | `src`, `alt`, `fit`, `layout` | Displays an image. |
| **ListDisplay** | `items`, `renderItem`, `layout` | Renders a list of items using a template. `items` is a template string (e.g., `{{players}}`). |
| **KeyValueDisplay** | `data`, `layout` | Displays key-value pairs from an object. |
| **TurnOrderDisplay** | `players`, `activePlayerId`, `layout` | Displays the order of turns and the active player. |
| **MatchupDisplay** | `player1`, `player2`, `matchupTitle`, `layout` | Displays a matchup between two players. |
| **PersonalScoreCard** | `player`, `scoreDetails`, `totalScore`, `layout` | Displays a detailed score card for a player. |
| **FinalResultsScreen** | `players`, `onPlayAgain`, `onExit`, `layout` | Displays the final results of the game. |

## Input & Controls

| Component | Properties | Description |
| :--- | :--- | :--- |
| **Button** | `text`, `icon`, `onClick`, `variant`, `disabled`, `layout` | A clickable button to trigger actions. |
| **ChoiceSelector** | `options`, `onSelect`, `selectionMode`, `layout`, `disabled` | Allows selecting one or more options from a list. |
| **TextInput** | `placeholder`, `maxLength`, `showCounter`, `onChange`, `multiline`, `layout` | A text input field. |
| **Slider** | `min`, `max`, `step`, `onChange`, `defaultValue`, `layout` | A slider control for selecting a numeric value. |
| **EmojiReactionToolbar** | `onReaction`, `allowedReactions`, `layout` | A toolbar for sending emoji reactions. |

## Feedback & State

| Component | Properties | Description |
| :--- | :--- | :--- |
| **Timer** | `duration`, `type`, `onComplete`, `label`, `layout` | Displays a countdown or progress timer. |
| **StateIndicator** | `status`, `indicator`, `layout` | Visual indicator of the current game state. |
| **PhaseBanner** | `title`, `subtitle`, `duration`, `onComplete`, `layout` | A banner to announce game phases. |
| **InGameNotification** | `message`, `type`, `duration`, `onComplete`, `layout` | Displays temporary notifications. |
| **ScoreAccumulationBar** | `initialScore`, `scoreChange`, `label`, `startDelay`, `onComplete`, `layout` | Visualizes score changes. |
| **CorrectAnswerOverlay** | `options`, `correctAnswerId`, `players`, `onComplete`, `layout` | Overlays correct answer information. |

## Game Tools

| Component | Properties | Description |
| :--- | :--- | :--- |
| **Card** | `faceUp`, `content`, `back`, `isSelectable`, `isSelected`, `onClick`, `layout` | Represents a playing card. |
| **CardContainer** | `layout`, `cards`, `onCardClick`, `selectedCardIds`, `layout` | A container for managing a collection of cards. |
| **Dice** | `count`, `values`, `isRolling`, `onRollComplete`, `layout` | Renders dice for rolling. |
| **GameBoard** | `size`, `onCellClick`, `children`, `layout` | A grid-based game board. |
| **GamePiece** | `shape`, `color`, `image`, `position`, `layout` | A piece on the game board. |
| **AvatarCustomizer** | `avatars`, `onSubmit`, `layout` | UI for customizing player avatars. |
| **ReadyCheckDisplay** | `players`, `isHost`, `currentPlayerId`, `onPlayerReadyToggle`, `onStartGame`, `layout` | Displays player readiness status. |
| **SubmissionReel** | `submissions`, `showAuthor`, `layout` | Displays a reel of player submissions. |
| **VotingGrid** | `options`, `onVote`, `disabled`, `layout` | A grid for voting on options. |
| **InstructionCarousel** | `slides`, `autoPlayInterval`, `layout` | Carousel for displaying instructions. |
| **TeamSelectionGrid** | `teams`, `players`, `isHost`, `onJoinTeam`, `onMovePlayer`, `layout` | UI for selecting teams. |
| **RoleRevealCard** | `roleName`, `roleDescription`, `roleImageUrl`, `onAcknowledge`, `layout` | Displays a player's role. |
| **DrawingCanvas** | `isReadOnly`, `drawingData`, `onDraw`, `layout` | A canvas for drawing. |
| **WordGuesserInput** | `wordLength`, `correctLetters`, `onGuess`, `layout` | Input for word guessing games. |
| **PlayerHandView** | `cards`, `onPlayCard`, `onDrawCard`, `onPass`, `selectedCardIds`, `layout` | View for a player's hand of cards. |
| **CommunityCardsView** | `cards`, `potSize`, `layout` | View for community cards (e.g., in Poker). |
| **BiddingView** | `currentBid`, `onBid`, `onCheck`, `onFold`, `layout` | UI for bidding. |

## Host Views

| Component | Properties | Description |
| :--- | :--- | :--- |
| **HostQuestionView** | `question`, `imageUrl`, `choices`, `players`, `timeLimit`, `layout` | Host view for displaying a question. |
| **HostLeaderboardView** | `players`, `layout` | Host view for the leaderboard. |
| **HostResultView** | `question`, `options`, `correctAnswerId`, `players`, `winner`, `layout` | Host view for results. |

## Player Views

| Component | Properties | Description |
| :--- | :--- | :--- |
| **PlayerLobbyView** | `onReady`, `isReady`, `layout` | Player view for the lobby. |
| **PlayerAnswerView** | `questionType`, `prompt`, `options`, `onAnswer`, `layout` | Player view for answering questions. |
| **PlayerVotingView** | `prompt`, `options`, `onVote`, `layout` | Player view for voting. |
| **PlayerResultView** | `isCorrect`, `pointsEarned`, `oldRank`, `newRank`, `layout` | Player view for results. |

## Legacy Components

| Component | Properties | Description |
| :--- | :--- | :--- |
| **DebugPanel** | `layout` | Debugging tools. |
| **ActionButton** | `children`, `variant`, `layout` | Legacy button. |
| **OldButton** | `children`, `variant`, `layout` | Legacy button. |
| **AnswerGrid** | `answers`, `onAnswer`, `disabled`, `selectedAnswer`, `fillParent`, `layout` | Legacy answer grid. |
| **GameCard** | `title`, `description`, `playerCount`, `playtime`, `imageUrl`, `onClick`, `layout` | Legacy game card. |
| **TextAreaWithCounter** | `maxLength`, `placeholder`, `onChange`, `layout` | Legacy text area. |
| **VotingOptions** | `options`, `onVote`, `disabled`, `layout` | Legacy voting options. |
| **AnswerResult** | `answer`, `percentage`, `isCorrect`, `layout` | Legacy answer result. |
| **AwardDisplay** | `award`, `description`, `layout` | Legacy award display. |
| **GameBranding** | `gameTitle`, `logoUrl`, `layout` | Legacy branding. |
| **GameTitle** | `title`, `children`, `layout` | Legacy title. |
| **Leaderboard** | `players`, `layout` | Legacy leaderboard. |
| **PlayerAvatar** | `player`, `size`, `layout` | Legacy avatar. |
| **PlayerCard** | `player`, `size`, `layout` | Legacy player card. |
| **PlayerInfo** | `player`, `isCurrent`, `isDealer`, `isSmallBlind`, `isBigBlind`, `layout` | Legacy player info. |
| **PlayerStatusContainer** | `title`, `subtitle`, `layout` | Legacy status container. |
| **PlayerStatusGrid** | `players`, `layout` | Legacy status grid. |
| **Podium** | `players`, `layout` | Legacy podium. |
| **PodiumList** | `players`, `count`, `layout` | Legacy podium list. |
| **QuestionDisplay** | `question`, `text`, `layout` | Legacy question display. |
| **QuestionHeader** | `text`, `round`, `totalRounds`, `timer`, `answeredCount`, `totalPlayers`, `layout` | Legacy question header. |
| **RankDisplay** | `rank`, `layout` | Legacy rank display. |
| **RankUpdate** | `oldRank`, `newRank`, `layout` | Legacy rank update. |
| **ResultsList** | `options`, `votes`, `correctAnswer`, `players`, `layout` | Legacy results list. |
| **SpecialAwards** | `awards`, `layout` | Legacy special awards. |
| **WinnerDisplay** | `winnerName`, `winner`, `layout` | Legacy winner display. |
| **CountdownTimer** | `initialValue`, `onComplete`, `layout` | Legacy countdown timer. |
| **CenteredMessage** | `children`, `message`, `layout` | Legacy centered message. |
| **HostFrame** | `layout` | Legacy host frame. |
| **HostViewContainer** | `layout` | Legacy host view container. |
| **PlayArea** | `layout` | Legacy play area. |
| **PlayerViewContainer** | `layout` | Legacy player view container. |
| **BiddingPopup** | `onBid`, `onPass`, `layout` | Legacy bidding popup. |
| **OldCard** | `faceUp`, `content`, `className`, `layout` | Legacy card. |
| **CardFan** | `cards`, `layout` | Legacy card fan. |
| **CardSlot** | `card`, `onClick`, `isFaceUp`, `layout` | Legacy card slot. |
| **Deck** | `count`, `onDraw`, `layout` | Legacy deck. |
| **DiscardPile** | `topCard`, `layout` | Legacy discard pile. |
| **Hand** | `cards`, `onCardClick`, `layout` | Legacy hand. |
| **LastPlayedCard** | `card`, `layout` | Legacy last played card. |
| **Meld** | `cards`, `layout` | Legacy meld. |
| **PlayerHandDisplay** | `cardCount`, `playerName`, `layout` | Legacy player hand display. |
| **Scoreboard** | `scores`, `layout` | Legacy scoreboard. |
| **Trick** | `cards`, `layout` | Legacy trick. |
| **TrumpIndicator** | `suit`, `layout` | Legacy trump indicator. |
| **Modal** | `isOpen`, `onClose`, `children`, `layout` | Legacy modal. |
| **Spinner** | `layout` | Legacy spinner. |

## Common Properties

All components support the `layout` property, which controls their positioning and sizing.

### Layout Schema
```json
{
  "width": "string (e.g., '100%', '50%', 'fill', 'hug')",
  "height": "string (e.g., '100%', 'fill', 'hug')",
  "alignment": "enum ('TopLeft', 'Center', 'BottomRight', etc.)",
  "padding": { "top": number, "bottom": number, "left": number, "right": number },
  "offset": { "top": number, "bottom": number, "left": number, "right": number }
}
```

### Base Styling
Most components also support basic styling properties:
- `fontSize`
- `fontWeight`
- `fontFamily`
- `color`
- `textAlign`
- `backgroundColor`
- `padding`
- `borderRadius`
- `border`
- `style` (custom CSS styles)
