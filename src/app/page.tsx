'use client';

import { useState, useEffect } from "react";
import SetupView from "./views/SetupView";
import GameView from "./views/GameView";
import ResultsView from "./views/ResultView";

type GameState = "setup" | "playing" | "finished";
type GameMode = "normal" | "equations";

export default function Home() {
  const [selectedOp, setSelectedOp] = useState<string | null>(null);
  const [selectedNum, setSelectedNum] = useState<number | string | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>("normal");

  const [gameState, setGameState] = useState<GameState>("setup");
  const [finalScore, setFinalScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const [storageKey, setStorageKey] = useState('highscore_default');

  useEffect(() => {
    const op = selectedOp || 'add';
    const num = selectedNum === 'mix' ? 'mix' : selectedNum || 0;
    const key = `highscore_${op}_${num}`;
    setStorageKey(key);
  }, [selectedOp, selectedNum]);

  const handleStartGame = () => {
    if (selectedOp && selectedNum !== null) {
      setGameState("playing");
    }
  };

  const handleTimeUp = (score: number) => {
    const oldHighScore = parseInt(localStorage.getItem(storageKey) || '0', 10);
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
    setGameMode("normal");
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
        gameMode={gameMode}
        setGameMode={setGameMode}
        onConfirm={handleStartGame}
      />
    );
  }

  if (gameState === "playing") {
    return (
      <GameView
        totalTimeInSeconds={gameMode === "equations" ? 60 : 45}
        operation={selectedOp as 'add' | 'sub' | 'mult' | 'div' | 'equation'}
        tableNumber={selectedNum as number | 'mix'}
        gameMode={gameMode}
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