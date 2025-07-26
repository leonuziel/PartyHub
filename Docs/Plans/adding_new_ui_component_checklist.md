# Checklist: Adding a New UI Component

This guide provides a comprehensive, step-by-step process for adding a new, reusable UI component to the PartyHub platform. Following these steps ensures that the component is fully integrated into the dynamic UI system, from frontend creation to backend validation.

Let's use the example of adding a new component called `InfoBanner`.

---

### ☐ 1. Create the Frontend Component

-   **Objective:** Build the React component and its stylesheet.
-   **Path:** `client/src/components/{category}/`
-   **Action:**
    -   Create the component file: `InfoBanner.tsx`.
    -   Create the stylesheet: `InfoBanner.css`.
    -   Implement the component's logic and styling. Ensure that the props are clearly defined in an interface.

    **Example (`InfoBanner.tsx`):**
    ```typescriptreact
    import React from 'react';
    import './InfoBanner.css';

    interface InfoBannerProps {
      title: string;
      message: string;
      icon?: string; // e.g., 'warning', 'info'
    }

    export const InfoBanner: React.FC<InfoBannerProps> = ({ title, message, icon }) => {
      return (
        <div className={`info-banner banner-icon-${icon || 'info'}`}>
          <h3>{title}</h3>
          <p>{message}</p>
        </div>
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
    import { InfoBanner } from './display/InfoBanner'; // Adjust path as needed

    export const ComponentRegistry: { [key: string]: React.FC<any> } = {
      // ... other components
      InfoBanner,
    };
    ```

### ☐ 3. Add the Component to the Backend Validator

-   **Objective:** Define the component's expected props in the backend validation schema. This is a critical step for ensuring configuration stability.
-   **File:** `Server/src/utils/validators/GameConfigValidator.ts`
-   **Actions:**
    1.  **Define Props Schema:** Create a new Zod schema for the component's props. For any prop that receives a callback function (like `onClick` or `onAnswer`), use the `uiActionSchema`.
    2.  **Add to Discriminated Union:** Add the new component to the `componentSchema` discriminated union. This links the component's string name to its props schema.

    **Example:**
    ```typescript
    // 1. Define the props schema
    const InfoBannerProps = z.object({
      title: z.string(),
      message: z.string(),
      icon: z.string().optional(),
    }).passthrough();

    // 2. Add to the discriminated union
    const componentSchema = z.discriminatedUnion('component', [
      // ... other components
      z.object({ component: z.literal('InfoBanner'), props: InfoBannerProps }),
    ]);
    ```

### ☐ 4. Add Default Props for the Component Previewer

-   **Objective:** Ensure the new component can be previewed without errors in the Game Creator UI.
-   **File:** `client/src/pages/wizards/componentDefaultProps.ts`
-   **Action:**
    -   Open the `componentDefaultProps.ts` file.
    -   Add a new `case` to the `switch` statement for your component's name.
    -   Provide a sensible set of default props. Use template strings (e.g., `'{{player.nickname}}'`) for props that will be connected to game state. *This step is crucial to prevent the visual editor from crashing when a user drags your component onto a screen.*

    **Example (`InfoBanner`):**
    ```typescript
    case 'InfoBanner':
        defaultProps = { 
            title: 'Info Banner Title', 
            message: 'This is some default info.' 
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
    ### InfoBanner
    Displays a prominent banner with a title and message. Can be styled with an icon.

    **Props:**
    - `title` (string): The main title of the banner.
    - `message` (string): The body text of the banner.
    - `icon` (string): Optional. The name of the icon to display (e.g., 'warning', 'info').
    ```

### ☐ 6. (Optional) Update the Game Creator UI

-   **Objective:** Make the new component available in the drag-and-drop UI.
-   **File:** `client/src/pages/GameCreatorPage.tsx` (or related sub-components)
-   **Action:**
    -   If your game creator UI has a palette of components, add the new `InfoBanner` to the list so that users can drag it onto their screens.

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
              "component": "InfoBanner",
              "props": {
                "title": "Welcome, Host!",
                "message": "The game is about to begin. Get ready!"
              }
            }
          ]
        }
      }
    }
    ```
