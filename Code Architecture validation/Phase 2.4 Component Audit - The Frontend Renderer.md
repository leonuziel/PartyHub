```python?code_reference&code_event_index=2
file_names = [
    "DynamicViewRenderer.tsx",
    "GameContainer.tsx",
    "ComponentRenderer.tsx",
    "Button.tsx"
]

for file_name in file_names:
    print(f"--- Reading {file_name} ---")
    with open(file_name, "r") as f:
        print(f.read())
    print(f"--- End of {file_name} ---\n")

```

```text?code_stdout&code_event_index=2
--- Reading DynamicViewRenderer.tsx ---
import React, { CSSProperties } from 'react';
import { useGameStore } from '../store/gameStore';
import { usePlayerStore } from '../store/playerStore';
import { usePlayerRole } from '../hooks/usePlayerRole';
import { ComponentRegistry } from '../components/ComponentRegistry';
import { CenteredMessage } from '../components/old/layout/CenteredMessage';
import HostFrame from '../components/old/layout/HostFrame';
import { socketService } from '../services/socketService';
import { getStyleFromLayout, ComponentConfig, LayoutConfig } from '../utils/layoutUtils';



const transformProps = (props: Record<string, any>): Record<string, any> => {
    const newProps: Record<string, any> = {};
    for (const key in props) {
        const value = props[key];
        if (value && typeof value === 'object' && value.action) {
            newProps[key] = (...args: any[]) => {
                const payload = args.length > 0 ? args[0] : value.payload;
                socketService.sendGameAction(value.action, payload);
            };
        } else {
            newProps[key] = value;
        }
    }
    return newProps;
};

export const DynamicViewRenderer: React.FC = () => {
    const { gameState } = useGameStore();
    const { isHost } = usePlayerRole();
    const playerId = usePlayerStore((state) => state.socketId);

    // Recursive rendering function defined inside the main component
    const renderComponent = (config: ComponentConfig, index: number, isGridChild = false): React.ReactNode => {
        const Component = ComponentRegistry[config.component];
        if (!Component) {
            return <div key={index}>Error: Component '{config.component}' not found in registry.</div>;
        }
    
        const transformedProps = transformProps(config.props);
    
        // Children can be a top-level property or inside props. This checks both.
        const childrenSource = config.children || (config.props ? config.props.children : undefined);
        const isParentGrid = config.component === 'Grid';
    
        if (Array.isArray(childrenSource)) {
            // Recursively render children, passing the isGridChild flag if the parent is a Grid.
            transformedProps.children = childrenSource.map((childConfig, childIndex) =>
                renderComponent(childConfig, childIndex, isParentGrid)
            );
        }
    
        // If this component is a child of a Grid, it should not be wrapped in a layout div.
        // The parent Grid component is responsible for its layout.
        if (isGridChild) {
            return <Component key={index} {...transformedProps} />;
        }
    
        // This is a top-level component. Wrap it in a div to apply layout styles.
        const wrapperStyle: CSSProperties = { gridArea: 'main-area' };
        Object.assign(wrapperStyle, config.layout ? getStyleFromLayout(config.layout) : {});
    
        return (
            <div key={index} style={wrapperStyle}>
                <Component {...transformedProps} />
            </div>
        );
    };


    if (!gameState || !gameState.currentState || !gameState.ui) {
        return <CenteredMessage>Loading dynamic view...</CenteredMessage>;
    }

    const role = isHost ? 'host' : 'player';
    let viewConfig: any;

    if (isHost) {
        viewConfig = gameState.ui?.host;
    } else {
        // The server resolves the UI for each player and sends it in the `players` map.
        // We just need to look up the correct UI for our player's ID.
        if (playerId && gameState.ui?.players) {
            viewConfig = gameState.ui.players[playerId];
        }
    }
    
    if (!viewConfig || !Array.isArray(viewConfig.components)) {
        return (
            <CenteredMessage>
                {`No UI configuration found for state: ${gameState.currentState} and role: ${role}`}
            </CenteredMessage>
        );
    }
    
    // The main view is a grid container that defines a single area.
    // All components are placed into this area and align themselves within it.
    const viewStyle: CSSProperties = viewConfig.layout ? getStyleFromLayout(viewConfig.layout) : {
        display: 'grid',
        gridTemplateAreas: '"main-area"',
        height: '100%',
        width: '100%',
    };

    const renderedComponents = viewConfig.components.map(renderComponent);

    // Wrap host views in the standard frame
    if (isHost) {
        return <HostFrame><div style={viewStyle}>{renderedComponents}</div></HostFrame>;
    }

    return <div style={viewStyle}>{renderedComponents}</div>;

};

--- End of DynamicViewRenderer.tsx ---

--- Reading GameContainer.tsx ---
import React from 'react';
import { useGameStore } from '../store/gameStore';
import { usePlayerRole } from '../hooks/usePlayerRole';
import { QuizClashHostView } from './QuizClash/QuizClashHostView';
import { QuizClashPlayerView } from './QuizClash/QuizClashPlayerView';
import FakeNewsHostView from './FakeNewsGame/FakeNewsHostView';
import FakeNewsPlayerView from './FakeNewsGame/FakeNewsPlayerView';
import { CardsWarHostView } from './CardsWar/CardsWarHostView';
import { CardsWarPlayerView } from './CardsWar/CardsWarPlayerView';
import HostFrame from '../components/old/layout/HostFrame';
import TexasHoldemHostView from './TexasHoldem/TexasHoldemHostView';
import TexasHoldemPlayerView from './TexasHoldem/TexasHoldemPlayerView';
import { DynamicViewRenderer } from './DynamicViewRenderer';

export const GameContainer: React.FC = () => {
  const { gameState, isConfigurable } = useGameStore();
  const { isHost } = usePlayerRole();

  if (!gameState) {
    return <p>Loading game...</p>;
  }

  const renderGameView = () => {
    if (isConfigurable) {
      return <DynamicViewRenderer />;
    }

    switch (gameState.gameId) {
      case 'quizclash':
        return isHost ? <QuizClashHostView /> : <QuizClashPlayerView />;
      case 'fakenews':
        return isHost ? <FakeNewsHostView /> : <FakeNewsPlayerView />;
      case 'cardswar':
        return isHost ? <CardsWarHostView /> : <CardsWarPlayerView />;
      case 'texas-holdem-poker':
        return isHost ? <TexasHoldemHostView /> : <TexasHoldemPlayerView />;
      default:
        return <p>Error: Unknown game type '{gameState.gameId}'!</p>;
    }
  };

  const gameView = renderGameView();

  if (isHost && !isConfigurable && gameState.gameId !== 'quizclash') { // The HostFrame is part of the dynamic layout system
    return (
      <HostFrame>
        {gameView}
      </HostFrame>
    );
  }

  return gameView;
};

--- End of GameContainer.tsx ---

--- Reading ComponentRenderer.tsx ---
import React from 'react';
import { ComponentRegistry } from '../ComponentRegistry';

// A simple function to resolve template strings like "{{item.name}}"
const resolveValue = (value: any, context: any) => {
    if (typeof value !== 'string') return value;
    const match = value.match(/^{{(.*)}}$/);
    if (match) {
        const key = match[1];
        // Basic object traversal, e.g., "item.name"
        return key.split('.').reduce((acc, part) => acc && acc[part], context);
    }
    return value;
};

// Recursively resolve template strings in props
const resolveProps = (props: any, context: any): any => {
    if (!props) return {};
    const resolved: { [key: string]: any } = {};
    for (const key in props) {
        const value = props[key];
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            resolved[key] = resolveProps(value, context);
        } else if (Array.isArray(value)) {
             resolved[key] = value.map(item => typeof item === 'object' ? resolveProps(item, context) : resolveValue(item, context));
        }
        else {
            resolved[key] = resolveValue(props[key], context);
        }
    }
    return resolved;
};


interface ComponentRendererProps {
  config: any;
  context: any; // The data context, e.g., { item: { name: 'Alice' } }
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({ config, context }) => {
  if (!config || !config.component) {
    return null;
  }

  const Component = ComponentRegistry[config.component];

  if (!Component) {
    console.warn(`Component "${config.component}" not found in registry.`);
    return <div>Component not found: {config.component}</div>;
  }

  const resolvedProps = resolveProps(config.props, context);
  
  if (config.children) {
      resolvedProps.children = config.children.map((childConfig: any, index: number) => (
          <ComponentRenderer key={index} config={childConfig} context={context} />
      ))
  }

  return <Component {...resolvedProps} />;
};

--- End of ComponentRenderer.tsx ---

--- Reading Button.tsx ---
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon?: string; // URL or name of an icon
  variant?: 'primary' | 'secondary';
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  backgroundColor?: string;
  padding?: string;
  borderRadius?: string;
  border?: string;
  style?: React.CSSProperties;
}

export const Button: React.FC<ButtonProps> = ({
  text,
  icon,
  variant = 'primary',
  onClick = () => {},
  disabled,
  children,
  fontSize,
  fontWeight,
  fontFamily,
  color,
  textAlign,
  backgroundColor,
  padding,
  borderRadius,
  border,
  style: propStyle = {},
  ...props
}) => {
  // Basic styling - can be replaced with CSS modules or a styling library
  const baseStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'center',
  };

  const variantStyle: React.CSSProperties = {
    primary: {
      backgroundColor: '#8A2BE2',
      color: 'white',
    },
    secondary: {
      backgroundColor: '#3A3A5A',
      color: 'white',
    },
  }[variant];

  const disabledStyle: React.CSSProperties = {
    cursor: 'not-allowed',
    opacity: 0.5,
  };

  const overrideStyle: React.CSSProperties = {
    fontSize,
    fontWeight,
    fontFamily,
    color,
    textAlign,
    backgroundColor,
    padding,
    borderRadius,
    border,
  };

  const style = {
    ...baseStyle,
    ...variantStyle,
    ...(disabled ? disabledStyle : {}),
    ...overrideStyle,
    ...propStyle,
  };

  return (
    <button style={style} onClick={onClick} disabled={disabled} {...props}>
      {icon && <img src={icon} alt="" style={{ height: '1em' }} />}
      {text}
      {children}
    </button>
  );
};

--- End of Button.tsx ---


```

This is **Lead Architect** speaking. I have conducted the audit of the **Presentation Layer (Frontend)**.

### **Audit Verdict: PARTIAL FAIL (Architectural Violations Detected)**

While you have correctly implemented the core **Dynamic Rendering** engine, the codebase violates two specific pillars of the PartyHub Rubric: **"Zero Hardcoding"** and **"Soulful UI"**.

### **Detailed Audit**

#### **1. Dynamic Rendering (Pass)**

  * **Evidence:** `DynamicViewRenderer.tsx` correctly implements a recursive loop (`renderComponent`) that maps the JSON configuration to React components via the `ComponentRegistry`.
  * **Compliance:** It handles nested children (Stacks/Grids) and transforms props correctly. This component is a valid "Dumb Renderer".

#### **2. Zero Hardcoding (Fail)**

  * **Violation:** `GameContainer.tsx` acts as a legacy router with hardcoded switch statements:
    ```typescript
    // GameContainer.tsx
    switch (gameState.gameId) {
      case 'quizclash': ...
      case 'fakenews': ...
    }
    ```
  * **Why this is a Blocker:** The rubric explicitly asks: *"Are there any `if (gameType === 'kahoot')` checks? (There should be none...)"*.
    Even if you intended to support legacy games, this breaks the "Universal Engine" architecture. The container should simply pass the `gameState` to the `DynamicViewRenderer` (or a single generic `GameRenderer`), which effectively decides what to render based on the data, not the ID.

#### **3. Tactile Feedback (Fail)**

  * **Violation:** `Button.tsx` is a static HTML wrapper.
    ```typescript
    // Button.tsx
    const baseStyle = { ... }; // No animation definitions
    return <button ...>{text}</button>;
    ```
  * **Why this is a Blocker:** The rubric requires: *"Buttons implement immediate visual feedback (e.g., ripples or scale animations) locally."*
    Your current button feels "dead." In a high-latency distributed system, the user *must* feel their touch was registered instantly, even if the network takes 200ms to reply.

-----

### **Required Remediation**

**Step 1: Fix `GameContainer.tsx`**
Refactor it to be agnostic. If you must support legacy views during migration, move that logic *inside* a specific adapter, or better yet, fully cut over to the dynamic renderer for this audit.

**Step 2: "Soulify" `Button.tsx`**
Implement immediate feedback. I recommend installing `framer-motion` (standard in React for this) to add a `whileTap` scale effect.

**Example Fix for Button:**

```typescript
import { motion } from 'framer-motion';

export const Button: React.FC<ButtonProps> = ({ ...props }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }} // Immediate tactile feedback
      transition={{ duration: 0.1 }}
      {...props}
    >
      {/* content */}
    </motion.button>
  );
};
```

**Next Step:**
Please **fix `GameContainer.tsx`** and **`Button.tsx`** (you may need to add `framer-motion` to your package) and upload the corrected files.

I cannot verify the "Soulful UI" without these animations.