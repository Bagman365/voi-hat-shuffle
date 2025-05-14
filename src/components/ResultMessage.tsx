
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, CheckCircle, XCircle } from 'lucide-react';

interface ResultMessageProps {
  won: boolean;
  amount: number;
  onClose: () => void;
  transactionId?: string;
  verificationUrl?: string;
}

const ResultMessage: React.FC<ResultMessageProps> = ({ 
  won, 
  amount, 
  onClose,
  transactionId,
  verificationUrl
}) => {
  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl p-6 max-w-md w-[90%] shadow-xl border border-purple-500/30"
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 12 }}
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1.2, rotateZ: won ? 10 : -10 }}
            transition={{ delay: 0.2, duration: 0.4, type: "spring" }}
            className="mx-auto mb-4"
          >
            {won ? (
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
            ) : (
              <XCircle className="w-16 h-16 text-red-400 mx-auto" />
            )}
          </motion.div>
          
          <h2 className="text-2xl font-bold mb-2 text-white">
            {won ? 'You Won!' : 'Better Luck Next Time!'}
          </h2>
          
          {won && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl font-medium text-green-400 mb-4"
            >
              +{amount} VOI
            </motion.div>
          )}
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-300 mb-6"
          >
            {won 
              ? 'Congratulations! Your prize has been added to your wallet.' 
              : 'The ball was under a different hat. Try again!'}
          </motion.p>

          {/* Verification link to blockchain explorer */}
          {verificationUrl && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-5"
            >
              <p className="text-sm text-gray-400 mb-2">Blockchain verified result:</p>
              <a 
                href={verificationUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center text-purple-400 hover:text-purple-300 text-sm"
              >
                <span className="truncate max-w-[200px]">
                  {transactionId || 'View Transaction'}
                </span>
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </motion.div>
          )}
          
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            onClick={onClose}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full transition-colors"
          >
            Continue
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResultMessage;
