import React, { useState } from 'react';

interface TextInputProps {
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  showCounter?: boolean;
  onChange?: (value: string) => void;
  multiline?: boolean;
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

export const TextInput: React.FC<TextInputProps> = ({
  placeholder,
  maxLength,
  disabled = false,
  showCounter = false,
  onChange = () => {},
  multiline = false,
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
    boxSizing: 'border-box',
    resize: multiline ? 'none' : undefined,
    flexGrow: 1,
    fontSize,
    fontWeight,
    fontFamily,
    color: color || 'white',
    textAlign,
    backgroundColor: backgroundColor || '#1C192B',
    padding: padding || '10px',
    borderRadius: borderRadius || '8px',
    border: border || '1px solid #3A3A5A',
    ...propStyle,
  };

  const counterStyle: React.CSSProperties = {
    textAlign: 'right',
    fontSize: '0.8rem',
    color: '#888',
  };

  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div className={className} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <InputComponent
        style={inputStyle}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        rows={multiline ? 4 : undefined}
        disabled={disabled}
      />
      {showCounter && maxLength && (
        <div style={counterStyle}>
          {value.length} / {maxLength}
        </div>
      )}
    </div>
  );
};
