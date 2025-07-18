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

  return (
    <div style={style} className={className}>
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
