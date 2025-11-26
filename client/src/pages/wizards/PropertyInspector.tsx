import React, { useState, useEffect } from 'react';
import './PropertyInspector.css';
const getStylePropsForComponent = (componentName: string): string[] => {
  const containerStyleProps = ['backgroundColor', 'padding', 'borderRadius', 'border'];
  const textStyleProps = ['fontSize', 'fontWeight', 'fontFamily', 'color', 'textAlign'];

  switch (componentName) {
    case 'TextDisplay':
    case 'KeyValueDisplay':
    case 'StateIndicator':
    case 'Timer':
    case 'Card':
    case 'Dice':
    case 'TextInput':
      return [...textStyleProps, ...containerStyleProps];
    case 'ImageDisplay':
    case 'ListDisplay':
    case 'CardContainer':
    case 'Container':
    case 'Grid':
    case 'Stack':
      return containerStyleProps;
    case 'Button':
      return ['variant', ...textStyleProps, ...containerStyleProps];
    case 'ChoiceSelector':
    case 'Slider':
        return ['fontSize', 'fontWeight', 'fontFamily', 'color', ...containerStyleProps]
    default:
      return [];
  }
};

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
        if (rawString.trim() === '') {
            return { value: undefined, error: false }; // Allow unsetting optional props
        }
        try {
            const parsed = JSON.parse(rawString);
             // It's valid JSON, but not a string literal. Use the parsed value.
            if (typeof parsed !== 'string') {
                return { value: parsed, error: false };
            }
        } catch (e) {
            // It's not a valid JSON literal (e.g., just a word like 'red' or a CSS value).
            // Treat it as a raw string. This is the desired behavior for style props.
            return { value: rawString, error: false };
        }
         // It was a string wrapped in quotes (e.g., '"hello"'). Return the raw, unwrapped string.
        return { value: rawString, error: false };
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
                {Object.keys(props).filter(key => !getStylePropsForComponent(component.component).includes(key) && key !== 'children').map(key => (
                    <div key={key}>
                        <label>{key}</label>
                        <textarea
                            value={propStrings[key] ?? ''}
                            onChange={(e) => handlePropStringChange(key, e.target.value)}
                            onBlur={() => handlePropBlur(key)}
                        />
                    </div>
                ))}

                <h4>Appearance</h4>
                <div className="layout-group">
                {getStylePropsForComponent(component.component).map(key => (
                    <div key={key} className="style-prop-input">
                        <label>{key}</label>
                        <input
                            type={key === 'color' || key === 'backgroundColor' ? 'color' : 'text'}
                            value={propStrings[key] ?? ''}
                            onChange={(e) => handlePropStringChange(key, e.target.value)}
                            onBlur={() => handlePropBlur(key)}
                        />
                         { (key === 'color' || key === 'backgroundColor') &&
                            <input
                                type="text"
                                className="style-prop-input-text"
                                placeholder="e.g. #ff0000 or {{some.variable}}"
                                value={propStrings[key] ?? ''}
                                onChange={(e) => handlePropStringChange(key, e.target.value)}
                                onBlur={() => handlePropBlur(key)}
                            />
                         }
                    </div>
                ))}
                </div>

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
