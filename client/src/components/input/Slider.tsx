import React, { useState } from 'react';

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  className?: string;
  defaultValue?: number;
}

export const Slider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  onChange = () => {},
  className,
  defaultValue = 50,
}) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <div className={className} style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        style={{ flexGrow: 1 }}
      />
      <span>{value}</span>
    </div>
  );
};
