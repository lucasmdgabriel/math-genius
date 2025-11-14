'use client';

import React, { useState, useEffect } from 'react';
import { Delete } from 'lucide-react';

interface GameViewProps {
  totalTimeInSeconds: number;
  operation: 'add' | 'sub' | 'mult' | 'div';
  tableNumber: number | 'mix';
  // MODIFICADO: Agora envia a pontuação final
  onTimeUp: (finalScore: number) => void; 
}

interface Question {
  text: string;
  answer: number;
}

// ... (Funções formatTime e randomInt continuam iguais) ...
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
  
  // NOVO: Estado para rastrear a pontuação
  const [score, setScore] = useState(0);

  // ... (Função generateQuestion continua igual) ...
  const generateQuestion = (): Question => {
    let op = operation;
    let table = tableNumber;

    if (tableNumber === 'mix') {
      const ops = ['add', 'sub', 'mult', 'div'] as const;
      op = ops[randomInt(0, 3)];
      table = randomInt(1, 9);
    }
    
    if (table === 0) {
      if (op === 'div') { op = 'mult'; }
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
  };


  // Hook do Cronômetro (MODIFICADO)
  useEffect(() => {
    if (timeLeft <= 0) {
      // Envia a pontuação final ao invés de só chamar onTimeUp()
      onTimeUp(score); 
      return;
    }
    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [timeLeft, onTimeUp, score]); // Adicionado 'score' à lista de dependências

  // ... (Hooks de progresso e primeira pergunta continuam iguais) ...
  useEffect(() => {
    const newProgress = (timeLeft / totalTimeInSeconds) * 100;
    setProgress(newProgress);
  }, [timeLeft, totalTimeInSeconds]);

  useEffect(() => {
    setCurrentQuestion(generateQuestion());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 


  // ... (Handlers de clique e backspace continuam iguais) ...
  const handleNumberClick = (num: number) => {
    if (currentAnswer.length < 4) {
      setCurrentAnswer((prev) => prev + num.toString());
    }
  };
  const handleBackspace = () => {
    setCurrentAnswer((prev) => prev.slice(0, -1));
  };

  
  // handleConfirm (MODIFICADO)
  const handleConfirm = () => {
    if (currentAnswer.length === 0) return;

    const userAnswer = parseInt(currentAnswer, 10);
    
    if (userAnswer === currentQuestion.answer) {
      console.log("Acertou!");
      // Incrementa a pontuação
      setScore((prevScore) => prevScore + 1);
    } else {
      console.log("Errou!");
    }
    
    // Lógica para não repetir a pergunta
    let newQuestion = generateQuestion();
    while (newQuestion.text === currentQuestion.text) {
      newQuestion = generateQuestion();
    }
    
    setCurrentQuestion(newQuestion);
    setCurrentAnswer("");
  };

  // ... (O JSX do return continua exatamente o mesmo) ...
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden p-6 sm:p-8 flex flex-col">
        {/* ... (Todo o JSX do timer, pergunta, input e teclado) ... */}
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
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
        {/* Pergunta */}
        <div className="bg-gray-100 rounded-2xl p-8 mb-4 flex items-center justify-center shadow-inner min-h-[100px]">
          <span className="text-4xl font-black text-gray-800 tracking-wide">
            {currentQuestion.text}
          </span>
        </div>
        {/* Resposta */}
        <div className="border-2 border-gray-200 rounded-2xl p-4 mb-8 flex items-center justify-center min-h-[70px] bg-gray-50">
          <span className={`text-3xl font-bold ${currentAnswer ? 'text-gray-800' : 'text-gray-400'}`}>
            {currentAnswer || "?"}
          </span>
        </div>
        {/* Teclado */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="bg-white border border-gray-100 shadow-sm rounded-2xl py-4 text-2xl font-bold text-gray-700 hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all"
            >
              {num}
            </button>
          ))}
          <div className="p-4"></div> 
          <button
            onClick={() => handleNumberClick(0)}
            className="bg-white border border-gray-100 shadow-sm rounded-2xl py-4 text-2xl font-bold text-gray-700 hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="flex items-center justify-center bg-white border border-gray-100 shadow-sm rounded-2xl py-4 text-gray-700 hover:bg-red-50 hover:text-red-500 active:scale-95 transition-all group"
          >
            <Delete size={28} className="group-hover:stroke-red-500" />
          </button>
        </div>
        {/* Confirmar */}
        <button
          onClick={handleConfirm}
          disabled={currentAnswer.length === 0}
          className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all text-lg"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
}