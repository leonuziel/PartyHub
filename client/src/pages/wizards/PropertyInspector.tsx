import React, { useState, useEffect } from 'react';

export const PropertyInspector = ({ component, onUpdate, onClose }: { component: any, onUpdate: (id: string, newProps: any, newStyle: any) => void, onClose: () => void }) => {
    if (!component) return null;

    const [props, setProps] = useState(component.props || {});
    const [style, setStyle] = useState(component.style || {});

    useEffect(() => {
        setProps(component.props || {});
        setStyle(component.style || {});
    }
    , [component]);

    const handlePropChange = (key: string, value: any) => {
        const newProps = { ...props, [key]: value };
        setProps(newProps);
    };

    const handleStyleChange = (key: string, value: any) => {
        const newStyle = { ...style, [key]: value };
        setStyle(newStyle);
    };

    const handleSaveChanges = () => {
        onUpdate(component.id, props, style);
        onClose();
    };

    return (
        <div className="property-inspector">
            <div className="inspector-header">
                <h3>{component.component}</h3>
                <button onClick={onClose} className="close-btn">&times;</button>
            </div>
            <div className="inspector-body">
                <h4>Properties</h4>
                {Object.keys(props).map(key => (
                    <div key={key}>
                        <label>{key}</label>
                        <textarea
                            value={JSON.stringify(props[key])}
                            onChange={(e) => handlePropChange(key, e.target.value)}
                        />
                    </div>
                ))}

                <h4>Styling</h4>
                <div>
                    <label>Background Color</label>
                    <input
                        type="text"
                        value={style.backgroundColor || ''}
                        onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    />
                </div>
                <div>
                    <label>Text Color</label>
                    <input
                        type="text"
                        value={style.color || ''}
                        onChange={(e) => handleStyleChange('color', e.target.value)}
                    />
                </div>
                <div>
                    <label>Flex Grow</label>
                    <input
                        type="number"
                        value={style.flexGrow || 0}
                        onChange={(e) => handleStyleChange('flexGrow', e.target.value)}
                    />
                </div>
            </div>
            <div className="inspector-footer">
                <button onClick={handleSaveChanges}>Save Changes</button>
            </div>
        </div>
    );
};
