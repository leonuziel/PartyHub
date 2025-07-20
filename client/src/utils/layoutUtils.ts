import { CSSProperties } from 'react';

// --- Type Definitions ---
interface Spacing {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

type Alignment = 
  | 'TopLeft' | 'TopCenter' | 'TopRight'
  | 'MiddleLeft' | 'Center' | 'MiddleRight'
  | 'BottomLeft' | 'BottomCenter' | 'BottomRight';

export interface LayoutConfig {
  width?: string;
  height?: string;
  alignment?: Alignment;
  padding?: Spacing;
  offset?: Spacing;
}

export interface ComponentConfig {
    component: string;
    props: Record<string, any>;
    layout?: LayoutConfig;
    children?:any;
}

// --- Style Calculation Logic ---
export const getStyleFromLayout = (layout: LayoutConfig): CSSProperties => {
    const style: CSSProperties = {};

    // Sizing
    if (layout.width) {
        if (layout.width === 'hug' || layout.width === 'fit') {
            style.width = 'fit-content';
        } else if (layout.width === 'fill') {
            style.justifySelf = 'stretch';
        } else {
            style.width = layout.width;
        }
    }
    if (layout.height) {
        if (layout.height === 'hug' || layout.height === 'fit') {
            style.height = 'fit-content';
        } else if (layout.height === 'fill') {
            style.alignSelf = 'stretch';
        } else {
            style.height = layout.height;
        }
    }

    // Alignment
    if (layout.alignment) {
        const alignments = {
            TopLeft: { justifySelf: 'start', alignSelf: 'start' },
            TopCenter: { justifySelf: 'center', alignSelf: 'start' },
            TopRight: { justifySelf: 'end', alignSelf: 'start' },
            MiddleLeft: { justifySelf: 'start', alignSelf: 'center' },
            Center: { justifySelf: 'center', alignSelf: 'center' },
            MiddleRight: { justifySelf: 'end', alignSelf: 'center' },
            BottomLeft: { justifySelf: 'start', alignSelf: 'end' },
            BottomCenter: { justifySelf: 'center', alignSelf: 'end' },
            BottomRight: { justifySelf: 'end', alignSelf: 'end' },
        };
        Object.assign(style, alignments[layout.alignment]);
    }
    
    // Spacing
    if (layout.padding) {
        style.paddingTop = layout.padding.top ? `${layout.padding.top}px` : undefined;
        style.paddingBottom = layout.padding.bottom ? `${layout.padding.bottom}px` : undefined;
        style.paddingLeft = layout.padding.left ? `${layout.padding.left}px` : undefined;
        style.paddingRight = layout.padding.right ? `${layout.padding.right}px` : undefined;
    }
    if (layout.offset) {
        style.marginTop = layout.offset.top ? `${layout.offset.top}px` : undefined;
        style.marginBottom = layout.offset.bottom ? `${layout.offset.bottom}px` : undefined;
        style.marginLeft = layout.offset.left ? `${layout.offset.left}px` : undefined;
        style.marginRight = layout.offset.right ? `${layout.offset.right}px` : undefined;
    }

    return style;
};
