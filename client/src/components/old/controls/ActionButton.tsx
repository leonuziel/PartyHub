import React from 'react';
import { Button, ButtonProps } from './Button';

export const ActionButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};
