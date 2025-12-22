'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Delete } from 'lucide-react';
import StreakIndicator from '../components/StreakIndicator';

interface GameViewProps {
  totalTimeInSeconds: number;
  operation: 'add' | 'sub' | 'mult' | 'div' | 'equation' | 'sqrt';
  tableNumber: number | 'mix' | 'equation';
  gameMode?: 'normal' | 'equations';
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
  gameMode = 'normal',
  onTimeUp
}: GameViewProps) {

  const [timeLeft, setTimeLeft] = useState(totalTimeInSeconds);
  const [progress, setProgress] = useState(100);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState<Question>({ text: "", answer: 0 });
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [isEquationMode] = useState(gameMode === 'equations');
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  
  // Referências para os áudios
  const correctSoundRef = React.useRef<any>(null);
  const wrongSoundRef = React.useRef<any>(null);
  const chainSoundRef = React.useRef<any>(null);
  const audioContextRef = React.useRef<AudioContext | null>(null);

  // Inicializa os sons
  useEffect(() => {
    // Cria um contexto de áudio usando Web Audio API para sons sintéticos
    const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;
    audioContextRef.current = audioContext;
    
    const playCorrectSound = () => {
      if (!audioContext) return;
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Som de acerto (sequência de notas ascendentes)
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    };
    
    const playWrongSound = () => {
      if (!audioContext) return;
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Som de erro (notas descendentes graves)
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.15);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);
    };
    
    const playChainSound = () => {
      if (!audioContext) return;
      
      const playChainSound = () => {
      if (!audioContext) return;
      
      // Som discreto e suave de sucesso - não distrai
      const now = audioContext.currentTime;
      
      // Tom suave ascendente - discreto mas positivo
      const note1 = audioContext.createOscillator();
      const gain1 = audioContext.createGain();
      note1.type = 'sine';
      note1.frequency.setValueAtTime(880, now); // A5
      gain1.gain.setValueAtTime(0.08, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      note1.connect(gain1);
      gain1.connect(audioContext.destination);
      note1.start(now);
      note1.stop(now + 0.15);
      
      // Segunda nota suave
      const note2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      note2.type = 'sine';
      note2.frequency.setValueAtTime(1046.5, now + 0.08); // C6
      gain2.gain.setValueAtTime(0.06, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      note2.connect(gain2);
      gain2.connect(audioContext.destination);
      note2.start(now + 0.08);
      note2.stop(now + 0.2);
    };
    };
    
    correctSoundRef.current = { play: playCorrectSound };
    wrongSoundRef.current = { play: playWrongSound };
    chainSoundRef.current = { play: playChainSound };
    
    return () => {
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, []);

  const generateQuestion = useCallback((): Question => {
    // Modo de equações
    if (isEquationMode) {
      const a = randomInt(2, 10);
      const x = randomInt(1, 20);
      const b = randomInt(-20, 20);
      const c = a * x + b;
      
      const bSign = b >= 0 ? '+' : '-';
      const bAbs = Math.abs(b);
      const questionText = `${a}x ${bSign} ${bAbs} = ${c}`;
      
      return { text: questionText, answer: x };
    }

    // Modo normal (operações básicas)
    let op = operation;
    let table: number | string;

    if (tableNumber === 'mix') {
      table = randomInt(1, 10);
    } else {
      table = tableNumber;
    }
    
    if (table === 0 && op === 'div') { 
      op = 'mult'; 
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
      
      // NOVA PARTE: Lógica da Raiz Quadrada
      case 'sqrt':
        // Sorteamos a resposta primeiro (entre 1 e 12) para garantir raiz exata
        // Se table for 0, usamos um range maior. Se não, usamos table como base de dificuldade
        const maxRoot = table === 0 ? 10 : Math.max(Number(table) + 5, 10);
        answer = randomInt(1, maxRoot); 
        const square = answer * answer; // O número que vai dentro da raiz
        questionText = `√${square} =`;
        break;

      default: 
        num1 = 1; num2 = 1; questionText = "1 + 1 ="; answer = 2;
        break;
    }
    return { text: questionText, answer };
  }, [operation, tableNumber, isEquationMode]);

  useEffect(() => {
    // Para modo de equações, termina após 5 questões
    if (isEquationMode && questionsAnswered >= 5) {
      onTimeUp(score);
      return;
    }
    
    if (timeLeft <= 0) {
      if (isEquationMode) {
        // No modo de equações, pula para próxima questão quando o tempo acaba
        setQuestionsAnswered(prev => prev + 1);
        if (questionsAnswered + 1 >= 5) {
          onTimeUp(score);
          return;
        }
        // Reseta o timer para a próxima questão
        setTimeLeft(60);
        setStreak(0);
        let newQuestion = generateQuestion();
        setCurrentQuestion(newQuestion);
        setCurrentAnswer("");
      } else {
        onTimeUp(score);
      }
      return;
    }
    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [timeLeft, onTimeUp, score]);

  useEffect(() => {
    const newProgress = isEquationMode 
      ? ((5 - questionsAnswered) / 5) * 100  // Progresso baseado em questões restantes
      : (timeLeft / totalTimeInSeconds) * 100; // Progresso baseado no tempo
    setProgress(newProgress);
  }, [timeLeft, totalTimeInSeconds, isEquationMode, questionsAnswered]);

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
      setStreak((prevStreak) => {
        const newStreak = prevStreak + 1;
        
        // Toca som de acerto normal
        if (correctSoundRef.current) {
          correctSoundRef.current.play();
        }
        
        // Toca som de CHAIN se atingir 5 ou mais acertos consecutivos
        if (newStreak >= 5 && chainSoundRef.current) {
          setTimeout(() => {
            chainSoundRef.current.play();
          }, 150);
        }
        
        return newStreak;
      });
      
      // No modo de equações, incrementa contador e reseta timer
      if (isEquationMode) {
        setQuestionsAnswered(prev => prev + 1);
        if (questionsAnswered + 1 >= 5) {
          return; // O useEffect vai lidar com o fim do jogo
        }
        setTimeLeft(60); // Reseta para 1 minuto
      }
      
      let newQuestion = generateQuestion();
      while (newQuestion.text === currentQuestion.text) {
        newQuestion = generateQuestion();
      }
      
      setCurrentQuestion(newQuestion);
      setCurrentAnswer("");
    } else {
      // Toca som de erro
      if (wrongSoundRef.current) {
        wrongSoundRef.current.play();
      }
      setStreak(0);
      
      // Mostra a resposta correta
      setCorrectAnswer(currentQuestion.answer);
      setShowCorrectAnswer(true);
      
      // Aguarda 2 segundos antes de gerar nova questão
      setTimeout(() => {
        setShowCorrectAnswer(false);
        setCorrectAnswer(null);
        
        // No modo de equações, incrementa contador e reseta timer
        if (isEquationMode) {
          setQuestionsAnswered(prev => prev + 1);
          if (questionsAnswered + 1 >= 5) {
            return; // O useEffect vai lidar com o fim do jogo
          }
          setTimeLeft(60); // Reseta para 1 minuto
        }
        
        let newQuestion = generateQuestion();
        while (newQuestion.text === currentQuestion.text) {
          newQuestion = generateQuestion();
        }
        
        setCurrentQuestion(newQuestion);
        setCurrentAnswer("");
      }, 2000);
    }
  }, [currentAnswer, currentQuestion.text, currentQuestion.answer, generateQuestion, isEquationMode, questionsAnswered]);

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
            
            {/* Indicador de Streak - não mostra no modo equações */}
            {!isEquationMode && (
              <div className="relative">
                <StreakIndicator streak={streak} maxStreak={10} />
              </div>
            )}

            {/* Contador de questões para modo equações */}
            {isEquationMode && (
              <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-md border-2 border-purple-200">
                <span className="text-sm text-gray-600 font-semibold">QUESTÃO</span>
                <span className="text-2xl font-black text-purple-600">
                  {questionsAnswered + 1}/5
                </span>
              </div>
            )}

            {/* Contador de acertos */}
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
            {isEquationMode ? (
              <span className="text-3xl md:text-4xl font-black text-gray-800 tracking-wide text-center">
                {currentQuestion.text.split('x').map((part, index, arr) => (
                  <React.Fragment key={index}>
                    {part}
                    {index < arr.length - 1 && <span className="text-purple-600">x</span>}
                  </React.Fragment>
                ))}
              </span>
            ) : (
              <span className="text-4xl md:text-5xl font-black text-gray-800 tracking-wide">
                {currentQuestion.text}
              </span>
            )}
          </div>

          <div className={`border-2 rounded-2xl p-4 mb-4 md:mb-0 flex flex-col items-center justify-center min-h-[100px] flex-1 transition-all duration-300 ${
            showCorrectAnswer 
              ? 'bg-red-50 border-red-300' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            {showCorrectAnswer ? (
              <>
                <span className="text-sm text-red-600 font-semibold mb-2">Resposta correta:</span>
                <span className="text-3xl md:text-4xl font-bold text-red-600">
                  {isEquationMode ? `x = ${correctAnswer}` : correctAnswer}
                </span>
              </>
            ) : (
              <span className={`text-3xl md:text-4xl font-bold ${currentAnswer ? 'text-gray-800' : 'text-gray-400'}`}>
                {currentAnswer || "?"}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col h-full">
          <div className="grid grid-cols-3 gap-3 mb-8 flex-1">
            {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num)}
                disabled={showCorrectAnswer}
                className={`bg-white border border-gray-100 shadow-sm rounded-2xl py-4 md:py-6 text-2xl font-bold text-gray-700 transition-all ${
                  showCorrectAnswer 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-gray-50 active:bg-gray-100 active:scale-95'
                }`}
              >
                {num}
              </button>
            ))}

            <div className="p-4"></div> 
            
            <button
              onClick={() => handleNumberClick(0)}
              disabled={showCorrectAnswer}
              className={`bg-white border border-gray-100 shadow-sm rounded-2xl py-4 md:py-6 text-2xl font-bold text-gray-700 transition-all ${
                showCorrectAnswer 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-50 active:bg-gray-100 active:scale-95'
              }`}
            >
              0
            </button>

            <button
              onClick={handleBackspace}
              disabled={showCorrectAnswer}
              className={`flex items-center justify-center bg-white border border-gray-100 shadow-sm rounded-2xl py-4 md:py-6 text-gray-700 transition-all group ${
                showCorrectAnswer 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-red-50 hover:text-red-500 active:scale-95'
              }`}
            >
              <Delete size={28} className="group-hover:stroke-red-500" />
            </button>
          </div>

          <button
            onClick={handleConfirm}
            disabled={currentAnswer.length === 0 || showCorrectAnswer}
            className={`w-full font-bold py-5 rounded-xl shadow-lg transition-all text-lg ${
              currentAnswer.length === 0 || showCorrectAnswer
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            Confirmar
          </button>
        </div>

      </div>
    </div>
  );
}