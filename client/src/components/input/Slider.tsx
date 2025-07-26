import React, { useState } from 'react';

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  defaultValue?: number;
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

export const Slider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  onChange = () => {},
  defaultValue = 50,
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
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setValue(newValue);
    onChange(newValue);
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    width: '100%',
    padding: padding,
    borderRadius: borderRadius,
    border: border,
    backgroundColor: backgroundColor,
    ...propStyle
  };

  const textStyle: React.CSSProperties = {
    fontSize,
    fontWeight,
    fontFamily,
    color,
  };

  return (
    <div className={className} style={containerStyle}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        style={{ flexGrow: 1 }}
      />
      <span style={textStyle}>{value}</span>
    </div>
  );
};
