import React from 'react';

export const HStack = ({ children, style }: { children: React.ReactNode, style?: React.CSSProperties }) => {
    const defaultStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
    };

    return (
        <div style={{ ...defaultStyle, ...style }}>
            {children}
        </div>
    );
};
