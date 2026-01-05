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
    { id: 'add', symbol: <Plus size={32} />, label: 'Adição', color: 'bg-blue-500', ring: 'ring-blue-300' },
    { id: 'sub', symbol: <Minus size={32} />, label: 'Subtração', color: 'bg-green-500', ring: 'ring-green-300' },
    { id: 'mult', symbol: <X size={32} />, label: 'Multiplicação', color: 'bg-orange-500', ring: 'ring-orange-300' },
    { id: 'div', symbol: <Divide size={32} />, label: 'Divisão', color: 'bg-red-500', ring: 'ring-red-300' },
    { id: 'sqrt', symbol: <Radical size={32} />, label: 'Raiz Quadrada', color: 'bg-purple-500', ring: 'ring-purple-300' },
  ];

  const numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3];

  // Função para lidar com a troca de operação
  const handleOpSelect = (opId: string) => {
    setSelectedOp(opId);
    // Se for raiz quadrada, força o modo "mix" pois não faz sentido tabuada individual
    if (opId === 'sqrt') {
      setSelectedNum('mix');
    } else if (selectedNum === 'mix' && opId !== 'sqrt') {
      // Opcional: mantém o mix ou reseta se preferir
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4 font-sans">
      
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="text-center pt-6 pb-4 px-8">
          <div className="inline-flex bg-purple-100 p-3 rounded-2xl mb-3">
            <Brain size={32} className="text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">Gênio da Matemática</h1>
          <p className="text-gray-600 text-sm font-medium">Treine seu raciocínio e supere seus limites</p>
        </div>

        {/* Seletor de Modo */}
        <div className="px-8 pb-8">
          <h2 className="text-center text-gray-900 font-bold mb-5 text-lg">
            Escolha o Modo de Jogo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-8">
            <button
              onClick={() => {
                setGameMode('normal');
                setSelectedOp(null);
                setSelectedNum(null);
              }}
              className={`
                p-6 rounded-2xl flex flex-col items-center gap-3 transition-all duration-200 shadow-md
                ${gameMode === 'normal' 
                  ? 'bg-purple-600 text-white ring-4 ring-purple-300 scale-105' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
              `}
            >
              <Brain size={32} />
              <div className="text-center">
                <div className="font-bold text-lg">Desafios Simples</div>
                <div className="text-sm opacity-90">45 segundos de desafio</div>
              </div>
            </button>

            <button
              onClick={() => {
                setGameMode('equations');
                setSelectedOp('equation');
                setSelectedNum('equation');
              }}
              className={`
                p-6 rounded-2xl flex flex-col items-center gap-3 transition-all duration-200 shadow-md
                ${gameMode === 'equations' 
                  ? 'bg-purple-600 text-white ring-4 ring-purple-300 scale-105' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
              `}
            >
              <Calculator size={32} />
              <div className="text-center">
                <div className="font-bold text-lg">Equações 1º Grau</div>
                <div className="text-sm opacity-90">5 questões • 1 min cada</div>
              </div>
            </button>
          </div>

          {/* Conteúdo baseado no modo */}
          {gameMode === 'normal' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Operações */}
              <div>
                <h2 className="text-center md:text-left text-gray-900 font-bold mb-6 text-lg">
                  1. Escolha a Operação
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {operations.map((op) => {
                    const isSelected = selectedOp === op.id;
                    return (
                      <button
                        key={op.id}
                        onClick={() => handleOpSelect(op.id)}
                        className={`
                          ${op.color} text-white p-6 rounded-2xl 
                          flex flex-col items-center justify-center gap-2 
                          transition-all duration-200 shadow-md aspect-square
                          hover:opacity-90 active:scale-95
                          ${isSelected ? `ring-4 ${op.ring} scale-105 shadow-lg` : 'opacity-100'}
                        `}
                      >
                        <div className="font-bold">{op.symbol}</div>
                        <span className="text-sm font-semibold">{op.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tabuadas / Seleção de Número */}
              <div>
                <h2 className={`text-center md:text-left font-bold mb-6 text-lg transition-colors ${selectedOp === 'sqrt' ? 'text-purple-600' : 'text-gray-900'}`}>
                  2. {selectedOp === 'sqrt' ? 'Modo Aleatório Ativado' : 'Escolha a Tabuada'}
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {numbers.map((num) => {
                    const isSelected = selectedNum === num;
                    const isDisabled = selectedOp === 'sqrt'; // Desabilita botões individuais para raiz
                    return (
                      <button
                        key={num}
                        disabled={isDisabled}
                        onClick={() => setSelectedNum(num)}
                        className={`
                          font-bold text-xl py-5 rounded-xl transition-all duration-200
                          ${isSelected 
                            ? 'bg-purple-600 text-white shadow-md scale-105' 
                            : isDisabled
                              ? 'bg-gray-100 text-gray-300 cursor-not-allowed opacity-50'
                              : 'bg-purple-100 text-purple-600 hover:bg-purple-200'}
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
                      font-bold text-xl py-5 rounded-xl transition-all duration-200
                      ${selectedNum === 0 
                        ? 'bg-purple-600 text-white shadow-md scale-105' 
                        : selectedOp === 'sqrt'
                          ? 'bg-gray-100 text-gray-300 cursor-not-allowed opacity-50'
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
                {selectedOp === 'sqrt' && (
                  <p className="mt-4 text-sm text-purple-600 bg-purple-50 p-3 rounded-lg border border-purple-100 animate-pulse">
                    ✨ Na raiz quadrada, usaremos números aleatórios para testar você!
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-purple-50 rounded-2xl p-8 mb-6">
                <h3 className="text-xl font-bold text-purple-900 mb-4">Como funciona?</h3>
                <ul className="text-left space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-sm font-bold">1</span>
                    <span>Resolva <strong>5 equações de 1º grau</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-sm font-bold">2</span>
                    <span>Você tem <strong>1 minuto</strong> para cada equação</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-sm font-bold">3</span>
                    <span>Encontre o valor de <strong>X</strong></span>
                  </li>
                </ul>
              </div>
              <p className="text-gray-600 text-sm">
                Exemplo: <span className="font-mono font-bold">2x + 5 = 13</span> → Resposta: <span className="font-bold">x = 4</span>
              </p>
            </div>
          )}

          {/* Botão de Confirmar */}
          <div className="mt-8">
            <button 
              onClick={onConfirm}
              disabled={gameMode === 'normal' && (!selectedOp || selectedNum === null)}
              className={`
                w-full font-bold py-5 rounded-xl shadow-lg transition-all duration-300 text-xl tracking-wide
                ${(gameMode === 'normal' && (!selectedOp || selectedNum === null))
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-xl transform hover:-translate-y-1'}
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