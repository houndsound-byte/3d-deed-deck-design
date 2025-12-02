import { useState } from 'react';
import { DeckCanvas } from '@/components/DeckCanvas';
import { ControlPanel } from '@/components/ControlPanel';
import { MaterialPanel } from '@/components/MaterialPanel';
import { DrawingCanvas } from '@/components/DrawingCanvas';
import { Custom3DView } from '@/components/Custom3DView';
import { Button } from '@/components/ui/button';
import { Share2, Menu, Box, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const [mode, setMode] = useState<'parametric' | 'freeform'>('parametric');
  const [deckWidth, setDeckWidth] = useState(4);
  const [deckLength, setDeckLength] = useState(6);
  const [boardColor, setBoardColor] = useState('#4a5568');
  const [frameColor, setFrameColor] = useState('#ddb892');
  const [boardOrientation, setBoardOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [customShapes, setCustomShapes] = useState<any[]>([]);

  const handleReset = () => {
    setDeckWidth(4);
    setDeckLength(6);
    setBoardColor('#4a5568');
    setFrameColor('#ddb892');
    setBoardOrientation('horizontal');
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-primary">DeckForge</h1>
          <span className="text-sm text-muted-foreground">My Deck Design</span>
          
          {/* Mode Toggle */}
          <div className="flex gap-1 ml-4 bg-secondary rounded-lg p-1">
            <Button
              variant={mode === 'parametric' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMode('parametric')}
              className={cn('gap-2', mode === 'parametric' && 'bg-primary text-primary-foreground')}
            >
              <Box className="w-4 h-4" />
              Parametric
            </Button>
            <Button
              variant={mode === 'freeform' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMode('freeform')}
              className={cn('gap-2', mode === 'freeform' && 'bg-primary text-primary-foreground')}
            >
              <Pencil className="w-4 h-4" />
              Freeform
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share Design
          </Button>
          <Button size="sm">
            <Menu className="w-4 h-4 mr-2" />
            Menu
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {mode === 'parametric' ? (
          <>
            {/* Left Sidebar - Controls */}
            <ControlPanel
              deckWidth={deckWidth}
              deckLength={deckLength}
              boardOrientation={boardOrientation}
              onWidthChange={setDeckWidth}
              onLengthChange={setDeckLength}
              onOrientationToggle={() =>
                setBoardOrientation((prev) =>
                  prev === 'horizontal' ? 'vertical' : 'horizontal'
                )
              }
              onReset={handleReset}
            />

            {/* Center - 3D Viewport */}
            <div className="flex-1 relative">
              <DeckCanvas
                deckWidth={deckWidth}
                deckLength={deckLength}
                boardColor={boardColor}
                frameColor={frameColor}
                boardOrientation={boardOrientation}
              />
              
              {/* View Info Overlay */}
              <div className="absolute top-4 left-4 bg-panel/90 backdrop-blur-sm border border-panel-border rounded px-3 py-2">
                <p className="text-xs text-panel-foreground">
                  {deckWidth}m × {deckLength}m deck
                </p>
              </div>
            </div>

            {/* Right Sidebar - Materials */}
            <MaterialPanel
              boardColor={boardColor}
              frameColor={frameColor}
              onBoardColorChange={setBoardColor}
              onFrameColorChange={setFrameColor}
            />
          </>
        ) : (
          <>
            {/* Freeform Mode - Split View */}
            <div className="flex-1 flex flex-col">
              {/* Drawing Canvas */}
              <div className="flex-1">
                <DrawingCanvas onShapeUpdate={setCustomShapes} />
              </div>
            </div>

            {/* Right Sidebar - 3D Preview + Materials */}
            <div className="w-[500px] flex flex-col border-l border-panel-border">
              <div className="flex-1">
                <Custom3DView
                  shapes={customShapes}
                  boardColor={boardColor}
                  frameColor={frameColor}
                />
              </div>
              <div className="h-1/2 border-t border-panel-border overflow-y-auto">
                <MaterialPanel
                  boardColor={boardColor}
                  frameColor={frameColor}
                  onBoardColorChange={setBoardColor}
                  onFrameColorChange={setFrameColor}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
