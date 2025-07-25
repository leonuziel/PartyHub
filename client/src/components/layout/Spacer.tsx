import React from 'react';

export const Spacer = ({ style }: { style?: React.CSSProperties }) => {
    const defaultStyle: React.CSSProperties = {
        flexGrow: 1,
    };

    return (
<div data-testid="spacer" style={{ ...defaultStyle, ...style }} />
    );
};
