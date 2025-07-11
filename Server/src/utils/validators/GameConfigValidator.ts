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


const DebugPanelProps = z.object({}).passthrough();
const ButtonProps = z.object({
  children: z.string(),
  variant: z.enum(['primary', 'secondary']).optional(),
}).passthrough();
const ActionButtonProps = ButtonProps;
const AnswerGridProps = z.object({
  answers: z.string(),
  onAnswer: uiActionSchema,
  disabled: z.boolean().optional(),
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
  disabled: z.boolean().optional(),
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
const CardSlotProps = z.object({ card: z.string().optional(), onClick: uiActionSchema.optional(), isFaceUp: z.boolean().optional() }).passthrough();
const DeckProps = z.object({ count: z.any(), onDraw: uiActionSchema.optional() }).passthrough();
const DiscardPileProps = z.object({ topCard: z.string().optional() }).passthrough();
const HandProps = z.object({ cards: z.string(), onCardClick: uiActionSchema.optional() }).passthrough();
const LastPlayedCardProps = z.object({ card: z.string() }).passthrough();
const MeldProps = z.object({ cards: z.string() }).passthrough();
const PlayerHandDisplayProps = z.object({ cardCount: z.any(), playerName: z.string() }).passthrough();
const ScoreboardProps = z.object({ scores: z.string() }).passthrough();
const TrickProps = z.object({ cards: z.string() }).passthrough();
const TrumpIndicatorProps = z.object({ suit: z.string() }).passthrough();
const ModalProps = z.object({ isOpen: z.boolean(), onClose: z.string(), children: z.any() }).passthrough();
const SpinnerProps = z.object({}).passthrough();

// Discriminated union to validate props based on the component name
const componentSchema = z.discriminatedUnion('component', [
  z.object({ component: z.literal('DebugPanel'), props: DebugPanelProps }),
  z.object({ component: z.literal('ActionButton'), props: ActionButtonProps }),
  z.object({ component: z.literal('Button'), props: ButtonProps }),
  z.object({ component: z.literal('AnswerGrid'), props: AnswerGridProps }),
  z.object({ component: z.literal('GameCard'), props: GameCardProps }),
  z.object({ component: z.literal('TextAreaWithCounter'), props: TextAreaWithCounterProps }),
  z.object({ component: z.literal('VotingOptions'), props: VotingOptionsProps }),
  z.object({ component: z.literal('AnswerResult'), props: AnswerResultProps }),
  z.object({ component: z.literal('AwardDisplay'), props: AwardDisplayProps }),
  z.object({ component: z.literal('GameBranding'), props: GameBrandingProps }),
  z.object({ component: z.literal('GameTitle'), props: GameTitleProps }),
  z.object({ component: z.literal('Leaderboard'), props: LeaderboardProps }),
  z.object({ component: z.literal('PlayerAvatar'), props: PlayerAvatarProps }),
  z.object({ component: z.literal('PlayerCard'), props: PlayerCardProps }),
  z.object({ component: z.literal('PlayerInfo'), props: PlayerInfoProps }),
  z.object({ component: z.literal('PlayerStatusContainer'), props: PlayerStatusContainerProps }),
  z.object({ component: z.literal('PlayerStatusGrid'), props: PlayerStatusGridProps }),
  z.object({ component: z.literal('Podium'), props: PodiumProps }),
  z.object({ component: z.literal('PodiumList'), props: PodiumListProps }),
  z.object({ component: z.literal('QuestionDisplay'), props: QuestionDisplayProps }),
  z.object({ component: z.literal('QuestionHeader'), props: QuestionHeaderProps }),
  z.object({ component: z.literal('RankDisplay'), props: RankDisplayProps }),
  z.object({ component: z.literal('RankUpdate'), props: RankUpdateProps }),
  z.object({ component: z.literal('ResultsList'), props: ResultsListProps }),
  z.object({ component: z.literal('SpecialAwards'), props: SpecialAwardsProps }),
  z.object({ component: z.literal('WinnerDisplay'), props: WinnerDisplayProps }),
  z.object({ component: z.literal('CountdownTimer'), props: CountdownTimerProps }),
  z.object({ component: z.literal('CenteredMessage'), props: CenteredMessageProps }),
  z.object({ component: z.literal('HostFrame'), props: HostFrameProps }),
  z.object({ component: z.literal('HostViewContainer'), props: HostViewContainerProps }),
  z.object({ component: z.literal('PlayArea'), props: PlayAreaProps }),
  z.object({ component: z.literal('PlayerViewContainer'), props: PlayerViewContainerProps }),
  z.object({ component: z.literal('BiddingPopup'), props: BiddingPopupProps }),
  z.object({ component: z.literal('Card'), props: CardProps }),
  z.object({ component: z.literal('CardFan'), props: CardFanProps }),
  z.object({ component: z.literal('CardSlot'), props: CardSlotProps }),
  z.object({ component: z.literal('Deck'), props: DeckProps }),
  z.object({ component: z.literal('DiscardPile'), props: DiscardPileProps }),
  z.object({ component: z.literal('Hand'), props: HandProps }),
  z.object({ component: z.literal('LastPlayedCard'), props: LastPlayedCardProps }),
  z.object({ component: z.literal('Meld'), props: MeldProps }),
  z.object({ component: z.literal('PlayerHandDisplay'), props: PlayerHandDisplayProps }),
  z.object({ component: z.literal('Scoreboard'), props: ScoreboardProps }),
  z.object({ component: z.literal('Trick'), props: TrickProps }),
  z.object({ component: z.literal('TrumpIndicator'), props: TrumpIndicatorProps }),
  z.object({ component: z.literal('Modal'), props: ModalProps }),
  z.object({ component: z.literal('Spinner'), props: SpinnerProps }),
]);

// Define the conditional view schema separately for clarity and robust type inference.
const conditionalUIViewSchema = z.object({
  condition: z.string().optional(),
  components: z.array(componentSchema),
});

const uiSchema = z.record(z.object({
  host: z.object({
    components: z.array(componentSchema),
  }).optional(),
  // Player's UI can be a simple component list or an array of conditional views
  player: z.union([
    z.object({ components: z.array(componentSchema) }), // Original format for backward compatibility
    z.array(conditionalUIViewSchema), // New conditional format
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
