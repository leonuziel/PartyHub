import React from 'react';

interface GridProps {
  children: React.ReactNode;
  columns?: number;
  rows?: number;
  spacing?: number;
  className?: string;
}

export const Grid: React.FC<GridProps> = ({
  children,
  columns,
  rows,
  spacing = 8,
  className,
}) => {
  const style: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: columns ? `repeat(${columns}, 1fr)` : undefined,
    gridTemplateRows: rows ? `repeat(${rows}, 1fr)` : undefined,
    gap: `${spacing}px`,
  };

  return (
    <div style={style} className={className}>
      {children}
    </div>
  );
};
