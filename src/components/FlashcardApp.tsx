import React, { useState, useCallback, useMemo } from 'react';
import { Flashcard } from './Flashcard';
import { hiragana, katakana } from '../data/japanese';
import { ArrowLeft, ArrowRight, Repeat, Shuffle, Home, Trophy, Flame, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useSound } from '../hooks/useSound';

type Mode = 'hiragana' | 'katakana' | 'mixed';

function FlashcardApp() {
  const [mode, setMode] = useState<Mode>('hiragana');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const { playSound } = useSound();

  const characters = useMemo(() => {
    let cards = mode === 'hiragana' ? [...hiragana] 
              : mode === 'katakana' ? [...katakana]
              : [...hiragana, ...katakana];
    
    if (isShuffled) {
      return cards.sort(() => Math.random() - 0.5);
    }
    return cards;
  }, [mode, isShuffled]);

  const nextCard = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % characters.length);
    setShowAnswer(false);
  }, [characters.length]);

  const previousCard = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + characters.length) % characters.length);
    setShowAnswer(false);
  }, [characters.length]);

  const handleCorrect = () => {
    const newStreak = streak + 1;
    setStreak(newStreak);
    playSound('correct');
    
    if (newStreak > bestStreak) {
      setBestStreak(newStreak);
      if (newStreak % 5 === 0) {
        setShowConfetti(true);
        playSound('achievement');
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
    
    nextCard();
  };

  const handleIncorrect = () => {
    setStreak(0);
    nextCard();
  };

  const toggleMode = useCallback(() => {
    setMode((prev) => {
      if (prev === 'hiragana') return 'katakana';
      if (prev === 'katakana') return 'mixed';
      return 'hiragana';
    });
    setCurrentIndex(0);
    setStreak(0);
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffled(prev => !prev);
    setCurrentIndex(0);
    setStreak(0);
  }, []);

  const resetProgress = () => {
    setStreak(0);
    setBestStreak(0);
    setCurrentIndex(0);
    setShowAnswer(false);
    setIsShuffled(false);
    setMode('hiragana');
  };

  const getModeText = () => {
    switch(mode) {
      case 'hiragana': return 'Hiragana';
      case 'katakana': return 'Katakana';
      case 'mixed': return 'Mixed';
    }
  };

  const getNextModeText = () => {
    switch(mode) {
      case 'hiragana': return 'Katakana';
      case 'katakana': return 'Mixed';
      case 'mixed': return 'Hiragana';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <Link
        to="/"
        className="absolute top-4 left-4 p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
      >
        <Home className="w-6 h-6 text-gray-700" />
      </Link>

      <div className="absolute top-4 right-4 flex items-center gap-4">
        <motion.div
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md"
          animate={{ scale: streak > 0 ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          <Flame className="w-5 h-5 text-orange-500" />
          <span className="font-semibold">{streak}</span>
        </motion.div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="font-semibold">{bestStreak}</span>
        </div>

        <button
          onClick={resetProgress}
          className="flex items-center gap-2 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
          title="Reset Progress"
        >
          <RotateCcw className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Learn {getModeText()}
        </h1>
        <p className="text-gray-600">
          Click the card to reveal the romaji pronunciation
        </p>
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center gap-8">
          <button
            onClick={previousCard}
            className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
            aria-label="Previous card"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Flashcard
                character={characters[currentIndex].character}
                romaji={characters[currentIndex].romaji}
                onCorrect={handleCorrect}
                onIncorrect={handleIncorrect}
                showAnswer={showAnswer}
                onFlip={() => setShowAnswer(true)}
              />
            </motion.div>
          </AnimatePresence>

          <button
            onClick={nextCard}
            className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
            aria-label="Next card"
          >
            <ArrowRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {showAnswer && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center gap-4"
          >
            <button
              onClick={handleCorrect}
              className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              I knew it!
            </button>
            <button
              onClick={handleIncorrect}
              className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              Still learning
            </button>
          </motion.div>
        )}
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={toggleMode}
          className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
        >
          <Repeat className="w-5 h-5" />
          <span>Switch to {getNextModeText()}</span>
        </button>

        <button
          onClick={toggleShuffle}
          className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-shadow ${
            isShuffled ? 'bg-indigo-500 text-white' : 'bg-white text-gray-800'
          }`}
        >
          <Shuffle className="w-5 h-5" />
          <span>{isShuffled ? 'Shuffled' : 'Shuffle'}</span>
        </button>
      </div>

      <div className="mt-4 text-gray-600">
        Card {currentIndex + 1} of {characters.length}
      </div>
    </div>
  );
}

export default FlashcardApp;