'use client';

import React from 'react';
import { Flame } from 'lucide-react';

interface StreakIndicatorProps {
  streak: number;
  maxStreak?: number;
}

export default function StreakIndicator({ streak, maxStreak = 10 }: StreakIndicatorProps) {
  const intensity = Math.min(streak / maxStreak, 1);
  
  const getFlameColor = () => {
    if (intensity === 0) return 'text-gray-400';
    if (intensity < 0.3) return 'text-orange-400';
    if (intensity < 0.6) return 'text-orange-500';
    if (intensity < 0.9) return 'text-red-500';
    return 'text-red-600';
  };

  const getFlameSize = () => {
    if (intensity === 0) return 28;
    if (intensity < 0.3) return 32;
    if (intensity < 0.6) return 36;
    if (intensity < 0.9) return 40;
    return 44;
  };

  const getAnimationClass = () => {
    if (intensity === 0) return '';
    if (intensity < 0.3) return 'flame-flicker-slow';
    if (intensity < 0.6) return 'flame-flicker';
    if (intensity < 0.9) return 'flame-dance';
    return 'flame-blaze';
  };

  return (
    <div className="relative flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-gray-200 shadow-sm">
      {intensity > 0.3 && (
        <div className={`absolute inset-0 rounded-xl blur-2xl ${
          intensity >= 0.9 ? 'bg-red-500' : 'bg-orange-500'
        } opacity-30 animate-pulse`} />
      )}
      
      <div className={`relative ${getAnimationClass()}`}>
        {intensity > 0 && (
          <>
            <div className={`absolute inset-0 blur-2xl ${getFlameColor()} ${
              intensity >= 0.9 ? 'opacity-80' : 'opacity-60'
            } animate-pulse scale-150`} />
            <div className={`absolute inset-0 blur-xl ${getFlameColor()} opacity-70 scale-125`} />
          </>
        )}
        
        <Flame 
          size={getFlameSize()} 
          className={`${getFlameColor()} transition-all duration-300 relative z-10`}
          fill={intensity > 0 ? 'currentColor' : 'none'}
          strokeWidth={intensity === 1 ? 4 : intensity > 0.5 ? 3 : 2}
        />
        
        {intensity >= 0.6 && intensity < 1 && (
          <>
            <div className="absolute -top-2 left-0 w-2 h-2 bg-orange-500 rounded-full animate-ping" />
            <div className="absolute -top-1 -right-2 w-1.5 h-1.5 bg-red-400 rounded-full animate-ping delay-75" />
          </>
        )}
        
        {intensity === 1 && (
          <>
            <div className="absolute -top-3 -left-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
            <div className="absolute -top-4 right-0 w-2.5 h-2.5 bg-orange-400 rounded-full animate-ping delay-75" />
            <div className="absolute -bottom-2 left-2 w-2 h-2 bg-red-400 rounded-full animate-ping delay-150" />
            <div className="absolute top-0 -right-3 w-2 h-2 bg-yellow-500 rounded-full animate-ping delay-100" />
          </>
        )}
      </div>
      
      <div className="flex flex-col items-start relative z-10">
        <span className="text-[10px] text-gray-500 font-semibold leading-none">SEQUÊNCIA</span>
        <span className={`text-xl font-black leading-none transition-all duration-300 ${
          intensity === 1 
            ? 'text-red-500 scale-110 animate-pulse' 
            : intensity > 0.5 
            ? 'text-orange-600 scale-105' 
            : 'text-gray-700'
        }`}>
          {streak}
        </span>
      </div>
      
      {streak > 0 && streak % 5 === 0 && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full animate-pulse z-20 border border-violet-400">
          CHAIN ⚡
        </div>
      )}
    </div>
  );
}
