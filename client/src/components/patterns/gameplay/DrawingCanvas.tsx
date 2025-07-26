import React, { useRef, useEffect, useState } from 'react';
import './DrawingCanvas.css';

interface DrawingCanvasProps {
  isReadOnly: boolean;
  drawingData?: string; // Base64 encoded image data
  onDraw: (data: string) => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ isReadOnly, drawingData, onDraw }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if(context){
          context.lineCap = 'round';
          context.strokeStyle = color;
          context.lineWidth = brushSize;
          contextRef.current = context;
      }
    }
  }, [color, brushSize, canvasRef.current?.width, canvasRef.current?.height]);

  useEffect(() => {
    if(isReadOnly && drawingData && canvasRef.current && contextRef.current) {
        const image = new Image();
        image.onload = () => {
            contextRef.current?.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
            contextRef.current?.drawImage(image, 0, 0);
        };
        image.src = drawingData;
    }
  }, [isReadOnly, drawingData]);

  const startDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if(isReadOnly) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    if(isReadOnly) return;
    contextRef.current?.closePath();
    setIsDrawing(false);
    if(canvasRef.current){
        onDraw(canvasRef.current.toDataURL());
    }
  };

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isReadOnly) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current?.lineTo(offsetX, offsetY);
    contextRef.current?.stroke();
  };

  const clearCanvas = () => {
      if(isReadOnly || !canvasRef.current || !contextRef.current) return;
      console.log('Clearing canvas');
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      onDraw('');
  }

  return (
    <div className="drawing-canvas-container">
      <canvas
        ref={canvasRef}
        width={500}
        height={400}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        onMouseLeave={finishDrawing}
        className={isReadOnly ? 'read-only' : ''}
        data-testid="drawing-canvas"
      />
      {!isReadOnly && (
        <div className="drawing-controls">
            <input type="color" data-testid="color-picker" value={color} onChange={(e) => setColor(e.target.value)} />
            <input type="range" min="1" max="20" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value, 10))} />
            <button onClick={clearCanvas} data-testid="clear-button">Clear</button>
        </div>
      )}
    </div>
  );
};
