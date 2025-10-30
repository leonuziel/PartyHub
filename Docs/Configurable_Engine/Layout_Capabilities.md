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
          "component": "TextDisplay",
          "props": { 
            "text": "Welcome to the Game!",
            "fontSize": "3rem",
            "fontWeight": "bold"
          },
          "layout": {
            "alignment": "TopCenter",
            "height": "hug",
            "offset": { "top": 40 }
          }
        },
        {
          "component": "TextDisplay",
          "props": { 
            "text": "Waiting for players to join...",
            "fontSize": "1.2rem"
          },
          "layout": {
            "alignment": "Center",
            "width": "60%"
          }
        },
        {
          "component": "Timer",
          "props": { 
            "duration": 10,
            "type": "countdown"
          },
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
1.  The `TextDisplay` with the game title is placed at the top center of the screen, hugging its content's height, with a 40px offset from the top.
2.  The `TextDisplay` with the waiting message is perfectly centered, taking up 60% of the screen's width.
3.  The `Timer` is at the bottom center, has a fixed height of 120px, and has a 40px offset from the bottom.

---

## Advanced Layout Patterns

### 1. Side-by-Side Layout

To create a side-by-side layout, use different alignment values for components:

```json
"components": [
  {
    "component": "TextDisplay",
    "props": { "text": "Left Content" },
    "layout": {
      "alignment": "MiddleLeft",
      "width": "45%",
      "offset": { "left": 20 }
    }
  },
  {
    "component": "TextDisplay",
    "props": { "text": "Right Content" },
    "layout": {
      "alignment": "MiddleRight",
      "width": "45%",
      "offset": { "right": 20 }
    }
  }
]
```

### 2. Card Layout

For a card-like appearance with proper spacing:

```json
"components": [
  {
    "component": "Container",
    "props": {
      "backgroundColor": "#f5f5f5",
      "borderRadius": "8px"
    },
    "layout": {
      "alignment": "Center",
      "width": "80%",
      "height": "hug",
      "padding": { "top": 20, "bottom": 20, "left": 20, "right": 20 }
    }
  }
]
```

### 3. Responsive Grid

Create a responsive grid layout using percentage widths:

```json
"components": [
  {
    "component": "Container",
    "props": { "backgroundColor": "#e0e0e0" },
    "layout": {
      "alignment": "TopLeft",
      "width": "30%",
      "height": "200px",
      "offset": { "top": 20, "left": 20 }
    }
  },
  {
    "component": "Container",
    "props": { "backgroundColor": "#e0e0e0" },
    "layout": {
      "alignment": "TopCenter",
      "width": "30%",
      "height": "200px",
      "offset": { "top": 20 }
    }
  },
  {
    "component": "Container",
    "props": { "backgroundColor": "#e0e0e0" },
    "layout": {
      "alignment": "TopRight",
      "width": "30%",
      "height": "200px",
      "offset": { "top": 20, "right": 20 }
    }
  }
]
```

---

## Best Practices

### 1. Use Semantic Alignment
- **TopCenter**: Perfect for titles and headers
- **Center**: Ideal for main content and call-to-action elements
- **BottomCenter**: Great for navigation and status information
- **Side positions**: Use for sidebar content or multi-column layouts

### 2. Leverage Percentage Sizing
- Use percentages for responsive layouts that adapt to different screen sizes
- Combine with `hug` height for content that should size naturally
- Use `fill` sparingly to avoid overwhelming the interface

### 3. Consistent Spacing
- Use consistent offset values (e.g., multiples of 8 or 16) for a professional look
- Apply padding inside containers for breathing room around content
- Use offset for positioning components relative to their alignment point

### 4. Performance Considerations
- Avoid excessive use of complex layouts in views with many components
- Use `hug` sizing when possible to prevent unnecessary stretching
- Consider the visual hierarchy when choosing alignment positions

---

## Current Limitations

The layout system currently has the following limitations:

1. **Fixed Grid System**: All components are placed in a single CSS Grid area, limiting complex nested layouts
2. **No Z-Index Control**: Components cannot be layered or overlapped
3. **Limited Animation**: No built-in support for transitions or animations
4. **No Responsive Breakpoints**: Layouts don't automatically adapt to different screen sizes

These limitations are planned to be addressed in future versions of the platform.

---

## Troubleshooting

### Common Issues

1. **Components Not Positioning Correctly**
   - Check that the `alignment` value is spelled correctly (case-sensitive)
   - Ensure the component has a valid `layout` object

2. **Sizing Problems**
   - Verify that `width` and `height` values are valid strings
   - Use `"hug"` for components that should size to their content
   - Use percentages for responsive sizing

3. **Spacing Issues**
   - Remember that `padding` is internal spacing and `offset` is external
   - All spacing values are interpreted as pixels
   - Use consistent spacing values for a polished appearance

### Debug Tips

- Start with simple layouts and gradually add complexity
- Test with different component types to understand how they behave
- Use the browser's developer tools to inspect the generated CSS
- Check the console for any layout-related warnings or errors

The layout system is designed to be intuitive and powerful, allowing game creators to focus on game design rather than technical implementation details.
