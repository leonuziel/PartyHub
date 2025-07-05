import React, { useState } from 'react';
import './TextAreaWithCounter.css';

interface TextAreaWithCounterProps {
  maxLength: number;
  placeholder?: string;
  onChange: (value: string) => void;
}

export const TextAreaWithCounter: React.FC<TextAreaWithCounterProps> = ({ maxLength, placeholder, onChange }) => {
  const [value, setValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    if (newValue.length <= maxLength) {
      setValue(newValue);
      onChange(newValue);
    }
  };

  return (
    <div className="textarea-with-counter">
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
      />
      <div className="char-counter">{value.length} / {maxLength}</div>
    </div>
  );
};
