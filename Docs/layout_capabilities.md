# Component Layout Capabilities

This document provides a comprehensive overview of the layout capabilities available for UI components within the PartyHub platform. The layout system is designed to be powerful and flexible, allowing game creators to define complex user interfaces directly from the game configuration JSON, without writing any CSS.

## Key Concepts

The layout of components is controlled through an optional `layout` object that can be added to any component definition in the `ui` section of a game's configuration file.

The rendering engine uses a CSS Grid for the root container of each view. This means all components within a view are placed in the same grid area and align themselves within that area based on their individual `layout` properties.

Here is the basic structure of a component definition with layout properties:

```json
{
  "component": "ComponentName",
  "props": { ... },
  "layout": {
    "width": "...",
    "height": "...",
    "alignment": "...",
    "padding": { ... },
    "offset": { ... }
  }
}
```

---

## Layout Properties

### 1. Sizing (`width` and `height`)

The `width` and `height` properties control the size of a component relative to its parent container.

*   **Type**: `string`
*   **Allowed Values**:
    *   **Percentage (`%`)**: Sets the size as a percentage of the parent container's dimensions. (e.g., `"75%"`)
    *   **Fixed (`px`)**: Sets a fixed size in pixels. (e.g., `"200px"`)
    *   **`"fill"`**: The component expands to fill all available space in that dimension. This is the default behavior.
    *   **`"hug"`**: The component's size shrinks to fit its content.

**Example**:
```json
"layout": {
  "width": "50%", 
  "height": "hug"
}
```

### 2. Alignment (`alignment`)

The `alignment` property positions a component within the parent container's grid area. Imagine a 3x3 grid; the alignment value places the component in one of the nine cells.

*   **Type**: `string`
*   **Allowed Values**:
    *   `TopLeft`, `TopCenter`, `TopRight`
    *   `MiddleLeft`, `Center`, `MiddleRight`
    *   `BottomLeft`, `BottomCenter`, `BottomRight`

**Example**:
```json
"layout": {
  "alignment": "TopRight"
}
```

### 3. Spacing (`padding` and `offset`)

Spacing is controlled by two properties: `padding` for internal spacing and `offset` for external spacing.

#### `padding`
Controls the space *inside* the component's border.

*   **Type**: `object`
*   **Keys**: `top`, `bottom`, `left`, `right`
*   **Value**: `number` (interpreted as pixels)

#### `offset`
Controls the space *outside* the component's border (equivalent to CSS `margin`).

*   **Type**: `object`
*   **Keys**: `top`, `bottom`, `left`, `right`
*   **Value**: `number` (interpreted as pixels)

**Example**:
```json
"layout": {
  "padding": { "top": 10, "bottom": 10 },
  "offset": { "left": 20, "right": 20 }
}
```

---

## Example Usage

Here is a practical example of how to use these layout properties to create a simple host view for a game's starting state.

```json
"ui": {
  "STARTING": {
    "host": {
      "components": [
        {
          "component": "GameTitle",
          "props": { "title": "Welcome to the Game!" },
          "layout": {
            "alignment": "TopCenter",
            "height": "hug",
            "offset": { "top": 40 }
          }
        },
        {
          "component": "CenteredMessage",
          "props": { "children": "Waiting for players to join..." },
          "layout": {
            "alignment": "Center",
            "width": "60%"
          }
        },
        {
          "component": "CountdownTimer",
          "props": { "initialValue": 10 },
          "layout": {
            "alignment": "BottomCenter",
            "height": "120px",
            "offset": { "bottom": 40 }
          }
        }
      ]
    }
  }
}
```

In this example:
1.  The `GameTitle` is placed at the top center of the screen, hugging its content's height, with a 40px offset from the top.
2.  The `CenteredMessage` is perfectly centered, taking up 60% of the screen's width.
3.  The `CountdownTimer` is at the bottom center, has a fixed height of 120px, and has a 40px offset from the bottom.
