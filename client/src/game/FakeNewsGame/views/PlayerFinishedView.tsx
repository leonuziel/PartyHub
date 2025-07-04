import React from 'react';
import { PlayerStatusContainer } from '../../../components/PlayerStatusContainer';
import { RankDisplay } from '../../../components/RankDisplay';
import { AwardDisplay } from '../../../components/AwardDisplay';

interface PlayerFinishedViewProps {
  myFinalRank: number;
  iAmMasterLiar: boolean;
  iAmTruthSeeker: boolean;
}

export const PlayerFinishedView: React.FC<PlayerFinishedViewProps> = ({ myFinalRank, iAmMasterLiar, iAmTruthSeeker }) => {
  return (
    <div className="fakenews-player-view centered-view">
      <PlayerStatusContainer title="Game Over!" />
      {myFinalRank > 0 && <RankDisplay rank={myFinalRank} />}
      <div className="personal-awards">
        {iAmMasterLiar && <AwardDisplay award="Master Liar" description="You were the best at fooling others!" />}
        {iAmTruthSeeker && <AwardDisplay award="Truth Seeker" description="You had a keen eye for the truth!" />}
      </div>
    </div>
  );
};
