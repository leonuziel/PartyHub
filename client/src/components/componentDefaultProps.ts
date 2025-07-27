export const getComponentDefaultProps = (componentName: string) => {
    let defaultProps = {};

    switch (componentName) {
        // Layout & Structure
        case 'Container':
            defaultProps = { children: [] };
            break;
        case 'Stack':
            defaultProps = { direction: 'vertical', spacing: 8, children: [] };
            break;
        case 'Grid':
            defaultProps = { columns: 2, rows: 2, spacing: 8, children: [] };
            break;
        case 'Spacer':
            defaultProps = {};
            break;

        // Display
        case 'TextDisplay':
            defaultProps = { text: 'Sample Text' };
            break;
        case 'ImageDisplay':
            defaultProps = { src: 'https://via.placeholder.com/150', alt: 'Placeholder Image' };
            break;
        case 'ListDisplay':
            defaultProps = { items: '{{players}}', renderItem: { component: 'TextDisplay', props: { text: '{{item.nickname}}' } } };
            break;
        case 'KeyValueDisplay':
            defaultProps = { data: '{{player.stats}}' };
            break;
        case 'PlayerAvatar':
            defaultProps = { player: '{{player}}' };
            break;

        // Input & Controls
        case 'Button':
            defaultProps = { text: 'Click Me' };
            break;
        case 'ChoiceSelector':
            defaultProps = { options: ['Option 1', 'Option 2'], selectionMode: 'single' };
            break;
        case 'TextInput':
            defaultProps = { placeholder: 'Enter text...' };
            break;
        case 'Slider':
            defaultProps = { min: 0, max: 100, defaultValue: 50 };
            break;

        // Feedback & State
        case 'Timer':
            defaultProps = { duration: 30, type: 'countdown' };
            break;
        case 'StateIndicator':
            defaultProps = { status: 'Ready' };
            break;
        case 'Modal':
            defaultProps = { isOpen: false, children: [] };
            break;
        case 'Spinner':
            defaultProps = {};
            break;

        // Game Tools
        case 'Card':
            defaultProps = { faceUp: true, content: 'Card Content' };
            break;
        case 'CardContainer':
            defaultProps = { layout: 'grid', cards: '{{player.hand}}' };
            break;
        case 'Dice':
            defaultProps = { count: 2, values: [1, 6] };
            break;
        case 'GameBoard':
            defaultProps = { size: { rows: 8, cols: 8 } };
            break;
        case 'GamePiece':
            defaultProps = { shape: 'circle', color: 'red', position: { row: 0, col: 0 } };
            break;

        // Patterns
        case 'PhaseBanner':
            defaultProps = { title: 'Round 1', subtitle: 'Writing Phase', duration: 3 };
            break;
        case 'AvatarCustomizer':
            defaultProps = { avatars: '{{gameData.avatars}}', onSubmit: { action: 'setPlayerDetails' } };
            break;
        case 'ReadyCheckDisplay':
            defaultProps = { players: '{{players}}', isHost: '{{player.isHost}}', currentPlayerId: '{{player.id}}', onPlayerReadyToggle: { action: 'toggleReady' }, onStartGame: { action: 'startGame' } };
            break;
        case 'SubmissionReel':
            defaultProps = { submissions: '{{gameState.submissions}}', showAuthor: false };
            break;
        case 'VotingGrid':
            defaultProps = { options: '{{gameState.submissions}}', onVote: { action: 'submitVote' } };
            break;
        case 'CorrectAnswerOverlay':
            defaultProps = { options: '{{gameState.currentQuestion.options}}', correctAnswerId: '{{gameState.currentQuestion.correctAnswerId}}', players: '{{players}}' };
            break;
        case 'ScoreAccumulationBar':
            defaultProps = { initialScore: 0, scoreChange: 100, label: '{{player.nickname}}' };
            break;
        case 'InGameNotification':
            defaultProps = { message: 'Player X has joined!', type: 'info' };
            break;
        
        case 'InstructionCarousel':
            defaultProps = { slides: '{{gameData.instructions}}', autoPlayInterval: 5 };
            break;

        case 'TeamSelectionGrid':
            defaultProps = { teams: '{{gameState.teams}}', players: '{{gameState.unassignedPlayers}}', isHost: '{{player.isHost}}', onJoinTeam: { action: 'joinTeam' }, onMovePlayer: { action: 'movePlayer' } };
            break;

        case 'RoleRevealCard':
            defaultProps = { roleName: '{{player.role.name}}', roleDescription: '{{player.role.description}}', onAcknowledge: { action: 'acknowledgeRole' } };
            break;

        case 'DrawingCanvas':
            defaultProps = { isReadOnly: '{{player.role !== "artist"}}', drawingData: '{{gameState.currentDrawing}}', onDraw: { action: 'updateDrawing' } };
            break;

        case 'WordGuesserInput':
            defaultProps = { wordLength: '{{gameState.secretWord.length}}', correctLetters: '{{gameState.correctLetters}}', onGuess: { action: 'submitGuess' } };
            break;
        case 'TurnOrderDisplay':
            defaultProps = { players: '{{players}}', activePlayerId: '{{gameState.activePlayerId}}' };
            break;
        
        // --- Newly Added Components ---

        case 'MatchupDisplay':
            defaultProps = { player1: '{{players[0]}}', player2: '{{players[1]}}', matchupTitle: 'VS' };
            break;

        case 'PersonalScoreCard':
            defaultProps = { player: '{{player}}', scoreDetails: { 'Round 1': 500, 'Bonus': 100 }, totalScore: 600 };
            break;

        case 'FinalResultsScreen':
            defaultProps = { players: '{{players}}', onPlayAgain: { action: 'playAgain' }, onExit: { action: 'exitLobby' } };
            break;

        case 'EmojiReactionToolbar':
            defaultProps = { onReaction: { action: 'sendReaction' } };
            break;
            
        case 'HostQuestionView':
            defaultProps = { question: 'What is the capital of France?', choices: ['Paris', 'London', 'Berlin', 'Madrid'], players: '{{players}}', timeLimit: 30 };
            break;
        
        case 'HostLeaderboardView':
            defaultProps = { players: '{{players}}' };
            break;

        case 'HostResultView':
            defaultProps = { question: 'What was the capital of France?', options: '{{gameState.currentQuestion.options}}', correctAnswerId: '{{gameState.currentQuestion.correctAnswerId}}', players: '{{players}}', winner: '{{gameState.winner}}' };
            break;

        case 'PlayerLobbyView':
            defaultProps = { isReady: '{{player.isReady}}', onReady: { action: 'toggleReady' } };
            break;

        case 'PlayerAnswerView':
            defaultProps = { questionType: 'multiple-choice', options: ['A', 'B', 'C', 'D'], onAnswer: { action: 'submitAnswer' } };
            break;
        
        case 'PlayerVotingView':
            defaultProps = { prompt: 'Vote for your favorite!', options: '{{gameState.submissions}}', onVote: { action: 'submitVote' } };
            break;
        
        case 'PlayerResultView':
            defaultProps = { isCorrect: true, pointsEarned: 550, oldRank: 3, newRank: 2 };
            break;

        case 'PlayerHandView':
            defaultProps = { cards: '{{player.hand}}', selectedCardIds: '{{player.selectedCardIds}}', onPlayCard: { action: 'playCard' }, onDrawCard: { action: 'drawCard' }, onPass: { action: 'passTurn' } };
            break;

        case 'CommunityCardsView':
            defaultProps = { cards: '{{gameState.communityCards}}', potSize: 1500 };
            break;

        case 'BiddingView':
            defaultProps = { currentBid: 100, onBid: { action: 'placeBid' }, onCheck: { action: 'check' }, onFold: { action: 'fold' } };
            break;

        // --- Legacy Components ---

        // old/display
        case 'PlayerInfo':
            defaultProps = { player: '{{player}}' };
            break;
        case 'Podium':
            defaultProps = { players: '{{gameState.topThreePlayers}}' };
            break;
        case 'WinnerDisplay':
            defaultProps = { winnerName: '{{gameState.winner.nickname}}' };
            break;
        case 'QuestionDisplay':
            defaultProps = { text: '{{gameState.currentQuestion.questionText}}' };
            break;
        case 'Leaderboard':
            defaultProps = { players: '{{players}}' };
            break;
        
        // old/controls
        case 'AnswerGrid':
            defaultProps = { answers: '{{gameState.currentQuestion.options}}', onAnswer: { action: 'submitAnswer' } };
            break;
        case 'TextAreaWithCounter':
            defaultProps = { maxLength: 140, placeholder: 'Enter your submission...' };
            break;
        case 'VotingOptions':
            defaultProps = { options: '{{gameState.submissions}}', onVote: { action: 'submitVote' } };
            break;
        
        // old/cards
        case 'CardSlot':
            defaultProps = { isFaceUp: true, card: '{{gameState.communityCards[0]}}' };
            break;
        case 'Deck':
            defaultProps = { count: 52, onDraw: { action: 'drawCard' } };
            break;
        case 'Hand':
            defaultProps = { cards: '{{player.hand}}' };
            break;

        default:
            break;
    }
    return defaultProps;
};
