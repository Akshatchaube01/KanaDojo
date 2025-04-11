import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import FlashcardApp from './components/FlashcardApp';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/learn" element={<FlashcardApp />} />
    </Routes>
  );
}

export default App;