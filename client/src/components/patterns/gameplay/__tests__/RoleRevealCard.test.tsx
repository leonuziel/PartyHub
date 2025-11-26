import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../utils/renderWithProviders';
import { RoleRevealCard } from '../RoleRevealCard';

describe('RoleRevealCard', () => {
  const onAcknowledge = jest.fn();

  beforeEach(() => {
    onAcknowledge.mockClear();
  });

  it('initially shows the front of the card', () => {
    renderWithProviders(
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

  it('flips the card on click, revealing the role', async () => {
    renderWithProviders(
      <RoleRevealCard
        roleName="The Spy"
        roleDescription="You must blend in."
        onAcknowledge={onAcknowledge}
      />
    );

    const card = screen.getByText('Your Role').closest('.role-card')!;
    await userEvent.click(card);

    expect(card).toHaveClass('is-flipped');
    expect(screen.getByText('The Spy')).toBeInTheDocument();
    expect(screen.getByText('You must blend in.')).toBeInTheDocument();
  });

  it('shows the "Got it!" button only after the card is flipped', async () => {
    renderWithProviders(
      <RoleRevealCard
        roleName="The Spy"
        roleDescription="You must blend in."
        onAcknowledge={onAcknowledge}
      />
    );

    expect(screen.queryByRole('button', { name: /got it/i })).not.toBeInTheDocument();

    const card = screen.getByText('Your Role').closest('.role-card')!;
    await userEvent.click(card);

    const acknowledgeButton = screen.getByRole('button', { name: /got it/i });
    expect(acknowledgeButton).toBeInTheDocument();
  });

  it('calls onAcknowledge when the "Got it!" button is clicked', async () => {
    renderWithProviders(
      <RoleRevealCard
        roleName="The Spy"
        roleDescription="You must blend in."
        onAcknowledge={onAcknowledge}
      />
    );

    const card = screen.getByText('Your Role').closest('.role-card')!;
    await userEvent.click(card);

    const acknowledgeButton = screen.getByRole('button', { name: /got it/i });
    await userEvent.click(acknowledgeButton);

    expect(onAcknowledge).toHaveBeenCalledTimes(1);
  });
});
