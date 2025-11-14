'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Delete } from 'lucide-react';

interface GameViewProps {
  totalTimeInSeconds: number;
  operation: 'add' | 'sub' | 'mult' | 'div';
  tableNumber: number | 'mix';
  onTimeUp: (finalScore: number) => void; 
}

interface Question {
  text: string;
  answer: number;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default function GameView({
  totalTimeInSeconds,
  operation,
  tableNumber,
  onTimeUp
}: GameViewProps) {

  const [timeLeft, setTimeLeft] = useState(totalTimeInSeconds);
  const [progress, setProgress] = useState(100);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState<Question>({ text: "", answer: 0 });
  const [score, setScore] = useState(0);

  const generateQuestion = useCallback((): Question => {
    let op = operation;
    let table: number | string;

    if (tableNumber === 'mix') {
      table = randomInt(1, 10);
    } else {
      table = tableNumber;
    }
    
    if (table === 0) {
      if (op === 'div') { 
        op = 'mult'; 
      }
    }

    let num1: number, num2: number, questionText: string, answer: number;

    switch (op) {
      case 'add':
        num1 = Number(table);
        num2 = randomInt(1, 10);
        questionText = `${num1} + ${num2} =`;
        answer = num1 + num2;
        break;
      case 'sub':
        num2 = Number(table);
        num1 = randomInt(num2, num2 + 10); 
        questionText = `${num1} - ${num2} =`;
        answer = num1 - num2;
        break;
      case 'mult':
        num1 = Number(table);
        num2 = randomInt(1, 10);
        questionText = `${num1} x ${num2} =`;
        answer = num1 * num2;
        break;
      case 'div':
        num2 = Number(table);
        if (num2 === 0) { 
          num1 = 0;
          num2 = randomInt(1, 10); 
          questionText = `${num1} x ${num2} =`; 
          answer = 0;
        } else {
          const result = randomInt(1, 10);
          num1 = num2 * result; 
          questionText = `${num1} ÷ ${num2} =`;
          answer = result;
        }
        break;
      default: 
        num1 = 1; num2 = 1; questionText = "1 + 1 ="; answer = 2;
        break;
    }
    return { text: questionText, answer };
  }, [operation, tableNumber]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp(score); 
      return;
    }
    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [timeLeft, onTimeUp, score]);

  useEffect(() => {
    const newProgress = (timeLeft / totalTimeInSeconds) * 100;
    setProgress(newProgress);
  }, [timeLeft, totalTimeInSeconds]);

  useEffect(() => {
    setCurrentQuestion(generateQuestion());
  }, [generateQuestion]); 

  const handleNumberClick = useCallback((num: number) => {
    if (currentAnswer.length < 4) {
      setCurrentAnswer((prev) => prev + num.toString());
    }
  }, [currentAnswer]);

  const handleBackspace = useCallback(() => {
    setCurrentAnswer((prev) => prev.slice(0, -1));
  }, []);

  const handleConfirm = useCallback(() => {
    if (currentAnswer.length === 0) return;

    const userAnswer = parseInt(currentAnswer, 10);
    
    if (userAnswer === currentQuestion.answer) {
      setScore((prevScore) => prevScore + 1);
    }
    
    let newQuestion = generateQuestion();
    while (newQuestion.text === currentQuestion.text) {
      newQuestion = generateQuestion();
    }
    
    setCurrentQuestion(newQuestion);
    setCurrentAnswer("");
  }, [currentAnswer, currentQuestion.text, currentQuestion.answer, generateQuestion]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleConfirm();
      }
      
      if (event.key >= '0' && event.key <= '9') {
        event.preventDefault();
        handleNumberClick(Number(event.key));
      }
      
      if (event.key === 'Backspace') {
        event.preventDefault();
        handleBackspace();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleConfirm, handleNumberClick, handleBackspace]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

        <div className="flex flex-col h-full">
          <div className="flex items-center gap-4 mb-8">
            
            {/* ADICIONADO AQUI */}
            <span className="text-lg font-bold text-purple-600 whitespace-nowrap">
              Acertos: {score}
            </span>

            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-300 ease-linear rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className={`text-gray-700 font-bold font-mono text-lg ${timeLeft <= 10 && timeLeft > 0 ? 'text-red-500 animate-pulse' : ''}`}>
              {formatTime(timeLeft)}
            </span>
          </div>

          <div className="bg-gray-100 rounded-2xl p-8 mb-4 flex items-center justify-center shadow-inner flex-1 min-h-[150px]">
            <span className="text-4xl md:text-5xl font-black text-gray-800 tracking-wide">
              {currentQuestion.text}
            </span>
          </div>

          <div className="border-2 border-gray-200 rounded-2xl p-4 mb-4 md:mb-0 flex items-center justify-center min-h-[100px] bg-gray-50 flex-1">
            <span className={`text-3xl md:text-4xl font-bold ${currentAnswer ? 'text-gray-800' : 'text-gray-400'}`}>
              {currentAnswer || "?"}
            </span>
          </div>
        </div>

        <div className="flex flex-col h-full">
          <div className="grid grid-cols-3 gap-3 mb-8 flex-1">
            {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num)}
                className="bg-white border border-gray-100 shadow-sm rounded-2xl py-4 md:py-6 text-2xl font-bold text-gray-700 hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all"
              >
                {num}
              </button>
            ))}

            <div className="p-4"></div> 
            
            <button
              onClick={() => handleNumberClick(0)}
              className="bg-white border border-gray-100 shadow-sm rounded-2xl py-4 md:py-6 text-2xl font-bold text-gray-700 hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all"
            >
              0
            </button>

            <button
              onClick={handleBackspace}
              className="flex items-center justify-center bg-white border border-gray-100 shadow-sm rounded-2xl py-4 md:py-6 text-gray-700 hover:bg-red-50 hover:text-red-500 active:scale-95 transition-all group"
            >
              <Delete size={28} className="group-hover:stroke-red-500" />
            </button>
          </div>

          <button
            onClick={handleConfirm}
            disabled={currentAnswer.length === 0}
            className="w-full bg-purple-600 text-white font-bold py-5 rounded-xl shadow-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all text-lg"
          >
            Confirmar
          </button>
        </div>

      </div>
    </div>
  );
}