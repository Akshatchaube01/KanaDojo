import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSound } from '../hooks/useSound';

interface FlashcardProps {
  character: string;
  romaji: string;
  onCorrect: () => void;
  onIncorrect: () => void;
  showAnswer: boolean;
  onFlip: () => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({ 
  character, 
  romaji,
  showAnswer,
  onFlip,
}) => {
  const { playSound } = useSound();

  const handleFlip = () => {
    if (!showAnswer) {
      playSound('flip');
      onFlip();
    }
  };

  return (
    <div className="relative">
      <div
        className="relative w-64 h-80 cursor-pointer perspective-1000"
        onClick={handleFlip}
      >
        <motion.div
          animate={{ rotateY: showAnswer ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          className="absolute w-full h-full transform-style-preserve-3d"
        >
          {/* Front of card */}
          <div className="absolute w-full h-full bg-white rounded-xl shadow-lg backface-hidden flex items-center justify-center">
            <span className="text-7xl font-bold text-gray-800">{character}</span>
          </div>

          {/* Back of card */}
          <div className="absolute w-full h-full bg-white rounded-xl shadow-lg backface-hidden rotate-y-180 flex items-center justify-center">
            <span className="text-5xl font-bold text-gray-800">{romaji}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};