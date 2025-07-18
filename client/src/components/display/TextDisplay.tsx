import React from 'react';

interface TextDisplayProps {
  text: string;
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  className?: string;
}

export const TextDisplay: React.FC<TextDisplayProps> = ({
  text,
  fontSize = '1rem',
  fontWeight = 'normal',
  fontFamily = 'Inter, sans-serif',
  color = 'white',
  textAlign = 'left',
  className,
}) => {
  const style: React.CSSProperties = {
    fontSize,
    fontWeight,
    fontFamily,
    color,
    textAlign,
  };

  return (
    <p style={style} className={className}>
      {text}
    </p>
  );
};
