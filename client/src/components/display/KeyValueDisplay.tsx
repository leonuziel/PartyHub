import React from 'react';
import { Stack } from '../layout/Stack';

interface KeyValueDisplayProps {
  data: Record<string, string | number>;
  layout?: 'horizontal' | 'vertical';
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

export const KeyValueDisplay: React.FC<KeyValueDisplayProps> = ({
  data,
  layout = 'vertical',
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
  style: propStyle = {},
}) => {
  const containerStyle: React.CSSProperties = {
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
    ...propStyle,
  };

  return (
    <div style={containerStyle} className={className}>
      <Stack direction={layout === 'vertical' ? 'vertical' : 'horizontal'} spacing={8}>
        {Object.entries(data).map(([key, value]) => (
          <div key={key} style={{ display: 'flex', gap: '8px' }}>
            <span style={{ fontWeight: 'bold' }}>{key}:</span>
            <span>{value}</span>
          </div>
        ))}
      </Stack>
    </div>
  );
};
