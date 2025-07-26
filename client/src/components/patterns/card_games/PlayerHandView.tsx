import React from 'react';
import { CardContainer } from '../../elements/CardContainer';
import { Button } from '../../primitives/input/Button';
import { CardData } from '../../../types/types';

interface PlayerHandViewProps {
  cards: CardData[];
  onPlayCard: (cardId: string) => void;
  onDrawCard: () => void;
  onPass: () => void;
  selectedCardIds: string[];
}

export const PlayerHandView: React.FC<PlayerHandViewProps> = ({
  cards,
  onPlayCard,
  onDrawCard,
  onPass,
  selectedCardIds,
}) => {
  return (
    <div>
      <CardContainer
        cards={cards}
        layout="fan"
        onCardClick={(cardId) => onPlayCard(cardId)}
        selectedCardIds={selectedCardIds}
      />
      <div>
        <Button text="Play Card" onClick={() => onPlayCard(selectedCardIds[0])} />
        <Button text="Draw" onClick={onDrawCard} />
        <Button text="Pass" onClick={onPass} />
      </div>
    </div>
  );
};
