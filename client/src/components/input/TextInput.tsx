import React, { useState } from 'react';

interface TextInputProps {
  placeholder?: string;
  maxLength?: number;
  showCounter?: boolean;
  onChange: (value: string) => void;
  multiline?: boolean;
  className?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  placeholder,
  maxLength,
  showCounter = false,
  onChange = () => {},
  multiline = false,
  className,
}) => {
  const [value, setValue] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value;
    if (maxLength && newValue.length > maxLength) {
      return;
    }
    setValue(newValue);
    onChange(newValue);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #3A3A5A',
    backgroundColor: '#1C192B',
    color: 'white',
    boxSizing: 'border-box',
  };

  const counterStyle: React.CSSProperties = {
    textAlign: 'right',
    fontSize: '0.8rem',
    color: '#888',
  };

  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div className={className}>
      <InputComponent
        style={inputStyle}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        rows={multiline ? 4 : undefined}
      />
      {showCounter && maxLength && (
        <div style={counterStyle}>
          {value.length} / {maxLength}
        </div>
      )}
    </div>
  );
};
