import { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, PencilBrush, Rect, Circle, Line } from 'fabric';
import { Button } from '@/components/ui/button';
import { Pencil, Square, Circle as CircleIcon, Minus, Eraser, Undo2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DrawingCanvasProps {
  onShapeUpdate: (shapes: any[]) => void;
  pictureFrame: boolean;
  breakerPlacement: boolean;
  onPictureFrameChange: (value: boolean) => void;
  onBreakerPlacementChange: (value: boolean) => void;
}

export function DrawingCanvas({ 
  onShapeUpdate, 
  pictureFrame, 
  breakerPlacement,
  onPictureFrameChange,
  onBreakerPlacementChange
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<'draw' | 'rectangle' | 'circle' | 'line' | 'erase'>('draw');

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#1a1a1a',
    });

    // Initialize drawing brush
    const brush = new PencilBrush(canvas);
    brush.color = '#f59e0b';
    brush.width = 3;
    canvas.freeDrawingBrush = brush;

    setFabricCanvas(canvas);

    // Listen for object modifications
    canvas.on('object:added', () => updateShapes(canvas));
    canvas.on('object:modified', () => updateShapes(canvas));
    canvas.on('object:removed', () => updateShapes(canvas));

    return () => {
      canvas.dispose();
    };
  }, []);

  const updateShapes = (canvas: FabricCanvas) => {
    const objects = canvas.getObjects();
    const shapes = objects.map((obj) => ({
      type: obj.type,
      left: obj.left || 0,
      top: obj.top || 0,
      width: obj.width || 0,
      height: obj.height || 0,
      scaleX: obj.scaleX || 1,
      scaleY: obj.scaleY || 1,
    }));
    onShapeUpdate(shapes);
  };

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = activeTool === 'draw';
    
    if (activeTool === 'draw' && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = '#f59e0b';
      fabricCanvas.freeDrawingBrush.width = 3;
    }

    if (activeTool === 'erase' && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.isDrawingMode = true;
      fabricCanvas.freeDrawingBrush.color = '#1a1a1a';
      fabricCanvas.freeDrawingBrush.width = 20;
    }
  }, [activeTool, fabricCanvas]);

  const handleToolClick = (tool: typeof activeTool) => {
    if (!fabricCanvas) return;
    setActiveTool(tool);

    if (tool === 'rectangle') {
      const rect = new Rect({
        left: 200,
        top: 200,
        fill: 'transparent',
        stroke: '#f59e0b',
        strokeWidth: 3,
        width: 150,
        height: 100,
      });
      fabricCanvas.add(rect);
    } else if (tool === 'circle') {
      const circle = new Circle({
        left: 200,
        top: 200,
        fill: 'transparent',
        stroke: '#f59e0b',
        strokeWidth: 3,
        radius: 75,
      });
      fabricCanvas.add(circle);
    } else if (tool === 'line') {
      const line = new Line([100, 100, 300, 100], {
        stroke: '#f59e0b',
        strokeWidth: 3,
      });
      fabricCanvas.add(line);
    }
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = '#1a1a1a';
    fabricCanvas.renderAll();
    onShapeUpdate([]);
  };

  const handleUndo = () => {
    if (!fabricCanvas) return;
    const objects = fabricCanvas.getObjects();
    if (objects.length > 0) {
      fabricCanvas.remove(objects[objects.length - 1]);
      fabricCanvas.renderAll();
    }
  };

  const tools = [
    { id: 'draw', icon: Pencil, label: 'Draw' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: CircleIcon, label: 'Circle' },
    { id: 'line', icon: Minus, label: 'Line' },
    { id: 'erase', icon: Eraser, label: 'Erase' },
  ] as const;

  return (
    <div className="flex flex-col h-full bg-viewport">
      {/* Drawing Toolbar */}
      <div className="flex flex-col gap-3 p-3 bg-panel border-b border-panel-border">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Button
                  key={tool.id}
                  variant={activeTool === tool.id ? 'default' : 'secondary'}
                  size="sm"
                  onClick={() => handleToolClick(tool.id)}
                  className={cn(
                    'gap-2',
                    activeTool === tool.id && 'bg-primary text-primary-foreground'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tool.label}
                </Button>
              );
            })}
          </div>
          
          <div className="flex-1" />
          
          <Button variant="outline" size="sm" onClick={handleUndo}>
            <Undo2 className="w-4 h-4 mr-2" />
            Undo
          </Button>
          
          <Button variant="destructive" size="sm" onClick={handleClear}>
            Clear All
          </Button>
        </div>

        {/* Deck Options */}
        <div className="flex items-center gap-6 pt-2 border-t border-panel-border">
          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer hover:text-primary transition-colors">
            <input
              type="checkbox"
              checked={pictureFrame}
              onChange={(e) => onPictureFrameChange(e.target.checked)}
              className="w-4 h-4 rounded border-input accent-primary"
            />
            Picture Frame
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer hover:text-primary transition-colors">
            <input
              type="checkbox"
              checked={breakerPlacement}
              onChange={(e) => onBreakerPlacementChange(e.target.checked)}
              className="w-4 h-4 rounded border-input accent-primary"
            />
            Breaker Placement
          </label>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="border-2 border-panel-border rounded-lg overflow-hidden shadow-2xl">
          <canvas ref={canvasRef} />
        </div>
      </div>

      {/* Instructions */}
      <div className="p-3 bg-panel/50 border-t border-panel-border text-xs text-muted-foreground text-center">
        Draw your custom deck shape • Use tools to add rectangles and circles • Switch to 3D view to see your design
      </div>
    </div>
  );
}
