
import React from 'react';
import { Trophy, Star } from 'lucide-react';

interface StatusPanelProps {
  wins: number;
  streak: number;
}

const StatusPanel: React.FC<StatusPanelProps> = ({ wins, streak }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Trophy className="h-5 w-5 text-yellow-400" />
        <div className="text-white">
          <span className="text-sm text-gray-300">Wins:</span>{" "}
          <span className="font-bold">{wins}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Star className="h-5 w-5 text-yellow-400" />
        <div className="text-white">
          <span className="text-sm text-gray-300">Streak:</span>{" "}
          <span className="font-bold">{streak}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;
