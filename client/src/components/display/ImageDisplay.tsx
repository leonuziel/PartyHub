import React from 'react';

interface ImageDisplayProps {
  src: string;
  alt: string;
  fit?: 'cover' | 'contain' | 'fill';
  className?: string;
  style?: React.CSSProperties;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({
  src,
  alt,
  fit = 'contain',
  className,
  style: propStyle = {},
}) => {
  const style: React.CSSProperties = {
    ...propStyle,
    objectFit: fit,
    width: '100%',
    height: '100%',
  };

  return <img src={src} alt={alt} style={style} className={className} />;
};
