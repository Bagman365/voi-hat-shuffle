
import React from 'react';
import { motion } from 'framer-motion';

interface HatProps {
  id: number;
  position: { x: number, y: number };
  hasBall: boolean;
  isRevealed: boolean;
  onSelect: (id: number) => void;
  isSelectable: boolean;
}

const Hat: React.FC<HatProps> = ({ 
  id, 
  position, 
  hasBall, 
  isRevealed, 
  onSelect,
  isSelectable
}) => {
  return (
    <motion.div
      className={`absolute cursor-pointer transition-transform duration-300 transform ${
        isSelectable ? 'hover:scale-110' : ''
      }`}
      initial={{ scale: 1, y: 0 }}
      animate={{ 
        x: position.x, 
        y: isRevealed ? -90 : position.y,
        scale: isRevealed ? 0.9 : 1,
      }}
      transition={{ duration: 0.4 }}
      onClick={() => isSelectable && onSelect(id)}
      whileHover={isSelectable ? { 
        scale: 1.1, 
        y: -10,
        filter: "drop-shadow(0 15px 15px rgba(0,0,0,0.4))" 
      } : {}}
      style={{
        width: '380px',
        height: '380px',
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.3))',
      }}
    >
      {/* Hat */}
      <motion.div
        className="w-full h-full flex items-center justify-center"
        animate={{ rotateX: isRevealed ? 45 : 0, y: isRevealed ? -70 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-full h-full relative">
          {/* Hat Bill - More squared and flat like a snapback */}
          <div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[320px] h-[65px]"
            style={{
              background: 'linear-gradient(to bottom, #6452c8, #503da3)',
              borderRadius: '8px 8px 50% 50% / 8px 8px 15px 15px',
              boxShadow: 'inset 0 -3px 10px rgba(0,0,0,0.2), 0 10px 10px -8px rgba(0,0,0,0.3)'
            }}
          >
            {/* Underside of bill - slightly darker */}
            <div 
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[300px] h-[8px]" 
              style={{
                background: '#3c2a87',
                borderRadius: '0 0 4px 4px'
              }}
            ></div>
          </div>
          
          {/* Hat Top - More structured with panels like a snapback */}
          <div 
            className="absolute bottom-[58px] left-1/2 transform -translate-x-1/2 w-[280px] h-[180px]"
            style={{
              background: 'linear-gradient(135deg, #6f5cc9 0%, #583eb7 50%, #4a31a8 100%)',
              borderTopLeftRadius: '140px',
              borderTopRightRadius: '140px',
              boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.15), 0 -3px 5px -3px rgba(255,255,255,0.2)',
              overflow: 'hidden'
            }}
          >
            {/* Fabric texture overlay */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20v20H0z\' fill=\'none\'/%3E%3Cpath d=\'M0 0h1v1H0zM5 5h1v1H5zM10 10h1v1h-1zM15 15h1v1h-1zM0 10h1v1H0zM10 0h1v1h-1zM5 15h1v1H5zM15 5h1v1h-1z\' fill=\'%23ffffff\' fill-opacity=\'0.05\'/%3E%3C/svg%3E")',
              }}
            ></div>
            
            {/* Hat panel seams */}
            <div 
              className="absolute top-0 left-1/2 h-full w-[1px] transform -translate-x-1/2" 
              style={{ background: 'rgba(0,0,0,0.12)' }}
            ></div>
            <div 
              className="absolute top-[60px] left-0 h-[1px] w-full" 
              style={{ background: 'rgba(0,0,0,0.08)' }}
            ></div>
          </div>
          
          {/* VOI Logo on Hat - Using a stylized SVG logo similar to the reference image */}
          <div className="absolute bottom-[110px] left-1/2 transform -translate-x-1/2 w-[120px] h-[40px]">
            <svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M10,30 L25,8 L40,30 M50,8 C65,8 65,30 50,30 C35,30 35,8 50,8 M60,30 L75,8 L90,30" 
                fill="none" 
                stroke="white" 
                strokeWidth="7" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          
          {/* Cap button on top */}
          <div 
            className="absolute bottom-[230px] left-1/2 transform -translate-x-1/2 w-[20px] h-[20px] rounded-full"
            style={{ background: 'radial-gradient(circle, #8068db, #6452c8)' }} 
          ></div>
        </div>
      </motion.div>
      
      {/* Ball (only visible when revealed) */}
      {hasBall && (
        <motion.div
          className="absolute left-1/2 bottom-[10px] transform -translate-x-1/2"
          initial={{ scale: 0 }}
          animate={{ scale: isRevealed ? 1 : 0 }}
          transition={{ duration: 0.3, delay: isRevealed ? 0.2 : 0 }}
        >
          <div 
            className="w-[120px] h-[120px] rounded-full" 
            style={{ 
              background: 'radial-gradient(circle at 70% 70%, #f066f9 5%, #D946EF 60%)',
              boxShadow: '0 15px 25px rgba(0,0,0,0.4), inset -5px -5px 20px rgba(0,0,0,0.2), inset 5px 5px 15px rgba(255,255,255,0.2)'
            }} 
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default Hat;
