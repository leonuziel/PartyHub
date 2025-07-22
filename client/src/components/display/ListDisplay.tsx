import React from 'react';
import { ComponentRenderer } from '../utility/ComponentRenderer';

interface ListDisplayProps<T> {
  items: T[];
  renderItem: any; // In config, this is a component definition object
  className?: string;
  style?: React.CSSProperties;
}

export function ListDisplay<T>({
  items,
  renderItem,
  className,
  style,
}: ListDisplayProps<T>) {
  // Ensure items is an array before mapping
  const a_items = Array.isArray(items) ? items : [];

  const containerStyle: React.CSSProperties = {
    ...style,
    width: '100%',
    height: '100%',
    overflowY: 'auto', // Make it scrollable if content overflows
    display: 'flex',
    flexDirection: 'column',
    gap: '8px', // Add some space between list items
  };

  return (
    <div style={containerStyle} className={className}>
      {a_items.map((item, index) => (
        // Use the ComponentRenderer to render the template for each item
        <ComponentRenderer
          key={index}
          config={renderItem}
          context={{ item }} // Pass the current item in the context
        />
      ))}
    </div>
  );
}
