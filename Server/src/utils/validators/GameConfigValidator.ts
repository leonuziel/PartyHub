import { z } from 'zod';

// Prop schemas for each component, based on components.md and existing configs.
// Props that receive dynamic data from game state (e.g., arrays of players, question text)
// are typed as `z.string()` because they will be template strings like "{{players}}".

// Defines the new structured format for UI actions, allowing for an optional payload.
const uiActionObjectSchema = z.object({
  action: z.string(),
  payload: z.any().optional(),
});

// An action can be either the new structured object or the legacy string format.
const uiActionSchema = z.union([uiActionObjectSchema, z.string()]);

const baseStylingProps = z.object({
  fontSize: z.string().optional(),
  fontWeight: z.string().optional(),
  fontFamily: z.string().optional(),
  color: z.string().optional(),
  textAlign: z.enum(['left', 'center', 'right', 'justify']).optional(),
  backgroundColor: z.string().optional(),
  padding: z.string().optional(),
  borderRadius: z.string().optional(),
  border: z.string().optional(),
  style: z.record(z.any()).optional(),
});


const DebugPanelProps = z.object({}).passthrough();
const ButtonProps = z.object({
  children: z.string(),
  variant: z.enum(['primary', 'secondary']).optional(),
}).passthrough();
const ActionButtonProps = ButtonProps;
const AnswerGridProps = z.object({
  answers: z.string(),
  onAnswer: uiActionSchema,
  disabled: z.union([z.boolean(), z.string()]).optional(),
  selectedAnswer: z.any().optional(),
  fillParent: z.boolean().optional(),
}).passthrough();
const GameCardProps = z.object({
  title: z.string(),
  description: z.string(),
  playerCount: z.string(),
  playtime: z.string(),
  imageUrl: z.string(),
  onClick: uiActionSchema,
}).passthrough();
const TextAreaWithCounterProps = z.object({
  maxLength: z.number(),
  placeholder: z.string().optional(),
  onChange: uiActionSchema,
}).passthrough();
const VotingOptionsProps = z.object({
  options: z.string(),
  onVote: uiActionSchema.optional(),
  disabled: z.union([z.boolean(), z.string()]).optional(),
}).passthrough();
const AnswerResultProps = z.object({
  answer: z.string(),
  percentage: z.any(),
  isCorrect: z.any(),
}).passthrough();
const AwardDisplayProps = z.object({
  award: z.string(),
  description: z.string().optional(),
}).passthrough();
const GameBrandingProps = z.object({
  gameTitle: z.string(),
  logoUrl: z.string().optional(),
}).passthrough();
const GameTitleProps = z.object({
  title: z.string().optional(),
  children: z.string().optional(),
}).passthrough();
const LeaderboardProps = z.object({
  players: z.string(),
}).passthrough();
const PlayerAvatarProps = z.object({
  player: z.string(),
  size: z.enum(['small', 'medium', 'large']).optional(),
}).passthrough();
const PlayerCardProps = z.object({
  player: z.string(),
  size: z.enum(['small', 'medium', 'large']).optional(),
}).passthrough();
const PlayerInfoProps = z.object({
  player: z.string(),
  isCurrent: z.boolean().optional(),
  isDealer: z.boolean().optional(),
  isSmallBlind: z.boolean().optional(),
  isBigBlind: z.boolean().optional(),
}).passthrough();
const PlayerStatusContainerProps = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
}).passthrough();
const PlayerStatusGridProps = z.object({
  players: z.string(),
}).passthrough();
const PodiumProps = z.object({
  players: z.string(),
}).passthrough();
const PodiumListProps = z.object({
  players: z.string(),
  count: z.number().optional(),
}).passthrough();
const QuestionDisplayProps = z.object({
  question: z.string().optional(), // `question` is used in quizclash.json
  text: z.string().optional(),
}).passthrough();
const QuestionHeaderProps = z.object({
  text: z.string().optional(), // `text` is used in quizclash.json
  round: z.any().optional(),
  totalRounds: z.any().optional(),
  timer: z.any().optional(),
  answeredCount: z.any().optional(),
  totalPlayers: z.any().optional(),
}).passthrough();
const RankDisplayProps = z.object({
  rank: z.any(),
}).passthrough();
const RankUpdateProps = z.object({
  oldRank: z.any().optional(),
  newRank: z.any(),
}).passthrough();
const ResultsListProps = z.object({
  options: z.string(),
  votes: z.string(),
  correctAnswer: z.string(),
  players: z.string(),
}).passthrough();
const SpecialAwardsProps = z.object({
  awards: z.string(),
}).passthrough();
const WinnerDisplayProps = z.object({
  winnerName: z.string().optional(), // `winnerName` is used in quizclash.json
  winner: z.string().optional(),
}).passthrough();
const CountdownTimerProps = z.object({
  initialValue: z.number().optional(),
  onComplete: uiActionSchema.optional(),
}).passthrough();
const CenteredMessageProps = z.object({
  children: z.string().optional(),
  message: z.string().optional(),
}).passthrough();
const HostFrameProps = z.object({}).passthrough();
const HostViewContainerProps = z.object({}).passthrough();
const PlayAreaProps = z.object({}).passthrough();
const PlayerViewContainerProps = z.object({}).passthrough();
const BiddingPopupProps = z.object({ onBid: uiActionSchema, onPass: uiActionSchema }).passthrough();
const CardProps = z.object({ faceUp: z.boolean().optional(), content: z.any().optional(), className: z.string().optional() }).passthrough();
const CardFanProps = z.object({ cards: z.string() }).passthrough();
const CardSlotProps = z.object({ card: z.string().optional(), onClick: uiActionSchema.optional(), isFaceUp: z.union([z.boolean(), z.string()]).optional() }).passthrough();
const DeckProps = z.object({ count: z.any(), onDraw: uiActionSchema.optional() }).passthrough();
const DiscardPileProps = z.object({ topCard: z.string().optional() }).passthrough();
const HandProps = z.object({ cards: z.string(), onCardClick: uiActionSchema.optional() }).passthrough();
const LastPlayedCardProps = z.object({ card: z.string() }).passthrough();
const MeldProps = z.object({ cards: z.string() }).passthrough();
const PlayerHandDisplayProps = z.object({ cardCount: z.any(), playerName: z.string() }).passthrough();
const ScoreboardProps = z.object({ scores: z.string() }).passthrough();
const TrickProps = z.object({ cards: z.string() }).passthrough();
const TrumpIndicatorProps = z.object({ suit: z.string() }).passthrough();
const ModalProps = z.object({ isOpen: z.union([z.boolean(), z.string()]), onClose: uiActionSchema.optional(), children: z.any() }).passthrough();
const SpinnerProps = z.object({}).passthrough();

// --- New Generic Component Schemas ---

// Layout
const ContainerProps = baseStylingProps.extend({
  children: z.any(), // In config, children will be other components, handled by renderer
  display: z.enum(['flex', 'grid']).optional(),
  flexDirection: z.enum(['row', 'column']).optional(),
  gap: z.number().optional(),
  alignItems: z.string().optional(),
  justifyContent: z.string().optional(),
}).passthrough();

const GridProps = baseStylingProps.extend({
  columns: z.number().optional(),
  rows: z.number().optional(),
  spacing: z.number().optional(),
}).passthrough();

const SpacerProps = baseStylingProps.extend({
  // Spacer has no props in the config
}).passthrough();

const StackProps = baseStylingProps.extend({
  children: z.any(),
  direction: z.enum(['vertical', 'horizontal']).optional(),
  spacing: z.number().optional(),
}).passthrough();

// Display
const TextDisplayProps = baseStylingProps.extend({
  text: z.string(),
}).passthrough();

const ImageDisplayProps = baseStylingProps.extend({
  src: z.string(),
  alt: z.string(),
  fit: z.enum(['cover', 'contain', 'fill']).optional(),
}).passthrough();

const ListDisplayProps = baseStylingProps.extend({
  items: z.string(), // Template variable like "{{players}}"
  renderItem: z.any(), // A template component definition
}).passthrough();

const KeyValueDisplayProps = baseStylingProps.extend({
  data: z.string(), // Template variable like "{{player.stats}}"
  layout: z.enum(['horizontal', 'vertical']).optional(),
}).passthrough();

// Input & Controls
const NewButtonProps = baseStylingProps.extend({
  text: z.string().optional(),
  icon: z.string().optional(),
  onClick: uiActionSchema.optional(),
  variant: z.enum(['primary', 'secondary']).optional(),
  disabled: z.union([z.boolean(), z.string()]).optional(),
}).passthrough();

const ChoiceSelectorProps = baseStylingProps.extend({
  options: z.string(), // template variable
  onSelect: uiActionSchema.optional(),
  selectionMode: z.enum(['single', 'multiple']).optional(),
  layout: z.enum(['grid', 'list', 'carousel']).optional(),
  disabled: z.union([z.boolean(), z.string()]).optional(),
}).passthrough();

const TextInputProps = baseStylingProps.extend({
  placeholder: z.string().optional(),
  maxLength: z.number().optional(),
  showCounter: z.boolean().optional(),
  onChange: uiActionSchema.optional(),
  multiline: z.boolean().optional(),
}).passthrough();

const SliderProps = baseStylingProps.extend({
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  onChange: uiActionSchema.optional(),
  defaultValue: z.number().optional(),
}).passthrough();

// Feedback & State
const TimerProps = baseStylingProps.extend({
  duration: z.number(),
  type: z.enum(['countdown', 'progress']).optional(),
  onComplete: uiActionSchema.optional(),
  label: z.string().optional(),
}).passthrough();

const StateIndicatorProps = baseStylingProps.extend({
  status: z.string(), // template variable
  indicator: z.enum(['icon', 'text', 'color']).optional(),
}).passthrough();

// Game Tools
const NewCardProps = baseStylingProps.extend({
  faceUp: z.union([z.boolean(), z.string()]).optional(),
  content: z.any().optional(), // Can be complex, allow anything for now
  back: z.any().optional(),
  isSelectable: z.union([z.boolean(), z.string()]).optional(),
  isSelected: z.union([z.boolean(), z.string()]).optional(),
  onClick: uiActionSchema.optional(),
}).passthrough();

const CardContainerProps = baseStylingProps.extend({
  layout: z.enum(['fan', 'grid', 'stack', 'pile']).optional(),
  cards: z.string(), // template variable
  onCardClick: uiActionSchema.optional(),
  selectedCardIds: z.string().optional(), // template variable
}).passthrough();

const DiceProps = baseStylingProps.extend({
  count: z.number().optional(),
  values: z.union([
    z.string(), // For template variables like "{{gameState.dice}}"
    z.array(z.number()) // For hardcoded values like [1, 6]
  ]).optional(),
  isRolling: z.union([z.boolean(), z.string()]).optional(),
  onRollComplete: uiActionSchema.optional(),
}).passthrough();

const GameBoardProps = baseStylingProps.extend({
  size: z.object({ rows: z.number(), cols: z.number() }),
  onCellClick: uiActionSchema.optional(),
  children: z.any(),
}).passthrough();

const GamePieceProps = baseStylingProps.extend({
  shape: z.enum(['circle', 'square']).optional(),
  color: z.string().optional(),
  image: z.string().optional(),
  position: z.object({ row: z.number(), col: z.number() }).optional(),
}).passthrough();

const PhaseBannerProps = baseStylingProps.extend({
  title: z.string(),
  subtitle: z.string().optional(),
  duration: z.number().optional(),
  onComplete: uiActionSchema.optional(),
}).passthrough();

const AvatarCustomizerProps = baseStylingProps.extend({
  avatars: z.string(), // Expect a template variable like "{{gameData.avatars}}"
  onSubmit: uiActionSchema,
}).passthrough();

const ReadyCheckDisplayProps = baseStylingProps.extend({
  players: z.string(), // Expect a template variable like "{{players}}"
  isHost: z.union([z.boolean(), z.string()]), // Can be a boolean or a template variable like "{{player.isHost}}"
  currentPlayerId: z.string().optional(), // Expect a template variable like "{{player.id}}"
  onPlayerReadyToggle: uiActionSchema,
  onStartGame: uiActionSchema,
}).passthrough();

const SubmissionReelProps = baseStylingProps.extend({
  submissions: z.string(), // Expect a template variable like "{{gameState.submissions}}"
  showAuthor: z.union([z.boolean(), z.string()]),
}).passthrough();

const VotingGridProps = baseStylingProps.extend({
  options: z.string(), // Expect a template variable like "{{gameState.submissions}}"
  onVote: uiActionSchema,
  disabled: z.union([z.boolean(), z.string()]).optional(),
}).passthrough();

const CorrectAnswerOverlayProps = baseStylingProps.extend({
  options: z.string(), // template variable
  correctAnswerId: z.string(), // template variable
  players: z.string(), // template variable
  onComplete: uiActionSchema.optional(),
}).passthrough();

const ScoreAccumulationBarProps = baseStylingProps.extend({
  initialScore: z.number(),
  scoreChange: z.number(),
  label: z.string(),
  startDelay: z.number().optional(),
  onComplete: uiActionSchema.optional(),
}).passthrough();

const InGameNotificationProps = baseStylingProps.extend({
  message: z.string(),
  type: z.enum(['info', 'warning', 'success']).optional(),
  duration: z.number().optional(),
  onComplete: uiActionSchema.optional(),
}).passthrough();

const InstructionCarouselProps = baseStylingProps.extend({
  slides: z.string(), // Expect a template variable like "{{gameData.instructions}}"
  autoPlayInterval: z.number().optional(),
}).passthrough();

const TeamSelectionGridProps = baseStylingProps.extend({
  teams: z.string(), // Expect a template variable like "{{gameState.teams}}"
  players: z.string(), // Expect a template variable like "{{gameState.unassignedPlayers}}"
  isHost: z.union([z.boolean(), z.string()]),
  onJoinTeam: uiActionSchema,
  onMovePlayer: uiActionSchema,
}).passthrough();

const RoleRevealCardProps = baseStylingProps.extend({
  roleName: z.string(),
  roleDescription: z.string(),
  roleImageUrl: z.string().optional(),
  onAcknowledge: uiActionSchema,
}).passthrough();

const DrawingCanvasProps = baseStylingProps.extend({
  isReadOnly: z.union([z.boolean(), z.string()]),
  drawingData: z.string().optional(), // Expect a template variable
  onDraw: uiActionSchema,
}).passthrough();

const WordGuesserInputProps = baseStylingProps.extend({
  wordLength: z.number(),
  correctLetters: z.string(), // Expect a template variable like "{{gameState.correctLetters}}"
  onGuess: uiActionSchema,
}).passthrough();

const PlayerHandViewProps = baseStylingProps.extend({
  cards: z.string(),
  onPlayCard: uiActionSchema,
  onDrawCard: uiActionSchema,
  onPass: uiActionSchema,
  selectedCardIds: z.string(),
}).passthrough();

const CommunityCardsViewProps = baseStylingProps.extend({
  cards: z.string(),
  potSize: z.number().optional(),
}).passthrough();

const BiddingViewProps = baseStylingProps.extend({
  currentBid: z.number(),
  onBid: uiActionSchema,
  onCheck: uiActionSchema,
  onFold: uiActionSchema,
}).passthrough();

const HostQuestionViewProps = baseStylingProps.extend({
  question: z.string(),
  imageUrl: z.string().optional(),
  choices: z.string(),
  players: z.string(),
  timeLimit: z.number(),
}).passthrough();

const HostLeaderboardViewProps = baseStylingProps.extend({
  players: z.string(),
}).passthrough();

const HostResultViewProps = baseStylingProps.extend({
  question: z.string(),
  options: z.string(),
  correctAnswerId: z.string(),
  players: z.string(),
  winner: z.string().optional(),
}).passthrough();

const PlayerLobbyViewProps = baseStylingProps.extend({
  onReady: uiActionSchema,
  isReady: z.union([z.boolean(), z.string()]),
}).passthrough();

const PlayerAnswerViewProps = baseStylingProps.extend({
  questionType: z.enum(['multiple-choice', 'text']),
  prompt: z.string().optional(),
  options: z.string().optional(),
  onAnswer: uiActionSchema,
}).passthrough();

const PlayerVotingViewProps = baseStylingProps.extend({
  prompt: z.string(),
  options: z.string(),
  onVote: uiActionSchema,
}).passthrough();

const PlayerResultViewProps = baseStylingProps.extend({
  isCorrect: z.union([z.boolean(), z.string()]),
  pointsEarned: z.number(),
  oldRank: z.number(),
  newRank: z.number(),
}).passthrough();

const TurnOrderDisplayProps = baseStylingProps.extend({
  players: z.string(),
  activePlayerId: z.string(),
}).passthrough();

const MatchupDisplayProps = baseStylingProps.extend({
  player1: z.string(),
  player2: z.string(),
  matchupTitle: z.string().optional(),
}).passthrough();

const PersonalScoreCardProps = baseStylingProps.extend({
  player: z.string(),
  scoreDetails: z.string(),
  totalScore: z.number(),
}).passthrough();

const FinalResultsScreenProps = baseStylingProps.extend({
  players: z.string(),
  onPlayAgain: uiActionSchema,
  onExit: uiActionSchema,
}).passthrough();

const EmojiReactionToolbarProps = baseStylingProps.extend({
  onReaction: uiActionSchema,
  allowedReactions: z.array(z.string()).optional(),
}).passthrough();


// --- New schemas for layout properties based on ui_layout_config_plan.md ---

const spacingSchema = z.object({
  top: z.number().optional(),
  bottom: z.number().optional(),
  left: z.number().optional(),
  right: z.number().optional(),
}).passthrough();

const sizeRegex = /^(\d+(\.\d+)?%|fill|hug)$/;

const layoutSchema = z.object({
  width: z.string().regex(sizeRegex).optional(),
  height: z.string().regex(sizeRegex).optional(),
  alignment: z.enum([
    'TopLeft', 'TopCenter', 'TopRight',
    'MiddleLeft', 'Center', 'MiddleRight',
    'BottomLeft', 'BottomCenter', 'BottomRight'
  ]).optional(),
  padding: spacingSchema.optional(),
  offset: spacingSchema.optional(), // Corresponds to margin
}).passthrough();

// Discriminated union to validate props based on the component name
const componentSchema: z.ZodType<any> = z.lazy(() => z.discriminatedUnion('component', [
  // New Generic Components
  z.object({ component: z.literal('Container'), props: ContainerProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('Grid'), props: GridProps, layout: layoutSchema.optional(), children: z.array(componentSchema).optional() }),
  z.object({ component: z.literal('Spacer'), props: SpacerProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('Stack'), props: StackProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('TextDisplay'), props: TextDisplayProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('ImageDisplay'), props: ImageDisplayProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('ListDisplay'), props: ListDisplayProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('KeyValueDisplay'), props: KeyValueDisplayProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('Button'), props: NewButtonProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('ChoiceSelector'), props: ChoiceSelectorProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('TextInput'), props: TextInputProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('Slider'), props: SliderProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('Timer'), props: TimerProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('StateIndicator'), props: StateIndicatorProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('Card'), props: NewCardProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('CardContainer'), props: CardContainerProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('Dice'), props: DiceProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('GameBoard'), props: GameBoardProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('GamePiece'), props: GamePieceProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('PhaseBanner'), props: PhaseBannerProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('AvatarCustomizer'), props: AvatarCustomizerProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('ReadyCheckDisplay'), props: ReadyCheckDisplayProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('SubmissionReel'), props: SubmissionReelProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('VotingGrid'), props: VotingGridProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('CorrectAnswerOverlay'), props: CorrectAnswerOverlayProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('ScoreAccumulationBar'), props: ScoreAccumulationBarProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('InGameNotification'), props: InGameNotificationProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('InstructionCarousel'), props: InstructionCarouselProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('TeamSelectionGrid'), props: TeamSelectionGridProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('RoleRevealCard'), props: RoleRevealCardProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('DrawingCanvas'), props: DrawingCanvasProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('WordGuesserInput'), props: WordGuesserInputProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('PlayerHandView'), props: PlayerHandViewProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('CommunityCardsView'), props: CommunityCardsViewProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('BiddingView'), props: BiddingViewProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('HostQuestionView'), props: HostQuestionViewProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('HostLeaderboardView'), props: HostLeaderboardViewProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('HostResultView'), props: HostResultViewProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('PlayerLobbyView'), props: PlayerLobbyViewProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('PlayerAnswerView'), props: PlayerAnswerViewProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('PlayerVotingView'), props: PlayerVotingViewProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('PlayerResultView'), props: PlayerResultViewProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('TurnOrderDisplay'), props: TurnOrderDisplayProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('MatchupDisplay'), props: MatchupDisplayProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('PersonalScoreCard'), props: PersonalScoreCardProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('FinalResultsScreen'), props: FinalResultsScreenProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('EmojiReactionToolbar'), props: EmojiReactionToolbarProps, layout: layoutSchema.optional() }),

  // Old Components
  z.object({ component: z.literal('DebugPanel'), props: DebugPanelProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('ActionButton'), props: ActionButtonProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('OldButton'), props: ButtonProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('AnswerGrid'), props: AnswerGridProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('GameCard'), props: GameCardProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('TextAreaWithCounter'), props: TextAreaWithCounterProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('VotingOptions'), props: VotingOptionsProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('AnswerResult'), props: AnswerResultProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('AwardDisplay'), props: AwardDisplayProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('GameBranding'), props: GameBrandingProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('GameTitle'), props: GameTitleProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('Leaderboard'), props: LeaderboardProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('PlayerAvatar'), props: PlayerAvatarProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('PlayerCard'), props: PlayerCardProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('PlayerInfo'), props: PlayerInfoProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('PlayerStatusContainer'), props: PlayerStatusContainerProps, layout: layoutSchema.default({}) }),
  z.object({ component: z.literal('PlayerStatusGrid'), props: PlayerStatusGridProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('Podium'), props: PodiumProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('PodiumList'), props: PodiumListProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('QuestionDisplay'), props: QuestionDisplayProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('QuestionHeader'), props: QuestionHeaderProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('RankDisplay'), props: RankDisplayProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('RankUpdate'), props: RankUpdateProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('ResultsList'), props: ResultsListProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('SpecialAwards'), props: SpecialAwardsProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('WinnerDisplay'), props: WinnerDisplayProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('CountdownTimer'), props: CountdownTimerProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('CenteredMessage'), props: CenteredMessageProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('HostFrame'), props: HostFrameProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('HostViewContainer'), props: HostViewContainerProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('PlayArea'), props: PlayAreaProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('PlayerViewContainer'), props: PlayerViewContainerProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('BiddingPopup'), props: BiddingPopupProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('OldCard'), props: CardProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('CardFan'), props: CardFanProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('CardSlot'), props: CardSlotProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('Deck'), props: DeckProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('DiscardPile'), props: DiscardPileProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('Hand'), props: HandProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('LastPlayedCard'), props: LastPlayedCardProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('Meld'), props: MeldProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('PlayerHandDisplay'), props: PlayerHandDisplayProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('Scoreboard'), props: ScoreboardProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('Trick'), props: TrickProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('TrumpIndicator'), props: TrumpIndicatorProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('Modal'), props: ModalProps, layout: layoutSchema.optional() }),
  z.object({ component: z.literal('Spinner'), props: SpinnerProps, layout: layoutSchema.optional() }),
]));

// Define the conditional view schema separately for clarity and robust type inference.
const conditionalUIViewSchema = z.object({
  condition: z.string().optional(),
  components: z.array(componentSchema),
  layout: layoutSchema.optional(), // Allow layout settings on the conditional view itself
});

const uiSchema = z.record(z.object({
  host: z.object({
    components: z.array(componentSchema),
    layout: layoutSchema.optional(), // Allow layout settings on the host view
  }).optional(),
  // Player's UI can be a simple component list or an array of conditional views
  player: z.union([
    z.object({
      components: z.array(componentSchema),
      layout: layoutSchema.optional(), // Allow layout settings on the simple player view
    }),
    z.array(conditionalUIViewSchema), // Array of conditional views
  ]).optional(),
}));

const baseEffectSchema = z.object({
  condition: z.string().optional(),
});

// Define a placeholder for the recursive schema
const effectSchema: z.ZodType<any> = z.lazy(() =>
  z.union([
    runActionSchema,
    forEachPlayerSchema,
    functionEffectSchema,
  ])
);

// Define schemas for each type of effect
const runActionSchema = baseEffectSchema.extend({
  runAction: z.string(),
});

const forEachPlayerSchema = baseEffectSchema.extend({
  forEachPlayer: z.object({
    effects: z.array(effectSchema),
    as: z.string().optional(),
  }),
});

// Define a schema for each possible function call
const functionEffectSchema = z.discriminatedUnion('function', [
  baseEffectSchema.extend({ function: z.literal('setProperty'), args: z.tuple([z.string(), z.any()]) }),
  baseEffectSchema.extend({ function: z.literal('unsetProperty'), args: z.tuple([z.string()]) }),
  baseEffectSchema.extend({ function: z.literal('incrementProperty'), args: z.union([z.tuple([z.string()]), z.tuple([z.string(), z.any()])]) }),
  baseEffectSchema.extend({ function: z.literal('calculateWinner'), args: z.tuple([]).optional() }),
  baseEffectSchema.extend({ function: z.literal('shuffleArray'), args: z.tuple([z.string()]) }),
  baseEffectSchema.extend({ function: z.literal('arrayPush'), args: z.tuple([z.string(), z.any()]) }),
  baseEffectSchema.extend({ function: z.literal('arrayClear'), args: z.tuple([z.string()]) }),
  baseEffectSchema.extend({ function: z.literal('arraySortBy'), args: z.tuple([z.string(), z.string(), z.enum(['asc', 'desc']).optional()]) }),
  baseEffectSchema.extend({ function: z.literal('dispatchEvent'), args: z.tuple([z.string()]) }),
  baseEffectSchema.extend({ function: z.literal('cancelTimer'), args: z.tuple([]).optional() }),
  baseEffectSchema.extend({ function: z.literal('recordEvent'), args: z.tuple([z.string(), z.string()]) }),
  baseEffectSchema.extend({ function: z.literal('startTimer'), args: z.tuple([z.number(), effectSchema]) }),
]);

const stateSchema = z.object({
  onEnter: z.array(effectSchema).optional(),
  allowedEvents: z.array(z.string()).optional(),
});

const gameEventSchema = z.object({
  permissions: z.array(z.enum(['host', 'player', 'server'])),
  effects: z.array(effectSchema).optional(),
});

const gameTransitionSchema = z.object({
  from: z.string(),
  to: z.string(),
  event: z.string(),
  condition: z.string().optional(),
  effects: z.array(effectSchema).optional(),
});

export const gameConfigurationSchema = z.object({
  metadata: z.object({
    gameId: z.string(),
    title: z.string(),
    description: z.string(),
    minPlayers: z.number(),
    maxPlayers: z.number(),
  }),
  gameData: z.record(z.any()),
  initialGameState: z.record(z.any()),
  playerAttributes: z.record(z.any()),
  actions: z.record(z.array(effectSchema)),
  initialState: z.string(),
  states: z.record(stateSchema),
  events: z.record(gameEventSchema),
  transitions: z.array(gameTransitionSchema),
  ui: uiSchema,
});

export type GameConfiguration = z.infer<typeof gameConfigurationSchema>;
export type UIComponent = z.infer<typeof componentSchema>;
export type ConditionalUIView = z.infer<typeof conditionalUIViewSchema>;

export const validateGameConfiguration = (config: any) => {
  return gameConfigurationSchema.safeParse(config);
};
