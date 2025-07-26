import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BiddingView } from '../BiddingView';

describe('BiddingView', () => {
  it('renders bidding view and handles actions', () => {
    const onBid = jest.fn();
    const onCheck = jest.fn();
    const onFold = jest.fn();

    render(
      <BiddingView
        currentBid={10}
        onBid={onBid}
        onCheck={onCheck}
        onFold={onFold}
      />
    );

    expect(screen.getByText('Current Bid: 10')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Bid'));
    expect(onBid).toHaveBeenCalledWith(10);

    fireEvent.click(screen.getByText('Check'));
    expect(onCheck).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Fold'));
    expect(onFold).toHaveBeenCalled();
  });
});
