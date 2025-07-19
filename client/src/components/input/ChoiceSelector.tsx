import React, { useState } from 'react';
import { Grid } from '../layout/Grid';
import { Stack } from '../layout/Stack';
import { Button } from './Button';

interface ChoiceOption {
  id: string;
  label: string;
  imageUrl?: string;
}

interface ChoiceSelectorProps {
  options: ChoiceOption[] | string[];
  onSelect: (selectedIds: string[]) => void;
  selectionMode?: 'single' | 'multiple';
  layout?: 'grid' | 'list' | 'carousel';
  disabled?: boolean;
}

export const ChoiceSelector: React.FC<ChoiceSelectorProps> = ({
  options,
  onSelect = () => {},
  selectionMode = 'single',
  layout = 'grid',
  disabled = false,
}) => {
  const [selected, setSelected] = useState<string[]>([]);

  const normalizedOptions: ChoiceOption[] = options.map(opt => 
    typeof opt === 'string' ? { id: opt, label: opt } : opt
  );

  const handleSelect = (id: string) => {
    if (disabled) return;

    let newSelected: string[];
    if (selectionMode === 'single') {
      newSelected = [id];
      onSelect(newSelected);
    } else {
      newSelected = selected.includes(id)
        ? selected.filter((item) => item !== id)
        : [...selected, id];
    }
    setSelected(newSelected);

    // For multiple selection, you might want a separate submit button
    // For single selection, it's common to fire immediately.
    // This implementation fires on change for both.
    if (selectionMode !== 'single') {
       // onSelect(newSelected) // could be called here or via a submit button
    }
  };

  const renderOption = (option: ChoiceOption) => {
    const isSelected = selected.includes(option.id);
    return (
        <Button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            variant={isSelected ? 'primary' : 'secondary'}
            style={{
                flexDirection: 'column',
                height: '100%',
                border: isSelected ? '2px solid #8A2BE2' : '2px solid transparent',
            }}
        >
            {option.imageUrl && <img src={option.imageUrl} alt={option.label} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />}
            <span>{option.label}</span>
        </Button>
    );
  };
  
  const handleSubmit = () => {
    onSelect(selected);
  }

  const LayoutComponent = layout === 'grid' ? Grid : Stack;
  const layoutProps = layout === 'grid' ? { columns: Math.ceil(Math.sqrt(normalizedOptions.length)) } : { direction: 'vertical' as const };

  return (
    <div>
        <LayoutComponent {...layoutProps} spacing={16}>
            {normalizedOptions.map(renderOption)}
        </LayoutComponent>
        {selectionMode === 'multiple' && (
            <Button onClick={handleSubmit} disabled={disabled || selected.length === 0} style={{marginTop: '16px'}}>
                Submit
            </Button>
        )}
    </div>
  );
};
