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
  fontSize,
  fontWeight,
  fontFamily,
  color,
  textAlign,
  className,
}) => {
  const style: React.CSSProperties = {
    width: '100%',
    height: '100%',
    fontSize,
    fontWeight,
    fontFamily,
    color,
    textAlign,
    margin: 0, // Remove default margin from <p>
    padding: 0,
    overflowWrap: 'break-word', // Ensure long text wraps
  };

  return (
    <div style={style} className={className}>
      {text}
    </div>
  );
};
