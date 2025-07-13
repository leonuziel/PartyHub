import React from 'react';

export const VStack = ({ children, style }: { children: React.ReactNode, style?: React.CSSProperties }) => {
    const defaultStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
    };

    return (
        <div style={{ ...defaultStyle, ...style }}>
            {children}
        </div>
    );
};
