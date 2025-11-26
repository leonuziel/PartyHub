import React, { useState } from 'react';
import './RoleRevealCard.css';

interface RoleRevealCardProps {
  roleName: string;
  roleDescription: string;
  roleImageUrl?: string;
  onAcknowledge: () => void;
}

export const RoleRevealCard: React.FC<RoleRevealCardProps> = ({ roleName, roleDescription, roleImageUrl, onAcknowledge }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(true);
  };

  return (
    <div className="role-reveal-container">
        <div className={`role-card ${isFlipped ? 'is-flipped' : ''}`} onClick={handleCardClick}>
            <div className="card-face card-front">
                <h2>Your Role</h2>
                <p>Click to reveal</p>
            </div>
            <div className="card-face card-back">
                {isFlipped && (
                    <>
                        {roleImageUrl && <img src={roleImageUrl} alt={roleName} />}
                        <h3>{roleName}</h3>
                        <p>{roleDescription}</p>
                    </>
                )}
            </div>
        </div>
        {isFlipped && (
            <button className="acknowledge-btn" onClick={onAcknowledge}>
                Got it!
            </button>
        )}
    </div>
  );
};
