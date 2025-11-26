import React from 'react';

interface BiddingPopupProps {
  onBid: (amount: number) => void;
  onPass: () => void;
}

export const BiddingPopup: React.FC<BiddingPopupProps> = ({ onBid, onPass }) => {
  return (
    <div className="bidding-popup">
      <h3>Bidding</h3>
      <button onClick={() => onBid(1)}>1</button>
      <button onClick={() => onBid(2)}>2</button>
      <button onClick={() => onBid(3)}>3</button>
      <button onClick={onPass}>Pass</button>
    </div>
  );
};
