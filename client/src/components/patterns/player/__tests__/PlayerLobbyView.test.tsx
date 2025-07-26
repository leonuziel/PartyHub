import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlayerLobbyView } from '../PlayerLobbyView';

jest.mock('../../lobby/AvatarCustomizer', () => ({
    AvatarCustomizer: () => <div data-testid="avatar-customizer" />,
}));
jest.mock('../../../primitives/feedback/StateIndicator', () => ({
  StateIndicator: (props: any) => <div data-testid="state-indicator" {...props} />,
}));

describe('PlayerLobbyView', () => {
  it('renders the player lobby view and handles ready toggle', () => {
    const onReady = jest.fn();

    render(<PlayerLobbyView onReady={onReady} isReady={false} />);

    expect(screen.getByText("You're in! See your name on the main screen.")).toBeInTheDocument();
    
    const stateIndicator = screen.getByTestId('state-indicator');
    expect(stateIndicator).toHaveAttribute('status', 'Not Ready');

    fireEvent.click(screen.getByText('Ready'));
    expect(onReady).toHaveBeenCalled();
  });
});
