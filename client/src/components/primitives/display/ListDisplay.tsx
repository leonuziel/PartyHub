import React from 'react';
import { ComponentRenderer } from '../../utility/ComponentRenderer';

interface ListDisplayProps<T> {
  items: T[];
  renderItem: any; // In config, this is a component definition object
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  backgroundColor?: string;
  padding?: string;
  borderRadius?: string;
  border?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ListDisplay<T>({
  items,
  renderItem,
  fontSize,
  fontWeight,
  fontFamily,
  color,
  textAlign,
  backgroundColor,
  padding,
  borderRadius,
  border,
  className,
  style,
}: ListDisplayProps<T>) {
  // Ensure items is an array before mapping
  const a_items = Array.isArray(items) ? items : [];

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    overflowY: 'auto', // Make it scrollable if content overflows
    display: 'flex',
    flexDirection: 'column',
    gap: '8px', // Add some space between list items
    fontSize,
    fontWeight,
    fontFamily,
    color,
    textAlign,
    backgroundColor,
    padding,
    borderRadius,
    border,
    ...style,
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
