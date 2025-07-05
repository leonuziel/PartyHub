import { CountdownTimer } from './gameplay/CountdownTimer';
import { PlayerStatusGrid } from './display/PlayerStatusGrid';
import { QuestionDisplay } from './display/QuestionDisplay';
import { AnswerGrid } from './controls/AnswerGrid';
import { Leaderboard } from './display/Leaderboard';
import { CenteredMessage } from './layout/CenteredMessage';
import { GameTitle } from './display/GameTitle';
import { Podium } from './display/Podium';

// This registry maps string names (used in the game config) to actual React components.
export const ComponentRegistry: Record<string, React.ComponentType<any>> = {
    // Gameplay
    'CountdownTimer': CountdownTimer,

    // Display
    'PlayerStatusGrid': PlayerStatusGrid,
    'QuestionDisplay': QuestionDisplay,
    'Leaderboard': Leaderboard,
    'GameTitle': GameTitle,
    'Podium': Podium,

    // Controls
    'AnswerGrid': AnswerGrid,

    // Layout
    'CenteredMessage': CenteredMessage,
};
