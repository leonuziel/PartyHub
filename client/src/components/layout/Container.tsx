import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  display?: 'flex' | 'grid';
  flexDirection?: 'row' | 'column';
  gap?: number;
  alignItems?: string;
  justifyContent?: string;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  display = 'flex',
  flexDirection = 'column',
  gap = 0,
  alignItems,
  justifyContent,
  className = '',
}) => {
  const style: React.CSSProperties = {
    display,
    flexDirection,
    gap: `${gap}px`,
    alignItems,
    justifyContent,
  };

  return (
    <div style={style} className={className}>
      {children}
    </div>
  );
};
