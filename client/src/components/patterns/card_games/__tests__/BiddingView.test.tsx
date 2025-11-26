import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../../utils/renderWithProviders';
import { BiddingView } from '../BiddingView';

describe('BiddingView', () => {
  it('renders bidding view and handles actions', async () => {
    const onBid = jest.fn();
    const onCheck = jest.fn();
    const onFold = jest.fn();

    renderWithProviders(
      <BiddingView
        currentBid={10}
        onBid={onBid}
        onCheck={onCheck}
        onFold={onFold}
      />
    );

    expect(screen.getByText('Current Bid: 10')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Bid'));
    expect(onBid).toHaveBeenCalledWith(10);

    await userEvent.click(screen.getByText('Check'));
    expect(onCheck).toHaveBeenCalled();

    await userEvent.click(screen.getByText('Fold'));
    expect(onFold).toHaveBeenCalled();
  });
});
