'use client';

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
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center">
        
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Resultados do Desafio!
        </h1>

        <div className="bg-purple-100 rounded-2xl p-8 w-full flex flex-col items-center mb-4 shadow-inner">
          <span className="text-7xl font-bold text-purple-600">
            {score}
          </span>
          <span className="text-xl text-gray-700 mt-1">
            Acertos
          </span>
        </div>

        <p className="text-lg text-gray-600 mb-6">
          Seu recorde é: <span className="font-bold text-purple-600">{highScore}</span>
        </p>

        <p className="text-center text-gray-600 mb-8 px-4">
          Parabéns pelo seu esforço! Você está indo muito bem!
        </p>

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={onPlayAgain}
            className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-purple-700 active:scale-95 transition-all text-lg"
          >
            Jogar Novamente
          </button>

          <button
            onClick={onGoHome}
            className="w-full bg-purple-100 text-purple-600 font-bold py-4 rounded-xl hover:bg-purple-200 active:scale-95 transition-all text-lg"
          >
            Voltar ao Início
          </button>
        </div>

      </div>
    </div>
  );
}