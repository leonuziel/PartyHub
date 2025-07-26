import React from 'react';
import { TextDisplay } from '../../primitives/display/TextDisplay';
import { Slider } from '../../primitives/input/Slider';
import { Button } from '../../primitives/input/Button';

interface BiddingViewProps {
  currentBid: number;
  onBid: (amount: number) => void;
  onCheck: () => void;
  onFold: () => void;
}

export const BiddingView: React.FC<BiddingViewProps> = ({
  currentBid,
  onBid,
  onCheck,
  onFold,
}) => {
  const [bidAmount, setBidAmount] = React.useState(currentBid);

  return (
    <div>
      <TextDisplay text={`Current Bid: ${currentBid}`} />
      <Slider
        min={currentBid}
        max={currentBid * 2}
        defaultValue={currentBid}
        onChange={setBidAmount}
      />
      <Button text="Bid" onClick={() => onBid(bidAmount)} />
      <Button text="Check" onClick={onCheck} />
      <Button text="Fold" onClick={onFold} />
    </div>
  );
};
