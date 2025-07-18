import React, { useState, useEffect } from 'react';
import './PropertyInspector.css';
export const PropertyInspector = ({ component, onUpdate, onClose }: { component: any, onUpdate: (id: string, newProps: any, newLayout: any) => void, onClose: () => void }) => {

    const [props, setProps] = useState(component.props || {});
    const [layout, setLayout] = useState(component.layout || {});
    const [propStrings, setPropStrings] = useState<{ [key: string]: string }>({});
    const [sizingMode, setSizingMode] = useState<{ width: string, height: string }>({ width: 'fill', height: 'fill' });

    useEffect(() => {
        const initialProps = component.props || {};
        setProps(initialProps);
        const initialLayout = component.layout || {};
        setLayout(initialLayout);
        
        // Determine initial sizing modes
        const widthMode = initialLayout.width?.endsWith('%') || initialLayout.width?.endsWith('px') ? 'fixed' : (initialLayout.width || 'fill');
        const heightMode = initialLayout.height?.endsWith('%') || initialLayout.height?.endsWith('px') ? 'fixed' : (initialLayout.height || 'fill');
        setSizingMode({ width: widthMode, height: heightMode });

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

    const handleLayoutChange = (key: string, value: any) => {
        const newLayout = { ...layout, [key]: value };
        setLayout(newLayout);
    };
    
    const handleSpacingChange = (type: 'padding' | 'offset', side: string, value: string) => {
        const newLayout = { ...layout };
        if (!newLayout[type]) {
            newLayout[type] = {};
        }
        newLayout[type][side] = value === '' ? undefined : Number(value);
        setLayout(newLayout);
    };

    const handleSizingModeChange = (dimension: 'width' | 'height', mode: string) => {
        setSizingMode(prev => ({ ...prev, [dimension]: mode }));
        if (mode !== 'fixed') {
            handleLayoutChange(dimension, mode);
        }
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
            onUpdate(component.id, newProps, layout);
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

                <h4>Layout</h4>
                {/* Sizing Controls */}
                <div className="layout-group">
                    <h5>Sizing</h5>
                    <label>Width</label>
                    <select value={sizingMode.width} onChange={(e) => handleSizingModeChange('width', e.target.value)}>
                        <option value="fill">Fill</option>
                        <option value="hug">Hug</option>
                        <option value="fixed">Fixed</option>
                    </select>
                    {sizingMode.width === 'fixed' && (
                        <input
                            type="text"
                            placeholder="e.g., 80% or 250px"
                            value={layout.width || ''}
                            onChange={(e) => handleLayoutChange('width', e.target.value)}
                        />
                    )}
                    <label>Height</label>
                    <select value={sizingMode.height} onChange={(e) => handleSizingModeChange('height', e.target.value)}>
                        <option value="fill">Fill</option>
                        <option value="hug">Hug</option>
                        <option value="fixed">Fixed</option>
                    </select>
                    {sizingMode.height === 'fixed' && (
                        <input
                            type="text"
                            placeholder="e.g., 50% or 100px"
                            value={layout.height || ''}
                            onChange={(e) => handleLayoutChange('height', e.target.value)}
                        />
                    )}
                </div>

                {/* Alignment Controls */}
                <div className="layout-group">
                    <h5>Alignment</h5>
                    <div className="alignment-grid">
                        {([
                            { val: 'TopLeft', symbol: '↖' }, { val: 'TopCenter', symbol: '↑' }, { val: 'TopRight', symbol: '↗' },
                            { val: 'MiddleLeft', symbol: '←' }, { val: 'Center', symbol: '·' }, { val: 'MiddleRight', symbol: '→' },
                            { val: 'BottomLeft', symbol: '↙' }, { val: 'BottomCenter', symbol: '↓' }, { val: 'BottomRight', symbol: '↘' }
                        ]).map(align => (
                            <button 
                                key={align.val} 
                                className={layout.alignment === align.val ? 'active' : ''} 
                                onClick={() => handleLayoutChange('alignment', align.val)}
                                title={align.val}
                            >
                                {align.symbol}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Spacing Controls */}
                <div className="layout-group">
                    <h5>Padding (px)</h5>
                    <div className="spacing-inputs">
                        <input type="number" placeholder="Top" value={layout.padding?.top || ''} onChange={(e) => handleSpacingChange('padding', 'top', e.target.value)} />
                        <input type="number" placeholder="Right" value={layout.padding?.right || ''} onChange={(e) => handleSpacingChange('padding', 'right', e.target.value)} />
                        <input type="number" placeholder="Bottom" value={layout.padding?.bottom || ''} onChange={(e) => handleSpacingChange('padding', 'bottom', e.target.value)} />
                        <input type="number" placeholder="Left" value={layout.padding?.left || ''} onChange={(e) => handleSpacingChange('padding', 'left', e.target.value)} />
                    </div>
                </div>
                 <div className="layout-group">
                    <h5>Offset (Margin, px)</h5>
                    <div className="spacing-inputs">
                        <input type="number" placeholder="Top" value={layout.offset?.top || ''} onChange={(e) => handleSpacingChange('offset', 'top', e.target.value)} />
                        <input type="number" placeholder="Right" value={layout.offset?.right || ''} onChange={(e) => handleSpacingChange('offset', 'right', e.target.value)} />
                        <input type="number" placeholder="Bottom" value={layout.offset?.bottom || ''} onChange={(e) => handleSpacingChange('offset', 'bottom', e.target.value)} />
                        <input type="number" placeholder="Left" value={layout.offset?.left || ''} onChange={(e) => handleSpacingChange('offset', 'left', e.target.value)} />
                    </div>
                </div>
            </div>
            <div className="inspector-footer">
                <button onClick={handleSaveChanges}>Save Changes</button>
            </div>
        </div>
    );
};
