
import React from 'react';
import { motion } from 'framer-motion';

interface BallProps {
  visible: boolean;
}

const Ball: React.FC<BallProps> = ({ visible }) => {
  return (
    <motion.div
      className="w-[70px] h-[70px] bg-[#D946EF] rounded-full shadow-lg"
      initial={{ scale: 0 }}
      animate={{ scale: visible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    />
  );
};

export default Ball;
