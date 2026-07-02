'use client';

import React from 'react';
import { Plus, Minus, X, Divide, Shuffle, Brain, Calculator, Radical } from 'lucide-react';

interface SetupScreenProps {
  selectedOp: string | null;
  setSelectedOp: React.Dispatch<React.SetStateAction<string | null>>;
  selectedNum: number | string | null;
  setSelectedNum: React.Dispatch<React.SetStateAction<number | string | null>>;
  gameMode: 'normal' | 'equations';
  setGameMode: React.Dispatch<React.SetStateAction<'normal' | 'equations'>>;
  onConfirm: () => void;
}

export default function SetupScreen({
  selectedOp,
  setSelectedOp,
  selectedNum,
  setSelectedNum,
  gameMode,
  setGameMode,
  onConfirm
}: SetupScreenProps) {

  const operations = [
    { id: 'add', symbol: <Plus size={28} />, label: 'Adição', color: 'bg-blue-600', ring: 'ring-blue-400' },
    { id: 'sub', symbol: <Minus size={28} />, label: 'Subtração', color: 'bg-emerald-600', ring: 'ring-emerald-400' },
    { id: 'mult', symbol: <X size={28} />, label: 'Multiplicação', color: 'bg-orange-600', ring: 'ring-orange-400' },
    { id: 'div', symbol: <Divide size={28} />, label: 'Divisão', color: 'bg-rose-600', ring: 'ring-rose-400' },
    { id: 'sqrt', symbol: <Radical size={28} />, label: 'Raiz Quadrada', color: 'bg-violet-600', ring: 'ring-violet-400' },
  ];

  const numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3];

  const handleOpSelect = (opId: string) => {
    setSelectedOp(opId);
    if (opId === 'sqrt') {
      setSelectedNum('mix');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      
      <div className="w-full max-w-3xl">
        
        <div className="text-center mb-6">
          <div className="inline-flex bg-violet-100 p-3 rounded-xl mb-3">
            <Brain size={28} className="text-violet-700" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">Gênio da Matemática</h1>
          <p className="text-gray-500 text-sm font-medium">Treine seu raciocínio e supere seus limites</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-center text-gray-900 font-bold mb-4 text-base">
            Escolha o Modo de Jogo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => {
                setGameMode('normal');
                if (selectedOp === 'equation') setSelectedOp(null);
                if (selectedNum === 'equation') setSelectedNum(null);
              }}
              className={`
                p-5 rounded-xl flex flex-col items-center gap-2 transition-all duration-200 border
                ${gameMode === 'normal' 
                  ? 'bg-violet-50 border-violet-500 text-violet-700' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}
              `}
            >
              <Brain size={28} />
              <div className="text-center">
                <div className="font-bold text-base">Desafios Simples</div>
                <div className="text-xs opacity-80">45 segundos de desafio</div>
              </div>
            </button>

            <button
              onClick={() => {
                setGameMode('equations');
                setSelectedOp('equation');
                setSelectedNum('equation');
              }}
              className={`
                p-5 rounded-xl flex flex-col items-center gap-2 transition-all duration-200 border
                ${gameMode === 'equations' 
                  ? 'bg-violet-50 border-violet-500 text-violet-700' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}
              `}
            >
              <Calculator size={28} />
              <div className="text-center">
                <div className="font-bold text-base">Equações 1º Grau</div>
                <div className="text-xs opacity-80">5 questões • 1 min cada</div>
              </div>
            </button>
          </div>

          {gameMode === 'normal' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-center md:text-left text-gray-900 font-bold mb-4 text-sm">
                  1. Escolha a Operação
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {operations.map((op) => {
                    const isSelected = selectedOp === op.id;
                    return (
                      <button
                        key={op.id}
                        onClick={() => handleOpSelect(op.id)}
                        className={`
                          ${isSelected ? `${op.color} ring-4 ${op.ring} text-white` : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} 
                          p-4 rounded-xl flex flex-col items-center justify-center gap-1.5 
                          transition-all duration-200 aspect-square
                          active:scale-95
                        `}
                      >
                        <div className="font-bold">{op.symbol}</div>
                        <span className="text-xs font-semibold">{op.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h2 className={`text-center md:text-left font-bold mb-4 text-sm transition-colors ${selectedOp === 'sqrt' ? 'text-violet-600' : 'text-gray-900'}`}>
                  2. {selectedOp === 'sqrt' ? 'Modo Aleatório Ativado' : 'Escolha a Tabuada'}
                </h2>
                <div className="grid grid-cols-3 gap-2">
                  {numbers.map((num) => {
                    const isSelected = selectedNum === num;
                    const isDisabled = selectedOp === 'sqrt';
                    return (
                      <button
                        key={num}
                        disabled={isDisabled}
                        onClick={() => setSelectedNum(num)}
                        className={`
                          font-bold text-lg py-4 rounded-xl transition-all duration-200
                          ${isSelected 
                            ? 'bg-violet-600 text-white' 
                            : isDisabled
                              ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                        `}
                      >
                        {num}
                      </button>
                    );
                  })}
                  
                  <button
                    disabled={selectedOp === 'sqrt'}
                    onClick={() => setSelectedNum(0)}
                    className={`
                      font-bold text-lg py-4 rounded-xl transition-all duration-200
                      ${selectedNum === 0 
                        ? 'bg-violet-600 text-white' 
                        : selectedOp === 'sqrt'
                          ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                    `}
                  >
                    0
                  </button>

                  <button
                    onClick={() => setSelectedNum('mix')}
                    className={`
                      col-span-2 flex flex-col items-center justify-center rounded-xl transition-all duration-200 py-3
                      ${selectedNum === 'mix' 
                        ? 'bg-violet-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                    `}
                  >
                    <Shuffle size={18} className="mb-0.5" />
                    <span className="text-xs font-medium">Mix</span>
                  </button>
                </div>
                {selectedOp === 'sqrt' && (
                  <p className="mt-3 text-xs text-violet-700 bg-violet-50 p-2.5 rounded-lg border border-violet-200">
                    Na raiz quadrada, usaremos números aleatórios para testar você!
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-lg mx-auto text-center">
              <div className="bg-gray-50 rounded-xl p-6 mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Como funciona?</h3>
                <ul className="text-left space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start gap-2.5">
                    <span className="bg-violet-600 text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0 text-xs font-bold">1</span>
                    <span>Resolva <strong className="text-gray-900">5 equações de 1º grau</strong></span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="bg-violet-600 text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0 text-xs font-bold">2</span>
                    <span>Você tem <strong className="text-gray-900">1 minuto</strong> para cada equação</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="bg-violet-600 text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0 text-xs font-bold">3</span>
                    <span>Encontre o valor de <strong className="text-gray-900">X</strong></span>
                  </li>
                </ul>
              </div>
              <p className="text-gray-500 text-xs">
                Exemplo: <span className="font-mono font-bold text-gray-700">2x + 5 = 13</span> → Resposta: <span className="font-bold text-violet-600">x = 4</span>
              </p>
            </div>
          )}

          <div className="mt-6">
            <button 
              onClick={onConfirm}
              disabled={gameMode === 'normal' && (!selectedOp || selectedNum === null)}
              className={`
                w-full font-bold py-4 rounded-xl transition-all duration-200 text-base tracking-wide
                ${(gameMode === 'normal' && (!selectedOp || selectedNum === null))
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-linear-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90 active:scale-[0.98]'}
              `}
            >
              {gameMode === 'equations' ? 'Iniciar Desafio de Equações' : 'Começar Desafio'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
