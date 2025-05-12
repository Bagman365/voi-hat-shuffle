
import React from 'react';
import { Trophy, Star } from 'lucide-react';

interface StatusPanelProps {
  wins: number;
  streak: number;
}

const StatusPanel: React.FC<StatusPanelProps> = ({ wins, streak }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-5 items-center justify-center p-5 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Trophy className="h-6 w-6 text-yellow-400" />
        <div className="text-white">
          <span className="text-base text-gray-300">Wins:</span>{" "}
          <span className="font-bold text-lg">{wins}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Star className="h-6 w-6 text-yellow-400" />
        <div className="text-white">
          <span className="text-base text-gray-300">Streak:</span>{" "}
          <span className="font-bold text-lg">{streak}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;
