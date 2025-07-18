import React from 'react';
import { Container } from './Container';

interface StackProps {
  children: React.ReactNode;
  direction?: 'vertical' | 'horizontal';
  spacing?: number;
  className?: string;
}

export const Stack: React.FC<StackProps> = ({
  children,
  direction = 'vertical',
  spacing = 8,
  className,
}) => {
  return (
    <Container
      display="flex"
      flexDirection={direction === 'vertical' ? 'column' : 'row'}
      gap={spacing}
      className={className}
    >
      {children}
    </Container>
  );
};
