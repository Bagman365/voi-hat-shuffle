
import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ResultMessageProps {
  won: boolean;
  amount: number;
  onClose: () => void;
}

const ResultMessage: React.FC<ResultMessageProps> = ({ won, amount, onClose }) => {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <motion.div
        className={`
          relative p-8 rounded-lg shadow-xl backdrop-blur-lg
          ${won ? 'bg-gradient-to-r from-purple-600/80 to-blue-600/80' : 'bg-gradient-to-r from-red-600/80 to-purple-600/80'}
          border-2 ${won ? 'border-indigo-400' : 'border-red-400'}
        `}
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 12 }}
      >
        <button 
          className="absolute top-2 right-2 text-white/70 hover:text-white"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        
        <div className="text-center">
          <div className="text-4xl mb-2">
            {won ? '🎉' : '😢'}
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2">
            {won ? 'You Found Victor!' : 'Try Again'}
          </h3>
          
          {won && (
            <motion.div 
              className="text-xl text-white"
              initial={{ scale: 0.7 }}
              animate={{ scale: 1.2 }}
              transition={{ 
                repeat: 3,
                repeatType: 'reverse',
                duration: 0.6
              }}
            >
              +{amount} VOI
            </motion.div>
          )}
          
          {!won && (
            <p className="text-white/80">Victor was under a different hat.</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResultMessage;
