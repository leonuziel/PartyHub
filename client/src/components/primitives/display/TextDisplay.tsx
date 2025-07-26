import React from 'react';

interface TextDisplayProps {
  text: string;
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
}

export const TextDisplay: React.FC<TextDisplayProps> = ({
  text,
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
}) => {
  const style: React.CSSProperties = {
    width: '100%',
    height: '100%',
    fontSize,
    fontWeight,
    fontFamily,
    color,
    textAlign,
    backgroundColor,
    padding,
    borderRadius,
    border,
    margin: 0, // Remove default margin from <p>
    overflowWrap: 'break-word', // Ensure long text wraps
    display: 'flex', // Use flexbox for alignment
    alignItems: 'center', // Center vertically
    justifyContent: 'center', // Center horizontally
  };

  return (
    <div style={style} className={className}>
      {text}
    </div>
  );
};
