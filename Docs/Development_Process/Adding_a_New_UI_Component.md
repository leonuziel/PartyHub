# Checklist: Adding a New UI Component

This guide provides a comprehensive, step-by-step process for adding a new, reusable UI component to the PartyHub platform. Following these steps ensures that the component is fully integrated into the dynamic UI system, from frontend creation to backend validation.

Let's use the example of adding a new component called `TextDisplay`.

---

### ☐ 1. Create the Frontend Component

-   **Objective:** Build the React component.
-   **Path:** `client/src/components/primitives/display/`
-   **Action:**
    -   Create the component file: `TextDisplay.tsx`.
    -   Implement the component's logic. Ensure that the props are clearly defined in an interface. Note that styling is often inherited from a base schema.

    **Example (`TextDisplay.tsx`):**
    ```typescriptreact
    import React from 'react';
    import { BaseComponentProps } from '../../../types/types';

    interface TextDisplayProps extends BaseComponentProps {
      text: string;
      // Other styling props like fontSize, color, etc., are passed via style
    }

    export const TextDisplay: React.FC<TextDisplayProps> = ({ text, style }) => {
      return (
        <p style={style}>
          {text}
        </p>
      );
    };
    ```

### ☐ 2. Register the Component in the `ComponentRegistry`

-   **Objective:** Make the `DynamicViewRenderer` aware of the new component.
-   **File:** `client/src/components/ComponentRegistry.ts`
-   **Action:**
    -   Import the new component.
    -   Add a new entry to the `ComponentRegistry` object, mapping its string name to the component itself. The key must be the **exact string** that will be used in game configurations.

    **Example:**
    ```typescript
    // ... other imports
    import { TextDisplay } from './primitives/display/TextDisplay';

    export const ComponentRegistry: { [key: string]: React.FC<any> } = {
      // ... other components
      TextDisplay,
    };
    ```

### ☐ 3. Add the Component to the Backend Validator

-   **Objective:** Define the component's expected props in the backend validation schema. This is a critical step for ensuring configuration stability.
-   **File:** `Server/src/utils/validators/GameConfigValidator.ts`
-   **Actions:**
    1.  **Define Props Schema:** Create a new Zod schema for the component's props. It's common to extend a `baseStylingProps` schema.
    2.  **Add to Discriminated Union:** Add the new component to the `componentSchema` discriminated union. This links the component's string name to its props schema.

    **Example:**
    ```typescript
    // 1. Define the props schema
    const TextDisplayProps = baseStylingProps.extend({
      text: z.string(),
    }).passthrough();

    // 2. Add to the discriminated union
    const componentSchema = z.discriminatedUnion('component', [
      // ... other components
      z.object({ component: z.literal('TextDisplay'), props: TextDisplayProps }),
    ]);
    ```

### ☐ 4. Add Default Props for the Component Previewer

-   **Objective:** Ensure the new component can be previewed without errors in the Game Creator UI.
-   **File:** `client/src/pages/wizards/componentDefaultProps.ts`
-   **Action:**
    -   Open the `componentDefaultProps.ts` file.
    -   Add a new `case` to the `switch` statement for your component's name.
    -   Provide a sensible set of default props. Use template strings (e.g., `'{{player.nickname}}'`) for props that will be connected to game state. *This step is crucial to prevent the visual editor from crashing when a user drags your component onto a screen.*

    **Example (`TextDisplay`):**
    ```typescript
    case 'TextDisplay':
        defaultProps = { 
            text: 'Sample Text',
        };
        break;
    ```

### ☐ 5. Document the New Component in `components.md`

-   **Objective:** Provide clear documentation for game creators on how to use the new component.
-   **File:** `Docs/components.md`
-   **Action:**
    -   Add a new section for your component under the appropriate category.
    -   Describe what the component does.
    -   List its props, their types, and what they do.

    **Example:**
    ```markdown
    ### TextDisplay
    A primitive component for displaying a block of text.

    **Props:**
    - `text` (string): The text to be displayed. Can be a template string like `{{gameState.question}}`.
    - Accepts all base styling props (`fontSize`, `color`, etc.).
    ```

### ☐ 6. (Optional) Update the Game Creator UI

-   **Objective:** Make the new component available in the drag-and-drop UI.
-   **File:** `client/src/pages/wizards/ScreensStage.tsx` (or related sub-components)
-   **Action:**
    -   If your game creator UI has a palette of components, add the new `TextDisplay` to the list so that users can drag it onto their screens.

### ☐ 7. (Optional) Create or Update a Test Game Configuration

-   **Objective:** Verify that the new component renders correctly when loaded from a configuration.
-   **File:** `Server/src/game/configurations/test-game.json`
-   **Action:**
    -   Add the new component to a `ui` state in your test configuration.
    -   Run the server and launch the game to see the component render with the props you've defined.

    **Example `test-game.json`:**
    ```json
    "ui": {
      "STARTING": {
        "host": {
          "components": [
            {
              "component": "TextDisplay",
              "props": {
                "text": "Welcome, Host! The game is about to begin."
              }
            }
          ]
        }
      }
    }
    ```
