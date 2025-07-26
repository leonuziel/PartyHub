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

        default:
            break;
    }
    return defaultProps;
};
