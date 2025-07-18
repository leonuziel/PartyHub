# UI Layout Configuration Plan

This document outlines a plan to extend the `ui` section of the game configuration JSON to allow for precise control over component layout. This will empower game creators to design more dynamic and visually appealing interfaces directly from the configuration, without needing to write custom CSS or new React components.

## 1. High-Level Goals

-   **Granular Control:** Provide controls for component size, alignment, and spacing within its parent container.
-   **Intuitive & Declarative:** The new properties should be easy to understand and use within the existing JSON structure.
-   **Flexible:** Support both preset-based and numerical value-based sizing and spacing.
-   **Backward Compatible:** The existing `ui` structure should continue to work. The new layout properties will be optional.

## 2. Proposed Changes to `ui` Schema

The current `ui` schema defines a `components` array for each view.

```json
"components": [
  {
    "component": "GameTitle",
    "props": { "title": "QuizClash" }
  }
]
```

I propose adding a new optional `layout` object to each component definition.

```json
"components": [
  {
    "component": "GameTitle",
    "props": { "title": "QuizClash" },
    "layout": {
      // New properties will go here
    }
  }
]
```

This `layout` object will contain the new properties for controlling size, alignment, and spacing.

### 2.1. Sizing Controls

To control a component's size relative to its parent container, we will introduce `width` and `height` properties within the `layout` object.

-   **Percentage:** A string value ending in `%` (e.g., `"50%"`).
-   **Presets:** A string value representing a common size (e.g., `"fill"`, `"hug"`).
    -   `"fill"`: The component expands to fill the available space in that dimension.
    -   `"hug"`: The component shrinks to fit its content.

**Schema:**
```typescript
interface Layout {
  width?: string;  // e.g., "80%", "fill", "hug"
  height?: string; // e.g., "25%", "fill", "hug"
}

```
**Visual Representation:**
+---------------------------+
|      Simple Layout        |
|---------------------------|
| Alignment:                |
|  [↖] [↑] [↗]              |
|  [←] [C] [→]              |
|  [↙] [↓] [↘]              |
|---------------------------|
| Sizing:                   |
| (•) Fit  ( ) Stretch  ( ) Fixed |
|---------------------------|
| Offset:                   |
|   X [  10  ]   Y [  10  ]  |
+---------------------------+

note - Fixed selection reveals width and height control.
```

**Example:**
```json
{
  "component": "QuestionDisplay",
  "props": { "question": "..." },
  "layout": {
    "width": "80%",
    "height": "hug"
  }
}
```

### 2.2. Alignment Controls

To control the alignment of a component within its parent, we will use a single `alignment` property that maps to a 3x3 grid. This is intuitive for visual tools.

**Values:**
-   `TopLeft`, `TopCenter`, `TopRight`
-   `MiddleLeft`, `MiddleCenter` (or just `Center`), `MiddleRight`
-   `BottomLeft`, `BottomCenter`, `BottomRight`

These values can be translated directly into CSS Flexbox/Grid properties (`align-items` and `justify-content`) in the rendering component.

**Schema:**
```typescript
type Alignment = 
  | 'TopLeft' | 'TopCenter' | 'TopRight'
  | 'MiddleLeft' | 'Center' | 'MiddleRight'
  | 'BottomLeft' | 'BottomCenter' | 'BottomRight';

interface Layout {
  // ... other properties
  alignment?: Alignment;
}
```

**Example:**
```json
{
  "component": "CountdownTimer",
  "props": { "initialValue": 10 },
  "layout": {
    "alignment": "TopRight"
  }
}
```

### 2.3. Spacing Controls

For spacing, we will provide `padding` and `offset` (margin) properties. These will be objects that can specify values for each side.

-   **Padding:** Space *inside* the component's border.
-   **Offset:** Space *outside* the component's border (margin).

The values will be numbers, assumed to be in pixels for simplicity on the frontend.

**Schema:**
```typescript
interface Spacing {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

interface Layout {
  // ... other properties
  padding?: Spacing;
  offset?: Spacing; // 'margin' is a reserved keyword in some contexts, so 'offset' is safer.
}
```

**Example:**
```json
{
  "component": "PlayerStatusGrid",
  "props": { "players": "{{players}}" },
  "layout": {
    "padding": {
      "top": 16,
      "bottom": 16
    },
    "offset": {
      "left": 32,
      "right": 32
    }
  }
}
```

## 3. Implementation Plan

1.  **Update `GameConfigValidator.ts`:**
    -   Modify the Zod schema to include the new optional `layout` object within the component definition.
    -   Add validation for `width`, `height`, `alignment`, `padding`, and `offset` according to the types defined above.

2.  **Update `DynamicViewRenderer.tsx` (and its container):**
    -   This is the core of the frontend implementation.
    -   When rendering a component, check for the existence of the `layout` property.
    -   Create a wrapper `div` around the dynamically rendered component.
    -   Apply inline styles or dynamic CSS classes to this wrapper based on the `layout` properties.
        -   **Sizing:**
            -   `width: "80%"` -> `style={{ width: '80%' }}`
            -   `"fill"` -> `style={{ flexGrow: 1, alignSelf: 'stretch' }}` (assuming a flex container)
            -   `"hug"` -> `style={{ width: 'fit-content' }}`
        -   **Alignment:**
            -   The parent container of all components for a view must be a flexbox or grid container.
            -   Translate `alignment` values into `align-self` and `justify-self` properties. For example, `TopRight` would set `align-self: flex-start; justify-self: flex-end;`.
        -   **Spacing:**
            -   Translate `padding` and `offset` objects into `padding` and `margin` CSS properties. E.g., `padding: { top: 10 }` becomes `padding-top: 10px`.

3.  **Update `game_config_spec.md`:**
    -   Document the new `layout` object in the `ui` section.
    -   Provide clear examples for each new property.
    -   Explain how the new layout system works.

4.  **Create a Test Page/Game:**
    -   Create a new test game config (`ui-layout-test.json`) that uses all the new layout features.
    -   Use the `GameUITestPage.tsx` or a similar debug page to render this configuration and verify that all layout controls work as expected.

## 4. Example of the New `ui` structure

```json
"ui": {
  "STARTING": {
    "host": {
      "layout": { // Layout for the root container can also be defined
        "type": "flex",
        "direction": "column",
        "justify": "spaceBetween" 
      },
      "components": [
        {
          "component": "GameTitle",
          "props": { "title": "My Awesome Game" },
          "layout": {
            "alignment": "TopCenter",
            "offset": { "top": 20 }
          }
        },
        {
          "component": "CenteredMessage",
          "props": { "children": "Getting ready..." },
          "layout": {
            "alignment": "Center",
            "width": "50%"
          }
        },
        {
          "component": "CountdownTimer",
          "props": { "initialValue": 5 },
          "layout": {
            "alignment": "BottomCenter",
            "height": "100px",
            "offset": { "bottom": 20 }
          }
        }
      ]
    }
    // ... player view
  }
}
```
*Note: The root `layout` property on the view itself (e.g., `host.layout`) is a potential future enhancement to control the parent container's behavior (e.g., as a flex or grid container), which will be necessary for alignment to work correctly.*
