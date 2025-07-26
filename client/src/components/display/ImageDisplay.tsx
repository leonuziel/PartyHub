import React from 'react';

interface ImageDisplayProps {
  src: string;
  alt: string;
  fit?: 'cover' | 'contain' | 'fill';
  backgroundColor?: string;
  padding?: string;
  borderRadius?: string;
  border?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({
  src,
  alt,
  fit = 'contain',
  backgroundColor,
  padding,
  borderRadius,
  border,
  className,
  style: propStyle = {},
}) => {
  const style: React.CSSProperties = {
    objectFit: fit,
    width: '100%',
    height: '100%',
    backgroundColor,
    padding,
    borderRadius,
    border,
    ...propStyle,
  };

  return <img src={src} alt={alt} style={style} className={className} />;
};
