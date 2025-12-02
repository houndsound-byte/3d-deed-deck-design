import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface MaterialPanelProps {
  boardColor: string;
  frameColor: string;
  onBoardColorChange: (color: string) => void;
  onFrameColorChange: (color: string) => void;
}

const boardMaterials = [
  { name: 'Charcoal', color: '#4a5568' },
  { name: 'Cedar', color: '#b08968' },
  { name: 'Walnut', color: '#6b5d52' },
  { name: 'Grey', color: '#718096' },
  { name: 'Teak', color: '#a0826d' },
  { name: 'Ebony', color: '#2d3748' },
];

const frameMaterials = [
  { name: 'Natural Oak', color: '#ddb892' },
  { name: 'Dark Oak', color: '#8b7355' },
  { name: 'Maple', color: '#e8d5c4' },
  { name: 'Pine', color: '#c9a66b' },
];

export function MaterialPanel({
  boardColor,
  frameColor,
  onBoardColorChange,
  onFrameColorChange,
}: MaterialPanelProps) {
  return (
    <div className="w-80 bg-panel border-l border-panel-border h-full overflow-y-auto">
      <div className="p-4 border-b border-panel-border">
        <h2 className="text-lg font-semibold text-panel-foreground">Materials</h2>
      </div>

      <div className="p-4 space-y-6">
        {/* Board Material */}
        <div>
          <Label className="text-sm text-panel-foreground mb-3 block">
            Deck Boards
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {boardMaterials.map((material) => (
              <button
                key={material.name}
                onClick={() => onBoardColorChange(material.color)}
                className={cn(
                  'p-3 rounded border-2 transition-all hover:border-primary/50',
                  boardColor === material.color
                    ? 'border-primary'
                    : 'border-panel-border'
                )}
              >
                <div
                  className="w-full h-12 rounded mb-2"
                  style={{ backgroundColor: material.color }}
                />
                <p className="text-xs text-panel-foreground text-center">
                  {material.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Frame Material */}
        <div>
          <Label className="text-sm text-panel-foreground mb-3 block">
            Frame Lumber
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {frameMaterials.map((material) => (
              <button
                key={material.name}
                onClick={() => onFrameColorChange(material.color)}
                className={cn(
                  'p-3 rounded border-2 transition-all hover:border-primary/50',
                  frameColor === material.color
                    ? 'border-primary'
                    : 'border-panel-border'
                )}
              >
                <div
                  className="w-full h-12 rounded mb-2"
                  style={{ backgroundColor: material.color }}
                />
                <p className="text-xs text-panel-foreground text-center">
                  {material.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Material Info */}
        <div className="p-3 bg-secondary rounded text-xs text-muted-foreground">
          <p className="font-semibold mb-1">Material Tips:</p>
          <p>Darker boards show less wear over time</p>
        </div>
      </div>
    </div>
  );
}
