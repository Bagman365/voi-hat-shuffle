
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
    <div className="flex flex-col md:flex-row gap-5 items-center justify-center p-5 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg backdrop-blur-sm">
      <div className="flex flex-col w-full md:w-auto">
        <label className="text-base text-gray-300 mb-2">Wager Amount</label>
        <Input
          type="number"
          value={wagerAmount}
          onChange={(e) => onWagerChange(Number(e.target.value))}
          min={1}
          className="w-full md:w-36 bg-gray-800/50 text-white border-purple-500 text-lg h-12"
          disabled={isPlaying}
        />
      </div>
      
      <div className="flex flex-col w-full md:w-auto">
        <label className="text-base text-gray-300 mb-2">Shuffle Speed</label>
        <Select
          value={shuffleSpeed}
          onValueChange={(value: 'Normal' | 'Fast' | 'Extreme') => onShuffleSpeedChange(value)}
          disabled={isPlaying}
        >
          <SelectTrigger className="w-full md:w-36 bg-gray-800/50 text-white border-purple-500 text-lg h-12">
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
        className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold text-lg py-6 px-6 h-12"
      >
        {isPlaying ? (
          <>
            <Shuffle className="mr-2 h-5 w-5" />
            Shuffling...
          </>
        ) : (
          <>
            <Play className="mr-2 h-5 w-5" />
            Play Round
          </>
        )}
      </Button>
    </div>
  );
};

export default ControlsPanel;
