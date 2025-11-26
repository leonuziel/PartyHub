import React from 'react';
import { Container } from './Container';

interface StackProps {
  children: React.ReactNode;
  direction?: 'vertical' | 'horizontal';
  spacing?: number;
  backgroundColor?: string;
  padding?: string;
  borderRadius?: string;
  border?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Stack: React.FC<StackProps> = ({
  children,
  direction = 'vertical',
  spacing = 8,
  backgroundColor,
  padding,
  borderRadius,
  border,
  className,
  style,
}) => {
  return (
    <Container
      display="flex"
      flexDirection={direction === 'vertical' ? 'column' : 'row'}
      gap={spacing}
      backgroundColor={backgroundColor}
      padding={padding}
      borderRadius={borderRadius}
      border={border}
      className={className}
      style={style}
    >
      {children}
    </Container>
  );
};
