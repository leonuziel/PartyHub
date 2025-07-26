import React from 'react';

interface GridProps {
  children: React.ReactNode;
  columns?: number;
  rows?: number;
  spacing?: number;
  backgroundColor?: string;
  padding?: string;
  borderRadius?: string;
  border?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Grid: React.FC<GridProps> = ({
  children,
  columns,
  rows,
  spacing = 8,
  backgroundColor,
  padding,
  borderRadius,
  border,
  className,
  style: propStyle = {},
}) => {
  const style: React.CSSProperties = {
    display: 'grid',
    width: '100%',
    height: '100%',
    gridTemplateColumns: columns ? `repeat(${columns}, 1fr)` : undefined,
    gridTemplateRows: rows ? `repeat(${rows}, 1fr)` : undefined,
    gap: `${spacing}px`,
    backgroundColor,
    padding,
    borderRadius,
    border,
    ...propStyle,
  };

  // Convert children to an array to handle single or multiple children gracefully.
  const childArray = React.Children.toArray(children);

  // If rows and columns are provided, create an explicit grid with placeholder divs.
  if (rows && columns) {
    const totalCells = rows * columns;
    return (
      <div data-testid="grid" style={style} className={className}>
        {Array.from({ length: totalCells }).map((_, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {/* Place the child for this cell, or render null if no child exists for this index. */}
            {childArray[index] || null}
          </div>
        ))}
      </div>
    );
  }

  // Fallback to the original implicit grid behavior if rows or columns are not specified.
  return (
    <div data-testid="grid" style={style} className={className}>
      {children}
    </div>
  );
};
