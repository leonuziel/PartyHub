# Plan: Component Configurability Enhancement

This plan details the process of enhancing the configurability of all base UI components in `client/src/components`. The goal is to standardize a set of optional styling props across these components, similar to `TextDisplay.tsx`, to allow for greater customization from the game configuration JSON.

## 1. Guiding Principles

- **Standardization:** A common set of styling props should be applied where applicable.
- **Optionality:** All new props must be optional with sensible defaults to ensure backward compatibility with existing game configurations.
- **Maintainability:** Changes should be documented and validated to keep the system robust.
- **Extensibility:** The new props should be supported by the backend validator and the game creator UI.

## 2. The Standard Styling Props

The following props, inspired by `TextDisplay`, will be added to components where they make sense.

- `fontSize`: `string`
- `fontWeight`: `string`
- `fontFamily`: `string`
- `color`: `string` (text color)
- `textAlign`: `'left' | 'center' | 'right' | 'justify'`
- `backgroundColor`: `string`
- `padding`: `string` (e.g., "10px", "5px 10px")
- `borderRadius`: `string` (e.g., "8px")
- `border`: `string` (e.g., "1px solid white")
- `style`: `React.CSSProperties` (for any other custom styling)

## 3. Execution Plan

### Phase 1: Update Frontend Components

For each component category in `client/src/components`, I will assess and update the components.

**Target Components:**

-   **display:**
    -   `ImageDisplay.tsx` - ✅
    -   `KeyValueDisplay.tsx` - ✅
    -   `ListDisplay.tsx` - ✅
-   **feedback:**
    -   `StateIndicator.tsx` - ✅
    -   `Timer.tsx` - ✅
-   **game-tools:**
    -   `Card.tsx` - ✅
    -   `CardContainer.tsx` - ✅
    -   `Dice.tsx` - ✅
-   **input:**
    -   `Button.tsx` - ✅
    -   `ChoiceSelector.tsx` - ✅
    -   `Slider.tsx` - ✅
    -   `TextInput.tsx` - ✅
-   **layout:**
    -   `Container.tsx` - ✅
    -   `Grid.tsx` - ✅
    -   `Stack.tsx` - ✅

**Process for each component:**

1.  **Analyze:** Determine which of the standard styling props are applicable. For example, `fontFamily` doesn't apply to `ImageDisplay`.
2.  **Update Props Interface:** Add the applicable optional props to the component's props interface.
3.  **Apply Props:** Create a `style` object within the component and apply the props, ensuring they can be overridden by an existing `style` prop if present.
4.  **Testing:** Manually verify the changes in `GameUITestPage.tsx`.

### Phase 2: Update Backend Validator

The backend must be updated to recognize and validate these new optional props for every component.

-   **File to Update:** `Server/src/utils/validators/GameConfigValidator.ts`
-   **Action:**
    1.  Create a reusable Zod schema for the standard styling props.
    ```typescript
    const baseStylingProps = z.object({
      fontSize: z.string().optional(),
      fontWeight: z.string().optional(),
      fontFamily: z.string().optional(),
      color: z.string().optional(),
      textAlign: z.enum(['left', 'center', 'right', 'justify']).optional(),
      backgroundColor: z.string().optional(),
      padding: z.string().optional(),
      borderRadius: z.string().optional(),
      border: z.string().optional(),
      // We cannot validate `style` easily, so we will use `.passthrough()`
    });
    ```
    2.  For each component's props schema in the validator, merge it with the `baseStylingProps`.
    ```typescript
    // Example for Button
    const ButtonProps = baseStylingProps.extend({
      text: z.string(),
      // ... other specific props
    }).passthrough();
    ```
    3.  This ensures that any game configuration using these props will pass validation.

### Phase 3: Update Documentation

All changes must be reflected in the project's documentation.

-   **File to Update:** `Docs/components.md`
-   **Action:**
    -   For each component that was updated, add the new standardized props to its props list. It's best to create a small note explaining that these are common styling props.

### Phase 4: Enhance the Game Creator UI (Future Task)

While the full implementation of this is out of scope for the initial pass, the groundwork should be laid.

-   **File to Update:** `client/src/pages/wizards/PropertyInspector.tsx`
-   **Objective:** The property inspector should display input fields for these new common styling props when a component is selected.
-   **Action:**
    1.  Identify the section in `PropertyInspector.tsx` that renders the controls for a selected component.
    2.  Add a standard set of controls (e.g., text inputs for `color`, `fontSize`, a dropdown for `textAlign`) that appear for any component that supports them.

## 4. Validation Strategy

-   **Manual Testing:** Use the `GameUITestPage.tsx` to render each modified component and apply the new props to ensure they work visually.
-   **Configuration Test:** Modify `test-basic-flow.json` to include some of the new styling props on various components.
-   **Run Backend Tests:** Execute the server's test suite to ensure the validator changes haven't introduced regressions.
-   **CI:** All changes will be validated by the CI pipeline upon pull request.

This structured approach ensures that the component library becomes significantly more flexible and powerful, enabling richer UIs to be built from the game configuration system.
