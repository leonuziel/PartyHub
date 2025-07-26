import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RoleRevealCard } from '../RoleRevealCard';

describe('RoleRevealCard', () => {
  const onAcknowledge = jest.fn();

  beforeEach(() => {
    onAcknowledge.mockClear();
  });

  it('initially shows the front of the card', () => {
    render(
      <RoleRevealCard
        roleName="The Spy"
        roleDescription="You must blend in."
        onAcknowledge={onAcknowledge}
      />
    );
    expect(screen.getByText('Your Role')).toBeInTheDocument();
    expect(screen.getByText('Click to reveal')).toBeInTheDocument();
    expect(screen.queryByText('The Spy')).not.toBeInTheDocument();
  });

  it('flips the card on click, revealing the role', () => {
    render(
        <RoleRevealCard
          roleName="The Spy"
          roleDescription="You must blend in."
          onAcknowledge={onAcknowledge}
        />
      );
    
      const card = screen.getByText('Your Role').closest('.role-card')!;
      fireEvent.click(card);

      expect(card).toHaveClass('is-flipped');
      expect(screen.getByText('The Spy')).toBeInTheDocument();
      expect(screen.getByText('You must blend in.')).toBeInTheDocument();
  });

  it('shows the "Got it!" button only after the card is flipped', () => {
    render(
        <RoleRevealCard
          roleName="The Spy"
          roleDescription="You must blend in."
          onAcknowledge={onAcknowledge}
        />
      );
    
    expect(screen.queryByRole('button', { name: /got it/i })).not.toBeInTheDocument();
    
    const card = screen.getByText('Your Role').closest('.role-card')!;
    fireEvent.click(card);

    const acknowledgeButton = screen.getByRole('button', { name: /got it/i });
    expect(acknowledgeButton).toBeInTheDocument();
  });

  it('calls onAcknowledge when the "Got it!" button is clicked', () => {
    render(
        <RoleRevealCard
          roleName="The Spy"
          roleDescription="You must blend in."
          onAcknowledge={onAcknowledge}
        />
      );
    
    const card = screen.getByText('Your Role').closest('.role-card')!;
    fireEvent.click(card);

    const acknowledgeButton = screen.getByRole('button', { name: /got it/i });
    fireEvent.click(acknowledgeButton);

    expect(onAcknowledge).toHaveBeenCalledTimes(1);
  });
});
