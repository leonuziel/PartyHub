# Generic UI Component Architecture Plan for PartyHub

This document outlines a plan for a generic and reusable UI component library for PartyHub. The goal is to maximize flexibility for game creation by providing a set of powerful, generic building blocks rather than game-specific components.

## 1. Core Principle: Generic Layout Control

To allow for maximum flexibility in game UI design, every visual component should support a standardized set of layout properties. This allows game creators to control the size, position, and alignment of any component on the screen, similar to layout systems in game engines like Unity.

This can be achieved by having a standard set of props that all visual components accept.

### Standard Layout Props

Every component intended for display in the game area will accept the following props:

-   `position`: `{ top, left, right, bottom }` (values can be in `px`, `%`, or `auto`)
-   `size`: `{ width, height }` (values can be in `px`, `%`, or `auto`)
-   `alignment`: An enum to specify alignment within its parent if size is not fixed (e.g., `'topLeft'`, `'topCenter'`, `'center'`, `'stretch'`).
-   `anchor`: `{ min: {x, y}, max: {x, y} }` with values from 0 to 1, defining how the component scales with its parent container. This provides powerful responsive behavior.

### Example Usage:

```tsx
// In a game's UI definition from the server:
{
  "component": "TextDisplay",
  "layout": {
    "anchor": { "min": { "x": 0.1, "y": 0.1 }, "max": { "x": 0.9, "y": 0.2 } },
  },
  "props": {
    "text": "This is the question",
    "fontSize": "2rem"
  }
}

{
  "component": "Button",
  "layout": {
    "position": { "bottom": "20px", "left": "50%" },
    "size": { "width": "200px", "height": "50px" }
    // transform: 'translateX(-50%)' would be handled by CSS
  },
  "props": {
    "text": "Submit"
  }
}
```
A `LayoutContainer` component would be responsible for applying these styles.

## 2. Component Categories

Components will be organized into the following categories to ensure a clear and logical structure:

*   **Layout & Structure**: Components for organizing the UI on screen.
*   **Display**: Components for presenting information to users.
*   **Input & Controls**: Components that allow users to interact with the game.
*   **Feedback & State**: Components for indicating game state, like timers and loading indicators.
*   **Game Tools**: Reusable components representing common physical game elements (cards, dice, etc.).
*   **Utility**: Helper components for development and special cases.

## 3. Component Library Breakdown

### Layout & Structure

These components form the skeleton of the UI.

*   **`Container`**
    *   **Description**: A generic container for grouping other components. Can be configured to use Flexbox or CSS Grid for layout of its children. This is the base for all layout components.
    *   **Key Props**: `display` ('flex', 'grid'), `flexDirection`, `gap`, `alignItems`, `justifyContent`.
    *   **Notes**: This is a fundamental building block. `VStack` and `HStack` can be implemented as presets of `Container`. Replaces `HostViewContainer`, `PlayerViewContainer`, etc. with a more generic solution.

*   **`Stack`**
    *   **Description**: A specialized container for arranging items in a vertical or horizontal line.
    *   **Key Props**: `direction` ('vertical' | 'horizontal'), `spacing` (number), `children`.
    *   **Notes**: Simplifies common layout patterns. Existing `HStack` and `VStack` can be merged into this.

*   **`Grid`**
    *   **Description**: A component for arranging items in a grid.
    *   **Key Props**: `columns` (number), `rows` (number), `spacing` (number), `children`.
    *   **Notes**: Useful for leaderboards, answer grids, game boards, etc.

*   **`Spacer`**
    *   **Description**: A flexible space that expands to fill available space in a `Stack`.
    *   **Notes**: A direct port of the existing useful `Spacer`.

### Display

Components for showing data. They should be "dumb" and simply render the data they are given.

*   **`TextDisplay`**
    *   **Description**: A generic component for displaying text.
    *   **Key Props**: `text` (string), `fontSize`, `fontWeight`, `fontFamily`, `color`, `textAlign`.
    *   **Notes**: This single component can replace `GameTitle`, `QuestionDisplay`, `CenteredMessage`, and `WinnerDisplay`. The styling and content will be passed via props from the game config.

*   **`ImageDisplay`**
    *   **Description**: A generic component for displaying images.
    *   **Key Props**: `src` (string), `alt` (string), `fit` ('cover', 'contain', 'fill').
    *   **Notes**: Replaces components that just show a single image like `GameBranding` (when only logo is used).

*   **`ListDisplay`**
    *   **Description**: Displays a list of items based on a template.
    *   **Key Props**: `items` (array), `renderItem` (template for rendering each item).
    *   **Notes**: A powerful component for creating leaderboards, result lists, etc. Can replace `Leaderboard`, `PodiumList`, `ResultsList`. For example, a leaderboard is a `ListDisplay` where `items` is the player list and `renderItem` is a template showing rank, avatar, name, and score.

*   **`KeyValueDisplay`**
    *   **Description**: A component for displaying key-value pairs.
    *   **Key Props**: `data` (object), `layout` ('horizontal' | 'vertical').
    *   **Notes**: Excellent for displaying player stats, game info, etc. Replaces parts of `PlayerInfo`.

*   **`PlayerAvatar`**
    *   **Description**: Displays a player's avatar.
    *   **Key Props**: `player` (object with avatar info), `size`.
    *   **Notes**: This remains a useful, specialized display component.

### Input & Controls

Components for capturing user input.

*   **`Button`**
    *   **Description**: A standard clickable button.
    *   **Key Props**: `text` (string), `icon` (string), `onClick` (action), `variant` ('primary', 'secondary'), `disabled` (boolean).
    *   **Notes**: A fundamental component. `ActionButton` is just a variant of this.

*   **`ChoiceSelector`**
    *   **Description**: A highly generic component for allowing a user to select one or more options from a list.
    *   **Key Props**: `options` (array of objects with `id`, `label`, `imageUrl` etc.), `onSelect` (action), `selectionMode` ('single' | 'multiple'), `layout` ('grid' | 'list' | 'carousel'), `disabled` (boolean).
    *   **Notes**: This is a key generic component. It can replace `AnswerGrid`, `VotingOptions`, and even be used for selecting cards from a hand.

*   **`TextInput`**
    *   **Description**: A field for users to enter text.
    *   **Key Props**: `placeholder` (string), `maxLength` (number), `showCounter` (boolean), `onChange` (action), `multiline` (boolean).
    *   **Notes**: Merges `TextAreaWithCounter` into a more generic `TextInput`.

*   **`Slider`**
    *   **Description**: A slider for selecting a value from a range.
    *   **Key Props**: `min` (number), `max` (number), `step` (number), `onChange` (action).
    *   **Notes**: New component, useful for bidding, setting values, etc.

### Feedback & State

Components that provide feedback to the user about the game's state.

*   **`Timer`**
    *   **Description**: A visual timer.
    *   **Key Props**: `duration` (number), `type` ('countdown' | 'progress'), `onComplete` (action), `label` (string).
    *   **Notes**: Generalizes `CountdownTimer`. Can be a number counting down or a progress bar filling/emptying.

*   **`Modal`**
    *   **Description**: A dialog box that appears on top of the main content.
    *   **Key Props**: `isOpen` (boolean), `onClose` (action), `children`.
    *   **Notes**: Existing `Modal` is good.

*   **`Spinner`**
    *   **Description**: A loading indicator.
    *   **Key Props**: `size`, `color`.
    *   **Notes**: Existing `Spinner` is good.

*   **`StateIndicator`**
    *   **Description**: A component to show a player's status (e.g., 'Ready', 'Answered', 'Thinking...').
    *   **Key Props**: `status` (string), `indicator` ('icon' | 'text' | 'color').
    *   **Notes**: Can be used in `PlayerStatusGrid` to make it more generic.

### Game Tools

Specialized components for common game mechanics. These are the least generic but are reusable across many *types* of games.

*   **`Card`**
    *   **Description**: A component representing a playing card.
    *   **Key Props**: `faceUp` (boolean), `content` (template for front), `back` (template for back), `isSelectable` (boolean), `isSelected` (boolean).
    *   **Notes**: `Card.tsx` is a good base. The content should be renderable via a template to support standard cards, word cards, image cards, etc.

*   **`CardContainer`**
    *   **Description**: A container for displaying a collection of cards.
    *   **Key Props**: `layout` ('fan', 'grid', 'stack', 'pile'), `cards` (array), `onCardClick` (action).
    *   **Notes**: This one component can replace `CardFan`, `Deck`, `DiscardPile`, `Hand`, and `Meld` by changing its `layout` prop.

*   **`Dice`**
    *   **Description**: A component to display one or more dice.
    *   **Key Props**: `count` (number), `values` (array of numbers), `isRolling` (boolean), `onRollComplete` (action).
    *   **Notes**: A new component for dice-based games.

*   **`GameBoard`**
    *   **Description**: A generic grid-based game board.
    *   **Key Props**: `size` ({rows, cols}), `gridTemplate` (string for custom layouts), `onCellClick` (action).
    *   **Notes**: New component, for board games. Can have `GamePiece` components as children.

*   **`GamePiece` / `Token`**
    *   **Description**: A visual marker for a player or object on a `GameBoard`.
    *   **Key Props**: `shape`, `color`, `image`, `position` ({row, col}).
    *   **Notes**: New component for board games.

### Utility

*   **`DebugPanel`**
    *   **Description**: Displays debug information.
    *   **Notes**: Stays as is.

*   **`ComponentRenderer`**
    *   **Description**: A special component that takes a JSON object describing a component and renders it. This is the core of the dynamic UI system.
    *   **Key Props**: `config` (object).
    *   **Notes**: This is essentially the `DynamicViewRenderer.tsx` but named more generically.

## 4. Mapping Old Components to New

To clarify the consolidation, here is a mapping:

| Old Component(s) | New Generic Component | Notes |
|---|---|---|
| `GameTitle`, `QuestionDisplay`, `CenteredMessage`, `WinnerDisplay` | `TextDisplay` | Styling and text are just props. |
| `AnswerGrid`, `VotingOptions` | `ChoiceSelector` | Layout and selection mode are props. |
| `TextAreaWithCounter` | `TextInput` | `multiline` and `showCounter` are props. |
| `Leaderboard`, `PodiumList`, `ResultsList`, `PlayerStatusGrid` | `ListDisplay` / `Grid` | Use `ListDisplay` with a custom `renderItem` template. |
| `PlayerInfo` | `KeyValueDisplay` + `PlayerAvatar` | Combine generic components to show player data. |
| `CardFan`, `Deck`, `Hand`, `Meld` | `CardContainer` | Layout is just a prop. |
| `HostFrame`, `PlayerViewContainer`, `PlayArea` | `Container` | Layout and styling controlled by props. |

## 5. Conclusion

Adopting this component architecture will provide a powerful and flexible foundation for PartyHub's game creation system. It empowers game designers by giving them direct control over UI layout and composition, reduces frontend development bottlenecks, and ensures that new platform features (like a new type of input) are instantly available for all games. This strategy is key to realizing the vision of PartyHub as a "Canva for Party Games".
