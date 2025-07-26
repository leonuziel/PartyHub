import React from 'react';

// A simple example, assuming we have some icons available
const iconMap: Record<string, string> = {
  Ready: '✅',
  Answered: '👍',
  Thinking: '🤔',
  Correct: '🎉',
  Wrong: '❌',
};

interface StateIndicatorProps {
  status: string;
  indicator?: 'icon' | 'text' | 'color';
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

export const StateIndicator: React.FC<StateIndicatorProps> = ({
  status,
  indicator = 'icon',
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

  const renderIndicator = () => {
    switch (indicator) {
      case 'icon':
        return <span data-testid="icon-indicator">{iconMap[status] || '❔'}</span>;
      case 'text':
        return <span data-testid="text-indicator">{status}</span>;
      case 'color':
        // This would likely be a colored dot or background
        return <div data-testid="color-indicator" style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'green' /* Map status to color */ }}></div>;
      default:
        return <span data-testid="text-indicator">{status}</span>;
    }
  };

  return (
    <div data-testid="state-indicator" style={containerStyle} className={className}>
      {renderIndicator()}
    </div>
  );
};
