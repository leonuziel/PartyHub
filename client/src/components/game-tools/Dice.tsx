import React from 'react';

interface DiceProps {
  count?: number;
  values?: number[];
  isRolling?: boolean;
  onRollComplete?: () => void; // This would be triggered by an animation end event
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  padding?: string;
  borderRadius?: string;
  border?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Die: React.FC<{ value: number; style: React.CSSProperties }> = ({ value, style }) => {
  return <div style={style}>{value}</div>;
};

export const Dice: React.FC<DiceProps> = ({
  count = 1,
  values = [],
  isRolling = false,
  fontSize,
  fontWeight,
  fontFamily,
  color,
  backgroundColor,
  padding,
  borderRadius,
  border,
  className,
  style: propStyle = {},
}) => {
  const diceToRender = values.length > 0 ? values : Array(count).fill(1);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '10px',
    animation: isRolling ? 'shake 0.5s infinite' : 'none',
    ...propStyle,
  };

  const dieStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    aspectRatio: '1 / 1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: fontSize || '24px',
    fontWeight: fontWeight || 'bold',
    fontFamily: fontFamily,
    color: color || 'black',
    backgroundColor: backgroundColor || 'white',
    padding: padding,
    borderRadius: borderRadius || '5px',
    border: border || '1px solid black',
  };

  return (
    <div style={containerStyle} className={className}>
      {diceToRender.map((value, index) => (
        <div key={index} className="die-wrapper">
          <Die value={value} style={dieStyle} />
        </div>
      ))}
    </div>
  );
};

// Add keyframes for shake animation in a global CSS file
/*
@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  ...
}
*/
