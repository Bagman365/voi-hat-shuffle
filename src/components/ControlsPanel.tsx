
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Shuffle } from 'lucide-react';

interface ControlsPanelProps {
  onPlay: () => void;
  isPlaying: boolean;
  wagerAmount: number;
  onWagerChange: (amount: number) => void;
  shuffleSpeed: 'Normal' | 'Fast' | 'Extreme';
  onShuffleSpeedChange: (speed: 'Normal' | 'Fast' | 'Extreme') => void;
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({
  onPlay,
  isPlaying,
  wagerAmount,
  onWagerChange,
  shuffleSpeed,
  onShuffleSpeedChange
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-center p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg backdrop-blur-sm">
      <div className="flex flex-col w-full md:w-auto">
        <label className="text-sm text-gray-300 mb-1">Wager Amount</label>
        <Input
          type="number"
          value={wagerAmount}
          onChange={(e) => onWagerChange(Number(e.target.value))}
          min={1}
          className="w-full md:w-32 bg-gray-800/50 text-white border-purple-500"
          disabled={isPlaying}
        />
      </div>
      
      <div className="flex flex-col w-full md:w-auto">
        <label className="text-sm text-gray-300 mb-1">Shuffle Speed</label>
        <Select
          value={shuffleSpeed}
          onValueChange={(value: 'Normal' | 'Fast' | 'Extreme') => onShuffleSpeedChange(value)}
          disabled={isPlaying}
        >
          <SelectTrigger className="w-full md:w-32 bg-gray-800/50 text-white border-purple-500">
            <SelectValue placeholder="Speed" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-purple-500">
            <SelectItem value="Normal">Normal</SelectItem>
            <SelectItem value="Fast">Fast</SelectItem>
            <SelectItem value="Extreme">Extreme</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button
        onClick={onPlay}
        disabled={isPlaying}
        className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold"
      >
        {isPlaying ? (
          <>
            <Shuffle className="mr-2 h-4 w-4" />
            Shuffling...
          </>
        ) : (
          <>
            <Play className="mr-2 h-4 w-4" />
            Play Round
          </>
        )}
      </Button>
    </div>
  );
};

export default ControlsPanel;
