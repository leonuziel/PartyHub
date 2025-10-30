# Component Library

This document outlines the reusable React components available in the PartyHub frontend. These components are the building blocks for creating dynamic and interactive game UIs through the configurable game engine.

**Note on Dynamic Layouts:** When these components are used within a server-driven UI via the `ConfigurableGame` engine, their position, size, and spacing can be controlled by an optional `layout` object in the game's JSON configuration. This object provides properties for alignment, sizing (presets and percentages), and spacing (padding and offset). This is a feature of the rendering engine, not an inherent prop of each individual component. For more details, see the `layout_capabilities.md` and `game_config_spec.md` documents.

**Note on Styling Props:** Many components accept a common set of optional props for detailed styling. To avoid repetition, these are referred to as **Common Styling Props** below and include: `fontSize`, `fontWeight`, `fontFamily`, `color` (for text), `textAlign`, `backgroundColor`, `padding`, `borderRadius`, `border`, and `style` (for CSS-in-JS).

---

## Layout & Structure

Components for organizing the UI structure.

### Container
A flexible wrapper for grouping other components.

**Props:**
- `children` (React.ReactNode): The content to be displayed inside the container.
- `display` ('flex' | 'grid'): The display type of the container. Defaults to `flex`.
- `flexDirection` ('row' | 'column'): The direction of the flex container. Defaults to `column`.
- `gap` (number): The space between children in pixels. Defaults to `0`.
- `alignItems` (string): CSS `align-items` property.
- `justifyContent` (string): CSS `justify-content` property.
- `className` (string): Optional CSS class.
- Also supports **Common Styling Props** like `backgroundColor`, `padding`, `borderRadius`, and `border`.

### Stack
A component for arranging children in a vertical or horizontal line with consistent spacing.

**Props:**
- `children` (React.ReactNode): The content to be stacked.
- `direction` ('vertical' | 'horizontal'): The direction of the stack. Defaults to `vertical`.
- `spacing` (number): The space between children in pixels. Defaults to `8`.
- `className` (string): Optional CSS class.
- Also supports **Common Styling Props** like `backgroundColor`, `padding`, `borderRadius`, and `border`.

### Grid
A component for arranging children in a grid.

**Props:**
- `children` (React.ReactNode): The content to be placed in the grid.
- `columns` (number): The number of columns in the grid.
- `rows` (number): The number of rows in the grid.
- `spacing` (number): The space between grid items in pixels. Defaults to `8`.
- `className` (string): Optional CSS class.
- Also supports **Common Styling Props** like `backgroundColor`, `padding`, `borderRadius`, and `border`.

### Spacer
A flexible, empty component that expands to fill available space. Useful in flexbox layouts.

**Props:**
- `style` (React.CSSProperties): Optional inline styles.

---

## Display

Components for showing information to the user.

### TextDisplay
A component for displaying text with various styling options.

**Props:**
- `text` (string): The text to display.
- Supports all **Common Styling Props**.
- `className` (string): Optional CSS class.

### ImageDisplay
A component for displaying images with different fitting options.

**Props:**
- `src` (string): The URL of the image.
- `alt` (string): The alternative text for the image.
- `fit` ('cover' | 'contain' | 'fill'): How the image should fit its container. Defaults to `contain`.
- Also supports container-related **Common Styling Props** like `backgroundColor`, `padding`, `borderRadius`, and `border`.
- `className` (string): Optional CSS class.
- `style` (React.CSSProperties): Optional inline styles.

### ListDisplay
A component that renders a list of items using a template component for each item.

**Props:**
- `items` (T[]): An array of data items.
- `renderItem` (any): A component definition object used to render each item. The item's data is passed in the `context`.
- Also supports container-related **Common Styling Props** like `backgroundColor`, `padding`, `borderRadius`, and `border`.
- `className` (string): Optional CSS class.
- `style` (React.CSSProperties): Optional inline styles.

### KeyValueDisplay
A component for displaying key-value pairs.

**Props:**
- `data` (Record<string, string | number>): An object containing the data to display.
- `layout` ('horizontal' | 'vertical'): The layout direction. Defaults to `vertical`.
- Supports all **Common Styling Props**.
- `className` (string): Optional CSS class.

---

## Input & Controls

Components that allow users to interact with the game.

### Button
A standard, clickable button.

**Props:**
- `text` (string): The text to display on the button.
- `icon` (string): The URL for an icon to display on the button.
- `variant` ('primary' | 'secondary'): The base visual style of the button. Defaults to `primary`.
- Supports all **Common Styling Props**.
- Extends all other standard HTML button attributes.

### ChoiceSelector
A component that allows users to select one or more options from a list.

**Props:**
- `options` (ChoiceOption[] | string[]): An array of choices. Can be simple strings or objects with `id`, `label`, and `imageUrl`.
- `onSelect` ((selectedIds: string[]) => void): Callback function when a selection is made or submitted.
- `selectionMode` ('single' | 'multiple'): Whether to allow single or multiple selections. Defaults to `single`.
- `layout` ('grid' | 'list' | 'carousel'): The layout of the choices. Defaults to `grid`.
- `disabled` (boolean): If `true`, the selector is disabled.
- The container supports **Common Styling Props**.

### TextInput
A field for user text input.

**Props:**
- `placeholder` (string): Placeholder text.
- `maxLength` (number): Maximum number of characters.
- `showCounter` (boolean): Whether to display a character counter. Defaults to `false`.
- `onChange` ((value: string) => void): Callback function when the text changes.
- `multiline` (boolean): Whether to use a textarea for multiline input. Defaults to `false`.
- Supports all **Common Styling Props**.
- `className` (string): Optional CSS class.

### Slider
A slider for selecting a value from a range.

**Props:**
- `min` (number): The minimum value. Defaults to `0`.
- `max` (number): The maximum value. Defaults to `100`.
- `step` (number): The increment value. Defaults to `1`.
- `onChange` ((value: number) => void): Callback function when the value changes.
- `defaultValue` (number): The initial value. Defaults to `50`.
- The container and text label support **Common Styling Props**.
- `className` (string): Optional CSS class.

---

## Feedback & State

Components for providing feedback to the user.

### Timer
A component to display a countdown or progress bar.

**Props:**
- `duration` (number): The duration in seconds.
- `type` ('countdown' | 'progress'): The visual type of the timer. Defaults to `countdown`.
- `onComplete` (() => void): Callback function when the timer finishes.
- `label` (string): A label to display with the timer.
- Supports **Common Styling Props**.
- `className` (string): Optional CSS class.

### StateIndicator
A component to indicate a status or state.

**Props:**
- `status` (string): The status to display (e.g., 'Ready', 'Answered').
- `indicator` ('icon' | 'text' | 'color'): The type of indicator to use. Defaults to `icon`.
- Supports **Common Styling Props**.
- `className` (string): Optional CSS class.

---

## Game Tools

Specialized components for building games.

### Card
Represents a single playing card.

**Props:**
- `faceUp` (boolean): Whether the card's face is visible. Defaults to `false`.
- `content` (React.ReactNode): The content for the card's face.
- `back` (React.ReactNode): The content for the card's back.
- `isSelectable` (boolean): If `true`, the card can be clicked.
- `isSelected` (boolean): If `true`, the card is styled as selected.
- `onClick` (() => void): Callback function for when the card is clicked.
- Supports all **Common Styling Props**.
- `className` (string): Optional CSS class.
- `style` (React.CSSProperties): Optional inline styles.

### CardContainer
A container for arranging and displaying multiple cards.

**Props:**
- `layout` ('fan' | 'grid' | 'stack' | 'pile'): The layout style for the cards. Defaults to `grid`.
- `cards` (CardData[]): An array of card data objects.
- `onCardClick` ((cardId: string) => void): Callback for when a card is clicked.
- `selectedCardIds` (string[]): An array of IDs of the currently selected cards.
- Also supports container-related **Common Styling Props** like `backgroundColor`, `padding`, `borderRadius`, and `border`.

### Dice
A component to display one or more dice.

**Props:**
- `count` (number): The number of dice to display. Defaults to `1`.
- `values` (number[]): The values to show on the dice faces.
- `isRolling` (boolean): If `true`, applies a rolling animation.
- `onRollComplete` (() => void): A callback for when the rolling animation finishes.
- Each die supports all **Common Styling Props**.

### GameBoard
A grid-based board for games.

**Props:**
- `size` ({ rows: number; cols: number }): The dimensions of the board.
- `onCellClick` ((row: number, col: number) => void): Callback for when a cell is clicked.
- `children` (React.ReactNode): For placing `GamePiece` components on the board.

### GamePiece
Represents a piece on a game board.

**Props:**
- `shape` ('circle' | 'square'): The shape of the piece. Defaults to `circle`.
- `color` (string): The color of the piece.
- `image` (string): An image URL for the piece.
- `position` ({ row: number; col: number }): The grid position on a `GameBoard`.
- `style` (React.CSSProperties): Optional inline styles.

---

## Patterns

High-level, pre-composed components that solve common UI problems in game design.

### WordGuesserInput
An input field specifically for guessing a secret word. It shows correctly guessed letters and provides input boxes for the remaining letters.

**Props:**
- `wordLength` (number): The total number of letters in the word.
- `correctLetters` (object): An object where keys are indices and values are the correctly guessed letters at those positions (e.g., `{ 0: 'A', 3: 'L' }`).
- `onGuess` (Action): The action dispatched when the player submits their guess. The payload will be the full guessed word as a string.

### DrawingCanvas
A component for drawing games. Provides a canvas and drawing tools for the active player, and a read-only view for guessers.

**Props:**
- `isReadOnly` (boolean): If true, the canvas cannot be drawn on.
- `drawingData` (string): Base64 encoded image data to display on the canvas (used for read-only mode).
- `onDraw` (Action): The action dispatched when the drawing player finishes a stroke. The payload is the base64 encoded image data.

### RoleRevealCard
A component that dramatically reveals a player's secret role to them. It starts as a facedown card and flips over on click.

**Props:**
- `roleName` (string): The name of the role to be revealed.
- `roleDescription` (string): A description of the role's abilities or purpose.
- `roleImageUrl` (string): An optional image to display for the role.
- `onAcknowledge` (Action): The action dispatched when the player clicks the "Got it!" button after revealing the role.

### TeamSelectionGrid
A component for lobbies that displays multiple teams and allows players to join them. For hosts, it supports dragging and dropping players between teams.

**Props:**
- `teams` (Team[]): An array of team objects. Each object should have an `id`, `name`, `color`, and an array of `players`.
- `players` (Player[]): An array of unassigned players (only used by the host view).
- `isHost` (boolean): Should be true if the current user is the host.
- `onJoinTeam` (Action): The action dispatched when a player clicks to join a team.
- `onMovePlayer` (Action): The action dispatched when a host drags a player to a new team.

### InstructionCarousel
A component that displays a series of slides with titles, text, and optional images. It's designed for "How to Play" instructions in a lobby and auto-plays on a timer.

**Props:**
- `slides` (InstructionSlide[]): An array of slide objects. Each object should have a `title`, `text`, and an optional `imageUrl`.
- `autoPlayInterval` (number): The number of seconds to wait before automatically advancing to the next slide. Defaults to `5`.

### InGameNotification
A temporary "toast" or "snackbar" notification that appears at the bottom of the screen to deliver information without interrupting gameplay. It disappears automatically.

**Props:**
- `message` (string): The text to display in the notification.
- `type` ('info' | 'warning' | 'success'): The visual style of the notification. Defaults to `info`.
- `duration` (number): The number of seconds the notification should be visible. Defaults to `4`.
- `onComplete` (Action): An action to be dispatched after the notification has disappeared.

### ScoreAccumulationBar
A visual bar that animates a player's score changing. It's useful for adding suspense when revealing scores.

**Props:**
- `initialScore` (number): The score before the change.
- `scoreChange` (number): The amount to add or subtract from the score.
- `label` (string): A label to display next to the bar, usually the player's name.
- `startDelay` (number): An optional delay in milliseconds before the animation starts.
- `onComplete` (Action): An action to be dispatched after the animation is finished.

### CorrectAnswerOverlay
An overlay that displays the results of a question. It highlights the correct answer and shows which players chose each option.

**Props:**
- `options` (AnswerOption[]): The array of answer options that were shown to the players.
- `correctAnswerId` (string): The `id` of the correct answer option.
- `players` (Player[]): An array of player objects. Each object must have an `answerId` property corresponding to the option they chose.
- `onComplete` (Action): An action to be dispatched when the overlay is clicked to be dismissed.

### VotingGrid
Displays a grid of options (text or images) for players to vote on. Once a player votes, the grid becomes disabled for them.

**Props:**
- `options` (VoteOption[]): An array of options to display. Each object should have an `id`, `content`, and `type` ('text' or 'image').
- `onVote` (Action): The action dispatched when a player clicks an option. The payload will be the `id` of the selected option.
- `disabled` (boolean): If true, disables the voting grid.

### SubmissionReel
A component that displays submissions (text or images) one by one, with navigation controls to cycle through them.

**Props:**
- `submissions` (Submission[]): An array of submission objects. Each object should have `content`, `type` ('text' or 'image'), and an optional `author`.
- `showAuthor` (boolean): If true, displays the author's name on each submission.

### ReadyCheckDisplay
A component for the lobby that shows a list of all players and their "Ready" status. It provides a button for players to toggle their own status, and a button for the host to start the game once all players are ready.

**Props:**
- `players` (Player[]): An array of player objects. Each player object should have an `isReady` property.
- `isHost` (boolean): Should be true if the current user is the host, to show the "Start Game" button.
- `currentPlayerId` (string): The ID of the current player, so the "Ready Up" button is only shown to them.
- `onPlayerReadyToggle` (Action): The action dispatched when a player clicks the ready button.
- `onStartGame` (Action): The action dispatched when the host clicks the "Start Game" button.

### AvatarCustomizer
A component for the lobby that allows a player to choose an avatar and submit a nickname.

**Props:**
- `avatars` (string[]): An array of image URLs to be displayed as choices.
- `onSubmit` (Action): The action to be dispatched when the player submits their choice. The payload will be `{ nickname: string, avatar: string }`.

### PhaseBanner
A prominent, temporary banner that appears to announce a new phase of a round (e.g., "Writing Phase," "Voting Phase"). It automatically disappears after a few seconds.

**Props:**
- `title` (string): The main text to display in the banner.
- `subtitle` (string): Optional smaller text displayed below the title.
- `duration` (number): The number of seconds the banner should be visible. Defaults to `3`.
- `onComplete` (Action): An action to trigger after the banner has disappeared.

---

## Legacy Components (Deprecated)

The following components are maintained for backward compatibility but are not recommended for new development. They are primarily used by the legacy hardcoded games.

### Legacy Display Components
- `AnswerResult` - Use `CorrectAnswerOverlay` instead
- `AwardDisplay` - Use `InGameNotification` instead
- `GameBranding` - Use `TextDisplay` with custom styling
- `GameTitle` - Use `TextDisplay` with custom styling
- `Leaderboard` - Use `ListDisplay` with custom rendering
- `PlayerAvatar` - Use `ImageDisplay` with custom styling
- `PlayerCard` - Use `Container` with custom content
- `PlayerInfo` - Use `KeyValueDisplay` instead
- `PlayerStatusContainer` - Use `Container` with custom content
- `PlayerStatusGrid` - Use `Grid` with custom rendering
- `Podium` - Use `ListDisplay` with custom rendering
- `QuestionDisplay` - Use `TextDisplay` instead
- `QuestionHeader` - Use `TextDisplay` instead
- `RankDisplay` - Use `TextDisplay` instead
- `WinnerDisplay` - Use `TextDisplay` instead

### Legacy Control Components
- `ActionButton` - Use `Button` instead
- `AnswerGrid` - Use `ChoiceSelector` instead
- `OldButton` - Use `Button` instead
- `TextAreaWithCounter` - Use `TextInput` with `showCounter: true` instead
- `VotingOptions` - Use `VotingGrid` instead

### Legacy Layout Components
- `CenteredMessage` - Use `Container` with `alignment: "Center"` instead
- `HostFrame` - Use `Container` with custom styling instead
- `HostViewContainer` - Use `Container` instead
- `PlayArea` - Use `Container` instead
- `PlayerViewContainer` - Use `Container` instead

### Legacy Gameplay Components
- `CountdownTimer` - Use `Timer` with `type: "countdown"` instead

---

## Component Registry

All components are registered in `ComponentRegistry.ts` and can be referenced by name in game configuration files. The registry automatically maps component names to their React implementations, allowing the `DynamicViewRenderer` to instantiate them dynamically based on server-side UI definitions.
