'use client';

import { useState, useEffect } from "react";
import SetupView from "./views/SetupView";
import GameView from "./views/GameView";
import ResultsView from "./views/ResultView";

type GameState = "setup" | "playing" | "finished";

export default function Home() {
  const [selectedOp, setSelectedOp] = useState<string | null>(null);
  const [selectedNum, setSelectedNum] = useState<number | string | null>(null);

  const [gameState, setGameState] = useState<GameState>("setup");
  const [finalScore, setFinalScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const [storageKey, setStorageKey] = useState('highscore_default');

  useEffect(() => {
    const op = selectedOp || 'add';
    const key = selectedNum === 'mix' ? 'highscore_mix' : `highscore_${op}`;
    setStorageKey(key);
  }, [selectedOp, selectedNum]);

  const handleStartGame = () => {
    if (selectedOp && selectedNum !== null) {
      setGameState("playing");
    }
  };

  const handleTimeUp = (score: number) => {
    const oldHighScore = parseInt(localStorage.getItem(storageKey) || '0', 3);
    let newHighScore = oldHighScore;

    if (score > oldHighScore) {
      localStorage.setItem(storageKey, score.toString());
      newHighScore = score;
    }

    setFinalScore(score);
    setHighScore(newHighScore);
    setGameState("finished");
  };

  const handleResetGame = () => {
    setGameState("setup");
    setSelectedOp(null);
    setSelectedNum(null);
    setFinalScore(0);
    setHighScore(0);
  };

  if (gameState === "setup") {
    return (
      <SetupView 
        selectedOp={selectedOp}
        setSelectedOp={setSelectedOp}
        selectedNum={selectedNum}
        setSelectedNum={setSelectedNum}
        onConfirm={handleStartGame}
      />
    );
  }

  if (gameState === "playing") {
    return (
      <GameView
        totalTimeInSeconds={15} 
        operation={selectedOp as 'add' | 'sub' | 'mult' | 'div'}
        tableNumber={selectedNum as number | 'mix'}
        onTimeUp={handleTimeUp}
      />
    );
  }

  if (gameState === "finished") {
    return (
      <ResultsView 
        score={finalScore}
        highScore={highScore}
        onPlayAgain={handleResetGame} 
        onGoHome={handleResetGame}    
      />
    );
  }
}