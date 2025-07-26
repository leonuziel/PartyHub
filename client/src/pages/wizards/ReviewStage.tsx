
import React from 'react';

interface ReviewStageProps {
  config: any;
}

export const ReviewStage: React.FC<ReviewStageProps> = ({ config }) => {
  const { metadata, initialState, states, ui } = config;

  return (
    <div className="form-section animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">Review Your Game</h2>
      <p className="mb-6">
        Here's a summary of the game you've created. Review the details below and click "Save Game" to finalize it.
      </p>

      <div className="review-grid">
        <div className="review-section">
          <h3 className="font-bold text-lg mb-2">Metadata</h3>
          <p><strong>Title:</strong> {metadata.title}</p>
          <p><strong>Description:</strong> {metadata.description}</p>
          <p><strong>Players:</strong> {metadata.minPlayers} - {metadata.maxPlayers}</p>
        </div>

        <div className="review-section">
          <h3 className="font-bold text-lg mb-2">Game Flow</h3>
          <p><strong>Initial State:</strong> {initialState}</p>
          <p><strong>Total States:</strong> {Object.keys(states).length}</p>
        </div>

        <div className="review-section col-span-2">
          <h3 className="font-bold text-lg mb-2">UI Screens</h3>
          <p><strong>Defined Screens:</strong> {Object.keys(ui).length}</p>
        </div>
        
        <div className="review-section col-span-2">
          <h3 className="font-bold text-lg mb-2">Game Configuration JSON</h3>
          <pre className="config-json">
            {JSON.stringify(config, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
