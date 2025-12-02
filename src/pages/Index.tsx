import { useState } from 'react';
import { DeckCanvas } from '@/components/DeckCanvas';
import { ControlPanel } from '@/components/ControlPanel';
import { MaterialPanel } from '@/components/MaterialPanel';
import { Button } from '@/components/ui/button';
import { Share2, Menu } from 'lucide-react';

const Index = () => {
  const [deckWidth, setDeckWidth] = useState(4);
  const [deckLength, setDeckLength] = useState(6);
  const [boardColor, setBoardColor] = useState('#4a5568');
  const [frameColor, setFrameColor] = useState('#ddb892');
  const [boardOrientation, setBoardOrientation] = useState<'horizontal' | 'vertical'>('horizontal');

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
      </div>
    </div>
  );
};

export default Index;
