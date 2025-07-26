import React from 'react';
import { CardContainer } from '../../elements/CardContainer';
import { TextDisplay } from '../../primitives/display/TextDisplay';
import { CardData } from '../../../types/types';

interface CommunityCardsViewProps {
  cards: CardData[];
  potSize?: number;
}

export const CommunityCardsView: React.FC<CommunityCardsViewProps> = ({
  cards,
  potSize,
}) => {
  return (
    <div>
      <CardContainer cards={cards} layout="grid" />
      {potSize && <TextDisplay text={`Pot: ${potSize}`} />}
    </div>
  );
};
