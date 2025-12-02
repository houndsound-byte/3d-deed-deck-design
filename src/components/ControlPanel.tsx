import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface ControlPanelProps {
  deckWidth: number;
  deckLength: number;
  boardOrientation: 'horizontal' | 'vertical';
  onWidthChange: (value: number) => void;
  onLengthChange: (value: number) => void;
  onOrientationToggle: () => void;
  onReset: () => void;
}

export function ControlPanel({
  deckWidth,
  deckLength,
  boardOrientation,
  onWidthChange,
  onLengthChange,
  onOrientationToggle,
  onReset,
}: ControlPanelProps) {
  return (
    <div className="w-80 bg-panel border-r border-panel-border h-full overflow-y-auto">
      <div className="p-4 border-b border-panel-border">
        <h2 className="text-lg font-semibold text-panel-foreground">Deck Details</h2>
      </div>

      <div className="p-4 space-y-6">
        {/* Dimensions */}
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-panel-foreground mb-2 block">
              Width: {deckWidth.toFixed(1)}m
            </Label>
            <Slider
              value={[deckWidth]}
              onValueChange={([value]) => onWidthChange(value)}
              min={2}
              max={8}
              step={0.5}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-sm text-panel-foreground mb-2 block">
              Length: {deckLength.toFixed(1)}m
            </Label>
            <Slider
              value={[deckLength]}
              onValueChange={([value]) => onLengthChange(value)}
              min={2}
              max={8}
              step={0.5}
              className="w-full"
            />
          </div>
        </div>

        {/* Board Orientation */}
        <div>
          <Label className="text-sm text-panel-foreground mb-2 block">
            Board Orientation
          </Label>
          <Button
            onClick={onOrientationToggle}
            variant="secondary"
            className="w-full"
          >
            {boardOrientation === 'horizontal' ? 'Horizontal' : 'Vertical'}
          </Button>
        </div>

        {/* Reset Button */}
        <Button
          onClick={onReset}
          variant="outline"
          className="w-full"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset Design
        </Button>

        {/* Info */}
        <div className="mt-6 p-3 bg-secondary rounded text-xs text-muted-foreground space-y-1">
          <p>• Use mouse to rotate view</p>
          <p>• Scroll to zoom in/out</p>
          <p>• Adjust dimensions with sliders</p>
        </div>
      </div>
    </div>
  );
}
