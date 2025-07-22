import React from 'react';
import { Stack } from '../layout/Stack';

interface KeyValueDisplayProps {
  data: Record<string, string | number>;
  layout?: 'horizontal' | 'vertical';
  className?: string;
}

export const KeyValueDisplay: React.FC<KeyValueDisplayProps> = ({
  data,
  layout = 'vertical',
  className,
}) => {
  return (
    <div style={{ width: '100%', height: '100%' }} className={className}>
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
