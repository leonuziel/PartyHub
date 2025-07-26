import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon?: string; // URL or name of an icon
  variant?: 'primary' | 'secondary';
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  backgroundColor?: string;
  padding?: string;
  borderRadius?: string;
  border?: string;
  style?: React.CSSProperties;
}

export const Button: React.FC<ButtonProps> = ({
  text,
  icon,
  variant = 'primary',
  onClick = () => {},
  disabled,
  children,
  fontSize,
  fontWeight,
  fontFamily,
  color,
  textAlign,
  backgroundColor,
  padding,
  borderRadius,
  border,
  style: propStyle = {},
  ...props
}) => {
  // Basic styling - can be replaced with CSS modules or a styling library
  const baseStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'center',
  };

  const variantStyle: React.CSSProperties = {
    primary: {
      backgroundColor: '#8A2BE2',
      color: 'white',
    },
    secondary: {
      backgroundColor: '#3A3A5A',
      color: 'white',
    },
  }[variant];

  const disabledStyle: React.CSSProperties = {
    cursor: 'not-allowed',
    opacity: 0.5,
  };

  const overrideStyle: React.CSSProperties = {
    fontSize,
    fontWeight,
    fontFamily,
    color,
    textAlign,
    backgroundColor,
    padding,
    borderRadius,
    border,
  };

  const style = {
    ...baseStyle,
    ...variantStyle,
    ...(disabled ? disabledStyle : {}),
    ...overrideStyle,
    ...propStyle,
  };

  return (
    <button style={style} onClick={onClick} disabled={disabled} {...props}>
      {icon && <img src={icon} alt="" style={{ height: '1em' }} />}
      {text}
      {children}
    </button>
  );
};
