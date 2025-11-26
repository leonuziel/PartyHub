import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../../utils/renderWithProviders';
import { PlayerLobbyView } from '../PlayerLobbyView';

jest.mock('../../lobby/AvatarCustomizer', () => ({
  AvatarCustomizer: () => <div data-testid="avatar-customizer" />,
}));
jest.mock('../../../primitives/feedback/StateIndicator', () => ({
  StateIndicator: (props: any) => <div data-testid="state-indicator" {...props} />,
}));

describe('PlayerLobbyView', () => {
  it('renders the player lobby view and handles ready toggle', async () => {
    const onReady = jest.fn();

    renderWithProviders(<PlayerLobbyView onReady={onReady} isReady={false} />);

    expect(screen.getByText("You're in! See your name on the main screen.")).toBeInTheDocument();

    const stateIndicator = screen.getByTestId('state-indicator');
    expect(stateIndicator).toHaveAttribute('status', 'Not Ready');

    await userEvent.click(screen.getByText('Ready'));
    expect(onReady).toHaveBeenCalled();
  });
});
