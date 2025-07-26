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

### PlayerAvatar
Displays a player's avatar.

**Props:**
- `player` (Player): The player object.
- `size` ('small' | 'medium' | 'large'): The size of the avatar. Defaults to `medium`.

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

### Modal
A modal dialog that can be displayed over the main content.

**Props:**
- `isOpen` (boolean): Controls whether the modal is open or closed.
- `onClose` (() => void): Callback function for when the modal is closed.
- `children` (React.ReactNode): The content to be displayed inside the modal.

### Spinner
A loading spinner to indicate that content is being loaded.

**Props:**
- `None`

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
