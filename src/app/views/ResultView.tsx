'use client';

import { Home, RotateCcw } from 'lucide-react';

interface ResultsViewProps {
  score: number;
  highScore: number;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export default function ResultsView({ 
  score, 
  highScore,
  onPlayAgain, 
  onGoHome 
}: ResultsViewProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Resultados
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Seu desempenho no desafio
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="text-6xl font-black text-transparent bg-linear-to-br from-violet-600 to-indigo-600 bg-clip-text">
              {score}
            </div>
            <span className="text-gray-500 text-sm font-medium mt-1">
              acertos
            </span>
          </div>

          <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between mb-6">
            <span className="text-gray-500 text-sm">Recorde</span>
            <span className="text-gray-900 font-bold text-lg">{highScore}</span>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={onPlayAgain}
              className="w-full bg-linear-to-r from-violet-600 to-indigo-600 text-white font-bold py-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all text-base flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              Jogar Novamente
            </button>

            <button
              onClick={onGoHome}
              className="w-full bg-gray-100 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-200 active:scale-[0.98] transition-all text-base flex items-center justify-center gap-2"
            >
              <Home size={18} />
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
