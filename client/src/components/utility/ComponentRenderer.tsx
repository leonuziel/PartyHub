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
