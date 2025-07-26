import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon?: string; // URL or name of an icon
  variant?: 'primary' | 'secondary';
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  borderRadius?: string;
  border?: string;
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
  backgroundColor,
  borderRadius,
  border,
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
    backgroundColor,
    borderRadius,
    border,
  };

  const style = {
    ...baseStyle,
    ...variantStyle,
    ...(disabled ? disabledStyle : {}),
    ...overrideStyle,
  };

  return (
    <button style={style} onClick={onClick} disabled={disabled} {...props}>
      {icon && <img src={icon} alt="" style={{ height: '1em' }} />}
      {text}
      {children}
    </button>
  );
};
