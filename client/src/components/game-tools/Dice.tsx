import React from 'react';

interface DiceProps {
  count?: number;
  values?: number[];
  isRolling?: boolean;
  onRollComplete?: () => void; // This would be triggered by an animation end event
}

const Die: React.FC<{ value: number }> = ({ value }) => {
  const dieStyle: React.CSSProperties = {
    width: '50px',
    height: '50px',
    backgroundColor: 'white',
    color: 'black',
    border: '1px solid black',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
  };
  return <div style={dieStyle}>{value}</div>;
};

export const Dice: React.FC<DiceProps> = ({
  count = 1,
  values = [],
  isRolling = false,
}) => {
  const diceToRender = values.length > 0 ? values : Array(count).fill(1);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '10px',
    animation: isRolling ? 'shake 0.5s infinite' : 'none',
  };

  return (
    <div style={containerStyle}>
      {diceToRender.map((value, index) => (
        <Die key={index} value={value} />
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
