'use client'; // Necessário para usar hooks como useState

import { useState } from "react";
import SetupView from "./views/SetupView";

export default function Home() {
  const [selectedOp, setSelectedOp] = useState<string | null>(null);
  const [selectedNum, setSelectedNum] = useState<number | string | null>(null);

  const handleConfirm = () => {
    console.log("Jogo Iniciado!");
    console.log("Operação escolhida:", selectedOp);
    console.log("Número escolhido:", selectedNum);
    
  };

  return (
    <main>
      <SetupView 
        selectedOp={selectedOp}
        setSelectedOp={setSelectedOp}
        selectedNum={selectedNum}
        setSelectedNum={setSelectedNum}
        onConfirm={handleConfirm}
      />  
    </main>
  );
}