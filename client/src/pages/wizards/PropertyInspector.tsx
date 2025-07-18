import React, { useState, useEffect } from 'react';

export const PropertyInspector = ({ component, onUpdate, onClose }: { component: any, onUpdate: (id: string, newProps: any, newStyle: any) => void, onClose: () => void }) => {

    const [props, setProps] = useState(component.props || {});
    const [style, setStyle] = useState(component.style || {});
    const [propStrings, setPropStrings] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const initialProps = component.props || {};
        setProps(initialProps);
        setStyle(component.style || {});
        
        const initialPropStrings: { [key: string]: string } = {};
        for (const key in initialProps) {
            const value = initialProps[key];
            if (typeof value === 'string') {
                initialPropStrings[key] = value;
            } else {
                initialPropStrings[key] = JSON.stringify(value, null, 2);
            }
        }
        setPropStrings(initialPropStrings);
    }, [component]);

    const handlePropStringChange = (key: string, value: string) => {
        setPropStrings(prev => ({ ...prev, [key]: value }));
    };

    const parsePropValue = (key: string, rawString: string): { value: any; error: boolean } => {
        const originalValue = component.props[key];
        try {
            return { value: JSON.parse(rawString), error: false };
        } catch (e) {
            if (typeof originalValue === 'string') {
                return { value: rawString, error: false };
            } else {
                return { value: null, error: true };
            }
        }
    };

    const handlePropBlur = (key: string) => {
        const { value, error } = parsePropValue(key, propStrings[key]);
        if (error) {
             alert(`Invalid JSON in property: ${key}`);
        } else {
            setProps((prev:any) => ({ ...prev, [key]: value }));
        }
    };

    const handleStyleChange = (key: string, value: any) => {
        const newStyle = { ...style, [key]: value };
        setStyle(newStyle);
    };

    const handleSaveChanges = () => {
        const newProps = { ...props };
        let hasError = false;

        for (const key in propStrings) {
            if (key === 'children') continue;
            
            const { value, error } = parsePropValue(key, propStrings[key]);
            
            if (error) {
                alert(`Cannot save: Invalid JSON in property: ${key}`);
                hasError = true;
                break;
            }
            newProps[key] = value;
        }

        if (!hasError) {
            onUpdate(component.id, newProps, style);
            onClose();
        }
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
                     key !== 'children' && (
                        <div key={key}>
                            <label>{key}</label>
                            <textarea
                                value={propStrings[key] ?? ''}
                                onChange={(e) => handlePropStringChange(key, e.target.value)}
                                onBlur={() => handlePropBlur(key)}
                            />
                        </div>
                    )
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
