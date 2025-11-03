import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from "lucide-react";
import { AlgorithmType } from "@/types/pageReplacement";

interface ControlPanelProps {
  algorithm: AlgorithmType;
  setAlgorithm: (algo: AlgorithmType) => void;
  referenceString: string;
  setReferenceString: (str: string) => void;
  frameCount: number;
  setFrameCount: (count: number) => void;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onReset: () => void;
  onStart: () => void;
  speed: number;
  setSpeed: (speed: number) => void;
  isSimulating: boolean;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export const ControlPanel = ({
  algorithm,
  setAlgorithm,
  referenceString,
  setReferenceString,
  frameCount,
  setFrameCount,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onReset,
  onStart,
  speed,
  setSpeed,
  isSimulating,
  canGoNext,
  canGoPrevious,
}: ControlPanelProps) => {
  return (
    <div className="bg-card rounded-lg shadow-card p-6 space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="algorithm">Algorithm</Label>
          <Select value={algorithm} onValueChange={(value) => setAlgorithm(value as AlgorithmType)}>
            <SelectTrigger id="algorithm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FIFO">FIFO (First In First Out)</SelectItem>
              <SelectItem value="LRU">LRU (Least Recently Used)</SelectItem>
              <SelectItem value="Optimal">Optimal</SelectItem>
              <SelectItem value="Clock">Clock Algorithm</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="reference-string">Reference String (comma-separated)</Label>
          <Input
            id="reference-string"
            value={referenceString}
            onChange={(e) => setReferenceString(e.target.value)}
            placeholder="e.g., 7,0,1,2,0,3,0,4,2,3"
            disabled={isSimulating}
          />
        </div>

        <div>
          <Label htmlFor="frame-count">Number of Frames: {frameCount}</Label>
          <Slider
            id="frame-count"
            min={1}
            max={7}
            step={1}
            value={[frameCount]}
            onValueChange={(value) => setFrameCount(value[0])}
            disabled={isSimulating}
            className="mt-2"
          />
        </div>

        <Button onClick={onStart} className="w-full" disabled={isSimulating || !referenceString.trim()}>
          Start Simulation
        </Button>
      </div>

      {isSimulating && (
        <div className="space-y-4 pt-4 border-t">
          <div className="flex gap-2 justify-center">
            <Button
              size="icon"
              variant="outline"
              onClick={onPrevious}
              disabled={!canGoPrevious}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              onClick={isPlaying ? onPause : onPlay}
              disabled={!canGoNext && !isPlaying}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={onNext}
              disabled={!canGoNext}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={onReset}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <div>
            <Label>Animation Speed: {speed}ms</Label>
            <Slider
              min={200}
              max={2000}
              step={100}
              value={[speed]}
              onValueChange={(value) => setSpeed(value[0])}
              className="mt-2"
            />
          </div>
        </div>
      )}
    </div>
  );
};
