'use client';

import React from 'react';
import { Plus, Minus, X, Divide, Shuffle, Brain } from 'lucide-react';

interface SetupScreenProps {
  selectedOp: string | null;
  setSelectedOp: React.Dispatch<React.SetStateAction<string | null>>;
  selectedNum: number | string | null;
  setSelectedNum: React.Dispatch<React.SetStateAction<number | string | null>>;
  onConfirm: () => void;
}

export default function SetupScreen({
  selectedOp,
  setSelectedOp,
  selectedNum,
  setSelectedNum,
  onConfirm
}: SetupScreenProps) {

  const operations = [
    { id: 'add', symbol: <Plus size={32} />, label: 'Adição', color: 'bg-blue-500', ring: 'ring-blue-300' },
    { id: 'sub', symbol: <Minus size={32} />, label: 'Subtração', color: 'bg-green-500', ring: 'ring-green-300' },
    { id: 'mult', symbol: <X size={32} />, label: 'Multiplicação', color: 'bg-orange-500', ring: 'ring-orange-300' },
    { id: 'div', symbol: <Divide size={32} />, label: 'Divisão', color: 'bg-red-500', ring: 'ring-red-300' },
  ];

  const numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        
        {/* Header */}
        <div className="flex flex-col items-center md:col-span-2 mb-2">
          <div className="bg-purple-100 p-4 rounded-2xl mb-4 text-purple-600">
            <Brain size={40} />
          </div>
          <h1 className="text-3xl font-bold text-purple-600 mb-1 text-center">Gênio da Matemática</h1>
          <p className="text-gray-500 text-base font-medium text-center">Pronto para treinar seu cérebro?</p>
        </div>

        <div className="flex flex-col justify-center">
          <h2 className="text-center md:text-left text-gray-900 font-bold mb-6 text-lg">
            1. Escolha o desafio:
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {operations.map((op) => {
              const isSelected = selectedOp === op.id;
              return (
                <button
                  key={op.id}
                  onClick={() => setSelectedOp(op.id)}
                  className={`
                    ${op.color} text-white p-6 rounded-2xl 
                    flex flex-col items-center justify-center gap-2 
                    transition-all duration-200 shadow-md aspect-square
                    hover:opacity-90 active:scale-95
                    ${isSelected ? `ring-4 ${op.ring} scale-105 shadow-lg z-10` : 'opacity-100'}
                  `}
                >
                  <div className="font-bold">{op.symbol}</div>
                  <span className="text-sm font-medium">{op.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <h2 className="text-center md:text-left text-gray-900 font-bold mb-6 text-lg">
            2. Escolha a tabuada:
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {numbers.map((num) => {
              const isSelected = selectedNum === num;
              return (
                <button
                  key={num}
                  onClick={() => setSelectedNum(num)}
                  className={`
                    font-bold text-xl py-5 rounded-xl transition-all duration-200
                    ${isSelected 
                      ? 'bg-purple-600 text-white shadow-md scale-105' 
                      : 'bg-purple-100 text-purple-600 hover:bg-purple-200'}
                  `}
                >
                  {num}
                </button>
              );
            })}
            
            <button
              onClick={() => setSelectedNum(0)}
              className={`
                font-bold text-xl py-5 rounded-xl transition-all duration-200
                ${selectedNum === 0 
                  ? 'bg-purple-600 text-white shadow-md scale-105' 
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'}
              `}
            >
              0
            </button>

            <button
              onClick={() => setSelectedNum('mix')}
              className={`
                col-span-2 flex flex-col items-center justify-center rounded-xl transition-all duration-200 py-2
                ${selectedNum === 'mix' 
                  ? 'bg-purple-600 text-white shadow-md scale-105' 
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'}
              `}
            >
              <Shuffle size={20} className="mb-1" />
              <span className="text-sm font-medium">Mix</span>
            </button>
          </div>
        </div>

        <div className="md:col-span-2 pt-4">
          <button 
            onClick={onConfirm}
            disabled={!selectedOp || selectedNum === null}
            className={`
              w-full font-bold py-5 rounded-xl shadow-lg transition-all duration-300 text-xl tracking-wide
              ${(!selectedOp || selectedNum === null) 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-xl transform hover:-translate-y-1'}
            `}
          >
            Começar Desafio!
          </button>
        </div>

      </div>
    </div>
  );
}