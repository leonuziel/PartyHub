import React from 'react';

export const MetadataStage = ({ config, setConfig }: any) => {
    const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setConfig((prevConfig: any) => ({
            ...prevConfig,
            metadata: {
                ...prevConfig.metadata,
                [name]: value,
            },
        }));
    };

    return (
        <div className="form-section animate-fade-in">
            <h2>Stage 1: Game Details</h2>
            <p>Start with the basic information about your game.</p>
            <label>
                Game ID:
                <input name="gameId" value={config.metadata.gameId} onChange={handleMetadataChange} placeholder="e.g., my-awesome-game"/>
            </label>
            <label>
                Title:
                <input name="title" value={config.metadata.title} onChange={handleMetadataChange} placeholder="My Awesome Game"/>
            </label>
            <label>
                Description:
                <textarea name="description" value={config.metadata.description} onChange={handleMetadataChange} />
            </label>
            <label>
                Min Players:
                <input type="number" name="minPlayers" value={config.metadata.minPlayers} onChange={handleMetadataChange} />
            </label>
            <label>
                Max Players:
                <input type="number" name="maxPlayers" value={config.metadata.maxPlayers} onChange={handleMetadataChange} />
            </label>
        </div>
    );
};
