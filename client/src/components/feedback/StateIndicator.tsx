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
  className?: string;
}

export const StateIndicator: React.FC<StateIndicatorProps> = ({
  status,
  indicator = 'icon',
  className,
}) => {
  const renderIndicator = () => {
    switch (indicator) {
      case 'icon':
        return <span>{iconMap[status] || '❔'}</span>;
      case 'text':
        return <span>{status}</span>;
      case 'color':
        // This would likely be a colored dot or background
        return <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'green' /* Map status to color */ }}></div>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className={className}>
      {renderIndicator()}
    </div>
  );
};
