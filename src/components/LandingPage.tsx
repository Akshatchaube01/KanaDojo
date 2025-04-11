import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { hiragana, katakana } from '../data/japanese';

interface FallingCharacter {
  id: number;
  char: string;
  x: number;
  delay: number;
}

function LandingPage() {
  const [characters, setCharacters] = useState<FallingCharacter[]>([]);

  useEffect(() => {
    const allChars = [...hiragana, ...katakana].map(c => c.character);
    const fallingChars: FallingCharacter[] = [];
    
    for (let i = 0; i < 30; i++) {
      fallingChars.push({
        id: i,
        char: allChars[Math.floor(Math.random() * allChars.length)],
        x: Math.random() * 100,
        delay: Math.random() * 20
      });
    }
    
    setCharacters(fallingChars);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
      {/* Falling characters */}
      {characters.map((char) => (
        <motion.div
          key={char.id}
          initial={{ y: -100, x: `${char.x}vw`, opacity: 0 }}
          animate={{
            y: '120vh',
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 20,
            delay: char.delay,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute text-white/20 text-4xl font-bold pointer-events-none"
        >
          {char.char}
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-7xl font-bold text-white mb-6"
        >
          Learn Japanese
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-white/90 mb-12 max-w-2xl"
        >
          Master Hiragana and Katakana with our interactive flashcards. Start your journey to reading Japanese today!
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link
            to="/learn"
            className="group flex items-center gap-2 px-8 py-4 bg-white rounded-full text-xl font-semibold text-indigo-600 hover:bg-opacity-95 transition-all transform hover:scale-105 shadow-lg"
          >
            <Play className="w-6 h-6" />
            <span>Start Learning</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default LandingPage;